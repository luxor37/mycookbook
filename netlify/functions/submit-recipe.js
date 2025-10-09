import {
  ensureNotionConfigured,
  getNotionClient,
  buildRecipeBlocks,
  buildRecipeProperties,
} from './utils/notion.js';

const HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
};

const validatePayload = (payload) => {
  const {
    id,
    title,
    category,
    portions,
    time,
    tags = [],
    ingredients = [],
    instructions = [],
    image,
    source,
    notes,
  } = payload || {};

  const requiredFields = { id, title, category, portions, time, image };
  const missingFields = Object.entries(requiredFields)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    missingFields.push('ingredients');
  }

  if (!Array.isArray(instructions) || instructions.length === 0) {
    missingFields.push('instructions');
  }

  if (missingFields.length > 0) {
    const error = new Error(
      `Champs manquants ou incomplets : ${missingFields.join(', ')}`
    );
    error.statusCode = 400;
    throw error;
  }

  return {
    id,
    title,
    category,
    portions,
    time,
    tags,
    ingredients,
    instructions,
    image,
    source,
    notes,
  };
};

const buildRecipeSnippet = (recipe) =>
  JSON.stringify(
    {
      id: recipe.id,
      title: recipe.title,
      category: recipe.category,
      type: recipe.category,
      portions: recipe.portions,
      time: recipe.time,
      tags: recipe.tags,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      image: recipe.image,
      source: recipe.source || '',
      notes: recipe.notes || '',
    },
    null,
    2
  );

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: HEADERS };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: HEADERS,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    ensureNotionConfigured();
  } catch (configError) {
    return {
      statusCode: 500,
      headers: HEADERS,
      body: JSON.stringify({ message: configError.message }),
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (parseError) {
    return {
      statusCode: 400,
      headers: HEADERS,
      body: JSON.stringify({ message: 'Corps de requête invalide.' }),
    };
  }

  let recipe;
  try {
    recipe = validatePayload(payload);
  } catch (validationError) {
    return {
      statusCode: validationError.statusCode || 400,
      headers: HEADERS,
      body: JSON.stringify({ message: validationError.message }),
    };
  }

  const recipeSnippet = buildRecipeSnippet(recipe);
  const notion = getNotionClient();

  try {
    const response = await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_ID },
      properties: buildRecipeProperties(recipe, recipeSnippet),
      children: buildRecipeBlocks(recipe, recipeSnippet),
    });

    return {
      statusCode: 200,
      headers: HEADERS,
      body: JSON.stringify({
        message: 'Suggestion envoyée avec succès.',
        pageId: response.id,
        url: response.url,
      }),
    };
  } catch (error) {
    const status = error?.status || error?.statusCode || 500;
    const details = error?.body?.message || error?.message;

    return {
      statusCode: status,
      headers: HEADERS,
      body: JSON.stringify({
        message: 'Erreur lors de la communication avec Notion.',
        details,
      }),
    };
  }
};
