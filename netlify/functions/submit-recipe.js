const HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
};

const decodeBody = (event) => {
  if (!event?.body) return {};

  const contentType = (event.headers?.['content-type'] || event.headers?.['Content-Type'] || '').toLowerCase();
  const rawBody = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf-8') : event.body;

  if (contentType.includes('application/json')) {
    return JSON.parse(rawBody || '{}');
  }

  if (contentType.includes('application/x-www-form-urlencoded')) {
    return Object.fromEntries(new URLSearchParams(rawBody));
  }

  try {
    return JSON.parse(rawBody || '{}');
  } catch {
    return Object.fromEntries(new URLSearchParams(rawBody));
  }
};

const slugify = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim();

const createRecipeId = (payload = {}) => {
  const base = slugify(payload.id || payload.externalId || payload.title);
  const fallback = `recette-${Math.random().toString(36).slice(2, 7)}`;
  return base || fallback;
};

const normalizeTags = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) {
    return Array.from(
      new Set(
        input
          .map((item) => (typeof item === 'string' ? item : ''))
          .map((item) => item.trim())
          .filter(Boolean)
      )
    );
  }
  return String(input)
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
};

const normalizeIngredients = (input) => {
  if (!input) return [];

  const asObjects = Array.isArray(input)
    ? input
    : String(input)
        .split('\n')
        .map((line) => ({ name: line }));

  return asObjects
    .map((item = {}) => ({
      name: (item.name || item.title || item.label || '').trim(),
      quantity: (item.quantity || item.qty || '').trim(),
      unit: (item.unit || '').trim(),
    }))
    .filter((item) => item.name);
};

const normalizeInstructions = (input) => {
  if (!input) return [];

  if (Array.isArray(input)) {
    return input
      .map((step) => (typeof step === 'string' ? step : String(step || '')))
      .map((step) => step.trim())
      .filter(Boolean);
  }

  return String(input)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
};

