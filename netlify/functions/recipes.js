import {
  ensureNotionConfigured,
  getNotionClient,
  getPropertyNames,
  isLikelyNotionPageId,
  mapPageToRecipe,
} from './utils/notion.js';

const HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
};

const respond = (statusCode, payload) => ({
  statusCode,
  headers: HEADERS,
  body: JSON.stringify(payload),
});

const clampPageSize = (value) => {
  const numeric = Number.parseInt(value, 10);
  if (Number.isNaN(numeric)) return 50;
  return Math.min(Math.max(numeric, 1), 100);
};

const parseBoolean = (value) =>
  value === true ||
  value === 'true' ||
  value === '1' ||
  value === 1 ||
  value === 'yes';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: HEADERS };
  }

  if (event.httpMethod !== 'GET') {
    return respond(405, { message: 'Method Not Allowed' });
  }

  try {
    ensureNotionConfigured();
  } catch (configError) {
    return respond(500, { message: configError.message });
  }

  const query = event.queryStringParameters || {};
  const search = query.search?.trim();
  const category = query.category?.trim();
  const tagParam = query.tag?.trim();
  const tagsParam = query.tags?.trim();
  const id = query.id?.trim();
  const includeRaw = parseBoolean(query.includeRaw);
  const pageSize = clampPageSize(query.pageSize);
  const startCursor = query.cursor || query.startCursor || undefined;

  const warnings = [];
  const notion = getNotionClient();
  const propertyNames = getPropertyNames();

  if (id && !isLikelyNotionPageId(id) && !propertyNames.recipeId) {
    return respond(400, {
      message: 'NOTION_ID_PROPERTY must be configured to query recipes by id.',
    });
  }

  if (isLikelyNotionPageId(id)) {
    try {
      const page = await notion.pages.retrieve({ page_id: id });
      const recipe = mapPageToRecipe(page, { includeRaw });
      return respond(200, { recipe });
    } catch (error) {
      if (error?.status === 404) {
        return respond(404, { message: 'Recette introuvable.' });
      }
      return respond(error?.status || 500, {
        message: 'Erreur lors de la récupération de la recette.',
        details: error?.body?.message || error?.message,
      });
    }
  }

  const filters = [];

  if (id && propertyNames.recipeId) {
    filters.push({
      property: propertyNames.recipeId,
      rich_text: { equals: id },
    });
  }

  if (search) {
    filters.push({
      property: propertyNames.title,
      title: { contains: search },
    });
  }

  if (category) {
    if (propertyNames.category) {
      filters.push({
        property: propertyNames.category,
        rich_text: { contains: category },
      });
    } else {
      warnings.push(
        'Le filtre "category" a été ignoré car NOTION_CATEGORY_PROPERTY est absent.'
      );
    }
  }

  const tagFilters = [];
  const collectedTags = new Set();
  if (tagParam) collectedTags.add(tagParam);
  if (tagsParam) {
    tagsParam
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
      .forEach((value) => collectedTags.add(value));
  }

  if (collectedTags.size > 0) {
    if (propertyNames.tags) {
      collectedTags.forEach((value) => {
        tagFilters.push({
          property: propertyNames.tags,
          multi_select: { contains: value },
        });
      });
    } else {
      warnings.push(
        'Le filtre "tag(s)" a été ignoré car NOTION_TAGS_PROPERTY est absent.'
      );
    }
  }

  filters.push(...tagFilters);

  const queryPayload = {
    database_id: process.env.NOTION_DATABASE_ID,
    page_size: pageSize,
  };

  if (startCursor) {
    queryPayload.start_cursor = startCursor;
  }

  if (filters.length === 1) {
    queryPayload.filter = filters[0];
  } else if (filters.length > 1) {
    queryPayload.filter = { and: filters };
  }

  let notionResponse;
  try {
    notionResponse = await notion.databases.query(queryPayload);
  } catch (error) {
    return respond(error?.status || 500, {
      message: 'Erreur lors de la récupération des recettes.',
      details: error?.body?.message || error?.message,
    });
  }

  const recipes = notionResponse.results.map((page) =>
    mapPageToRecipe(page, { includeRaw })
  );

  if (id) {
    if (recipes.length === 0) {
      return respond(404, { message: 'Recette introuvable.' });
    }
    return respond(200, {
      recipe: recipes[0],
      recipes,
      warnings,
    });
  }

  return respond(200, {
    recipes,
    nextCursor: notionResponse.next_cursor || null,
    hasMore: notionResponse.has_more,
    pageSize,
    warnings,
  });
};
