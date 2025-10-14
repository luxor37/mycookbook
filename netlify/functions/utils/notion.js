import { Client } from '@notionhq/client';

const NOTION_VERSION = '2022-06-28';

const buildPlainText = (richText = []) =>
  richText.map((fragment) => fragment?.plain_text || '').join('').trim();

const toRichTextArray = (value) => {
  const content = value !== undefined && value !== null ? String(value) : '';
  if (!content) return [];
  return [
    {
      type: 'text',
      text: { content },
    },
  ];
};

const asArray = (input) => (Array.isArray(input) ? input : []);

export const getPropertyNames = () => ({
  title: process.env.NOTION_TITLE_PROPERTY || 'Name',
  recipeId: process.env.NOTION_ID_PROPERTY,
  category: process.env.NOTION_CATEGORY_PROPERTY,
  portions: process.env.NOTION_PORTIONS_PROPERTY,
  time: process.env.NOTION_TIME_PROPERTY,
  image: process.env.NOTION_IMAGE_PROPERTY,
  source: process.env.NOTION_SOURCE_PROPERTY,
  notes: process.env.NOTION_NOTES_PROPERTY,
  tags: process.env.NOTION_TAGS_PROPERTY,
  json: process.env.NOTION_JSON_PROPERTY,
  ingredients: process.env.NOTION_INGREDIENTS_PROPERTY,
  instructions: process.env.NOTION_INSTRUCTIONS_PROPERTY,
});

let notionClient;

export const ensureNotionConfigured = () => {
  if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
    throw new Error('Notion credentials not configured.');
  }
};

export const getNotionClient = () => {
  ensureNotionConfigured();
  if (!notionClient) {
    notionClient = new Client({
      auth: process.env.NOTION_API_KEY,
      notionVersion: NOTION_VERSION,
    });
  }
  return notionClient;
};

export const buildRichText = toRichTextArray;

export const buildParagraph = (content) => ({
  object: 'block',
  type: 'paragraph',
  paragraph: {
    rich_text: buildRichText(content),
  },
});

export const buildHeading = (content, level = 2) => ({
  object: 'block',
  type: `heading_${level}`,
  [`heading_${level}`]: {
    rich_text: buildRichText(content),
  },
});

export const buildBulletedListItem = (content) => ({
  object: 'block',
  type: 'bulleted_list_item',
  bulleted_list_item: {
    rich_text: buildRichText(content),
  },
});

export const buildNumberedListItem = (content) => ({
  object: 'block',
  type: 'numbered_list_item',
  numbered_list_item: {
    rich_text: buildRichText(content),
  },
});

export const buildCodeBlock = (content, language = 'plain text') => ({
  object: 'block',
  type: 'code',
  code: {
    rich_text: buildRichText(content),
    language,
  },
});

const addRichTextProperty = (properties, propertyName, value) => {
  if (!propertyName || value === undefined || value === null || value === '') return;
  properties[propertyName] = { rich_text: buildRichText(value) };
};

const uniqueArray = (items = []) =>
  Array.from(new Set(items.filter((item) => typeof item === 'string' && item.trim().length > 0))).map(
    (item) => item.trim()
  );

export const formatIngredientLine = (ingredient = {}) => {
  const name = ingredient?.name?.trim() || 'Ingrédient';
  const quantity = ingredient?.quantity?.trim();
  const unit = ingredient?.unit?.trim();
  const details = [quantity, unit].filter(Boolean).join(' ');
  return details ? `${name} — ${details}` : name;
};

const formatInstructionsForText = (steps = []) =>
  steps
    .map((step, index) => {
      const value = step?.trim?.() || String(step || '').trim();
      if (!value) return null;
      return `${index + 1}. ${value}`;
    })
    .filter(Boolean)
    .join('\n');

export const buildRecipeBlocks = (recipe, recipeSnippet) => {
  const ingredients = asArray(recipe.ingredients);
  const instructions = asArray(recipe.instructions);
  const tags = asArray(recipe.tags);

  const blocks = [
    buildHeading('Résumé'),
    buildParagraph(`ID: ${recipe.id}`),
    buildParagraph(`Catégorie: ${recipe.category}`),
    buildParagraph(`Portions: ${recipe.portions}`),
    buildParagraph(`Temps: ${recipe.time}`),
    buildParagraph(`Image: ${recipe.image}`),
  ];

  if (recipe.source) {
    blocks.push(buildParagraph(`Source: ${recipe.source}`));
  }

  if (recipe.notes) {
    blocks.push(buildParagraph(`Notes: ${recipe.notes}`));
  }

  blocks.push(buildHeading('Tags'));
  if (tags.length === 0) {
    blocks.push(buildParagraph('(aucun)'));
  } else {
    tags.forEach((tag) => blocks.push(buildBulletedListItem(tag)));
  }

  blocks.push(buildHeading('Ingrédients'));
  if (ingredients.length === 0) {
    blocks.push(buildParagraph('(aucun)'));
  } else {
    ingredients.forEach((ingredient) => {
      blocks.push(buildBulletedListItem(formatIngredientLine(ingredient)));
    });
  }

  blocks.push(buildHeading('Préparation'));
  if (instructions.length === 0) {
    blocks.push(buildParagraph('(aucune)'));
  } else {
    instructions.forEach((step) => {
      blocks.push(buildNumberedListItem(step));
    });
  }

  blocks.push(buildHeading('JSON proposé'));
  blocks.push(buildCodeBlock(recipeSnippet, 'json'));
  blocks.push(
    buildParagraph(`Suggestion envoyée via le formulaire MyCookbook le ${new Date().toISOString()}.`)
  );

  return blocks;
};