const validatePayload = (payload) => {
  const title = (payload?.title || '').trim();
  const category = (payload?.category || payload?.type || '').trim();
  const portions = (payload?.portions || '').trim();
  const time = (payload?.time || '').trim();
  const image = (payload?.image || '').trim();
  const source = (payload?.source || '').trim();
  const notes = (payload?.notes || '').trim();

  const tags = normalizeTags(payload?.tags || payload?.tagList);
  const ingredients = normalizeIngredients(payload?.ingredients);
  const instructions = normalizeInstructions(payload?.instructions || payload?.preparation);
  const id = createRecipeId(payload);

  const requiredFields = { id, title, category, portions, time, image };
  const missingFields = Object.entries(requiredFields)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (ingredients.length === 0) {
    missingFields.push('ingredients');
  }

  if (instructions.length === 0) {
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

const buildRecipeForRepo = (recipe) => ({
  id: recipe.id,
  type: recipe.category,
  title: recipe.title,
  portions: recipe.portions,
  time: recipe.time,
  tags: recipe.tags,
  ingredients: recipe.ingredients,
  preparation: recipe.instructions,
  image: recipe.image,
  source: recipe.source,
  notes: recipe.notes,
});

const respond = (statusCode, payload) => ({
  statusCode,
  headers: HEADERS,
  body: JSON.stringify(payload),
});

const baseConfig = () => ({
  token: process.env.GITHUB_TOKEN,
  owner: process.env.GITHUB_OWNER || 'luxor37',
  repo: process.env.GITHUB_REPO || 'mycookbook_lib',
  baseBranch: process.env.GITHUB_BASE_BRANCH || 'main',
  recipesPath: process.env.GITHUB_RECIPES_PATH || 'recipes.json',
});

const ensureGithubConfigured = (config) => {
  if (!config.token) {
    const error = new Error('GITHUB_TOKEN manquant. Ajoutez-le dans Netlify env vars.');
    error.statusCode = 500;
    throw error;
  }
};

const githubRequest = async (config, path, { method = 'GET', body, headers } = {}) => {
  const response = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${config.token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'mycookbook-submission',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown GitHub error');
    const error = new Error(`GitHub API error: ${response.status} ${errorText}`);
    error.statusCode = response.status;
    throw error;
  }

  return response.json();
};

const getBaseSha = async (config) => {
  const ref = await githubRequest(config, `/repos/${config.owner}/${config.repo}/git/ref/heads/${config.baseBranch}`);
  return ref?.object?.sha;
};

const createBranch = async (config, baseSha, branchName) =>
  githubRequest(config, `/repos/${config.owner}/${config.repo}/git/refs`, {
    method: 'POST',
    body: {
      ref: `refs/heads/${branchName}`,
      sha: baseSha,
    },
  });

const getRecipesFile = async (config) => {
  const file = await githubRequest(
    config,
    `/repos/${config.owner}/${config.repo}/contents/${config.recipesPath}?ref=${config.baseBranch}`
  );

  const decoded = Buffer.from(file.content || '', 'base64').toString('utf-8');
  return { file, content: decoded };
};

const updateRecipesContent = (content, newRecipe) => {
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (error) {
    const err = new Error('recipes.json est invalide (JSON non lisible).');
    err.statusCode = 500;
    throw err;
  }

  const recipes = Array.isArray(parsed) ? parsed : Array.isArray(parsed.recipes) ? parsed.recipes : [];

  if (recipes.find((item) => item.id === newRecipe.id)) {
    const err = new Error(`Une recette avec l'id "${newRecipe.id}" existe déjà.`);
    err.statusCode = 409;
    throw err;
  }

  const updatedRecipes = [...recipes, newRecipe];

  if (Array.isArray(parsed)) {
    return JSON.stringify(updatedRecipes, null, 2) + '\n';
  }

  return JSON.stringify({ ...parsed, recipes: updatedRecipes }, null, 2) + '\n';
};

const commitRecipes = async (config, branchName, file, newContent, commitMessage) =>
  githubRequest(config, `/repos/${config.owner}/${config.repo}/contents/${config.recipesPath}`, {
    method: 'PUT',
    body: {
      message: commitMessage,
      content: Buffer.from(newContent).toString('base64'),
      branch: branchName,
      sha: file.sha,
    },
  });

const createPullRequest = async (config, branchName, title, body) =>
  githubRequest(config, `/repos/${config.owner}/${config.repo}/pulls`, {
    method: 'POST',
    body: {
      title,
      head: branchName,
      base: config.baseBranch,
      body,
    },
  });

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: HEADERS };
  }

  if (event.httpMethod !== 'POST') {
    return respond(405, { message: 'Method Not Allowed' });
  }

  const config = baseConfig();

  try {
    ensureGithubConfigured(config);
  } catch (configError) {
    return respond(configError.statusCode || 500, { message: configError.message });
  }

  let payload;
  try {
    payload = decodeBody(event);
  } catch (parseError) {
    return respond(400, { message: 'Corps de requête invalide.' });
  }

  let recipe;
  try {
    recipe = validatePayload(payload);
  } catch (validationError) {
    return respond(validationError.statusCode || 400, { message: validationError.message });
  }

  const repoRecipe = buildRecipeForRepo(recipe);
  const branchName = `recipes/add-${repoRecipe.id}-${Date.now().toString(36)}`.replace(/[^a-zA-Z0-9._/-]/g, '-');

  try {
    const baseSha = await getBaseSha(config);
    if (!baseSha) {
      throw new Error('Impossible de récupérer la branche de base.');
    }

    await createBranch(config, baseSha, branchName);

    const { file, content } = await getRecipesFile(config);
    const newContent = updateRecipesContent(content, repoRecipe);
    await commitRecipes(
      config,
      branchName,
      file,
      newContent,
      `Add recipe ${repoRecipe.title} (${repoRecipe.id})`
    );

    const pr = await createPullRequest(
      config,
      branchName,
      `Add recipe: ${repoRecipe.title}`,
      `Adds recipe **${repoRecipe.title}** (id: \`${repoRecipe.id}\`).`
    );

    return respond(200, {
      message: 'Suggestion envoyée. Une Pull Request a été ouverte.',
      prUrl: pr.html_url,
      branch: branchName,
    });
  } catch (error) {
    const status = error?.statusCode || error?.status || 500;
    return respond(status, {
      message: error?.message || 'Erreur lors de la création de la Pull Request.',
    });
  }
};