export const buildRecipeProperties = (recipe, recipeSnippet) => {
  const names = getPropertyNames();
  const properties = {
    [names.title]: {
      title: buildRichText(recipe.title),
    },
  };

  addRichTextProperty(properties, names.recipeId, recipe.id);
  addRichTextProperty(properties, names.category, recipe.category);
  addRichTextProperty(properties, names.portions, recipe.portions);
  addRichTextProperty(properties, names.time, recipe.time);
  addRichTextProperty(properties, names.image, recipe.image);
  addRichTextProperty(properties, names.source, recipe.source);
  addRichTextProperty(properties, names.notes, recipe.notes);

  if (names.ingredients) {
    const ingredientsText = asArray(recipe.ingredients)
      .map((ingredient) => formatIngredientLine(ingredient))
      .join('\n');
    addRichTextProperty(properties, names.ingredients, ingredientsText);
  }

  if (names.instructions) {
    const instructionsText = formatInstructionsForText(asArray(recipe.instructions));
    addRichTextProperty(properties, names.instructions, instructionsText);
  }

  if (names.tags) {
    properties[names.tags] = {
      multi_select: uniqueArray(recipe.tags).map((tag) => ({ name: tag })),
    };
  }

  if (names.json && recipeSnippet) {
    addRichTextProperty(properties, names.json, recipeSnippet);
  }

  return properties;
};

const getProperty = (page, propertyName) =>
  propertyName ? page?.properties?.[propertyName] : undefined;

const parseRichTextContent = (property) => {
  if (!property) return null;
  if (property.type === 'rich_text') {
    return buildPlainText(property.rich_text);
  }
  if (property.type === 'title') {
    return buildPlainText(property.title);
  }
  if (property.type === 'url') {
    return property.url || null;
  }
  if (property.type === 'number') {
    return property.number !== null ? String(property.number) : null;
  }
  if (property.type === 'select') {
    return property.select?.name || null;
  }
  if (property.type === 'multi_select') {
    return property.multi_select.map((option) => option?.name).filter(Boolean);
  }
  return null;
};

const parseJsonProperty = (property) => {
  if (!property || property.type !== 'rich_text') return null;
  const payload = buildPlainText(property.rich_text);
  if (!payload) return null;
  try {
    return JSON.parse(payload);
  } catch (error) {
    return null;
  }
};

const parseTextListProperty = (property, { stripOrdering = false } = {}) => {
  const raw = parseRichTextContent(property);
  if (!raw) return [];
  return String(raw)
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      if (!stripOrdering) return trimmed;
      return trimmed.replace(/^\d+\.\s*/, '');
    })
    .filter(Boolean);
};

export const mapPageToRecipe = (page, options = {}) => {
  const { includeRaw = false } = options;
  const names = getPropertyNames();
  const jsonPayload = parseJsonProperty(getProperty(page, names.json)) || {};

  const tagsFromProperty = getProperty(page, names.tags);
  const propertyTags =
    tagsFromProperty && tagsFromProperty.type === 'multi_select'
      ? tagsFromProperty.multi_select.map((item) => item?.name).filter(Boolean)
      : [];

  const recipe = {
    pageId: page?.id,
    url: page?.url,
    id:
      jsonPayload.id ||
      jsonPayload.externalId ||
      parseRichTextContent(getProperty(page, names.recipeId)) ||
      page?.id,
    title: jsonPayload.title || parseRichTextContent(getProperty(page, names.title)) || '',
    category: jsonPayload.category || jsonPayload.type || parseRichTextContent(getProperty(page, names.category)),
    portions: jsonPayload.portions || parseRichTextContent(getProperty(page, names.portions)),
    time: jsonPayload.time || parseRichTextContent(getProperty(page, names.time)),
    tags: jsonPayload.tags || propertyTags,
    ingredients: jsonPayload.ingredients || parseTextListProperty(getProperty(page, names.ingredients)),
    instructions:
      jsonPayload.instructions ||
      jsonPayload.preparation ||
      parseTextListProperty(getProperty(page, names.instructions), { stripOrdering: true }),
    image: jsonPayload.image || parseRichTextContent(getProperty(page, names.image)),
    source: jsonPayload.source || parseRichTextContent(getProperty(page, names.source)),
    notes: jsonPayload.notes || parseRichTextContent(getProperty(page, names.notes)),
  };

  if (includeRaw) {
    return {
      ...recipe,
      rawProperties: page?.properties,
    };
  }

  return recipe;
};

export const isLikelyNotionPageId = (value) => {
  if (!value) return false;
  const normalized = value.replace(/-/g, '');
  return /^[0-9a-fA-F]{32}$/.test(normalized);
};
