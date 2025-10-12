const HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
}

const GITHUB_API = 'https://api.github.com'
const OWNER = 'luxor37'
const REPO = 'mycookbook_lib'

const formatIngredients = (ingredients = []) => {
  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return '- (aucun)'
  }
  return ingredients
    .map((ingredient) => {
      const name = ingredient?.name?.trim() || 'Ingrédient'
      const quantity = ingredient?.quantity?.trim()
      const unit = ingredient?.unit?.trim()
      const details = [quantity, unit].filter(Boolean).join(' ')
      return `- ${name}${details ? ` — ${details}` : ''}`
    })
    .join('\n')
}

const formatInstructions = (instructions = []) => {
  if (!Array.isArray(instructions) || instructions.length === 0) {
    return '- (aucune)'
  }
  return instructions.map((step, index) => `${index + 1}. ${step}`).join('\n')
}

const formatTags = (tags = []) => {
  if (!Array.isArray(tags) || tags.length === 0) {
    return '- (aucun)'
  }
  return tags.map((tag) => `- ${tag}`).join('\n')
}

exports.handler = async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: HEADERS }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: HEADERS,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    }
  }

  if (!process.env.GITHUB_TOKEN) {
    return {
      statusCode: 500,
      headers: HEADERS,
      body: JSON.stringify({ message: 'GitHub token not configured.' }),
    }
  }

  let payload
  try {
    payload = JSON.parse(event.body || '{}')
  } catch (error) {
    return {
      statusCode: 400,
      headers: HEADERS,
      body: JSON.stringify({ message: 'Corps de requête invalide.' }),
    }
  }

  const {
    id,
    title,
    Type,
    portions,
    time,
    tags = [],
    ingredients = [],
    instructions = [],
    image,
    source,
    notes,
  } = payload

  const requiredFields = { id, title, Type, portions, time, image }
  const missingFields = Object.entries(requiredFields)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (ingredients.length === 0) missingFields.push('ingredients')
  if (instructions.length === 0) missingFields.push('instructions')

  if (missingFields.length > 0) {
    return {
      statusCode: 400,
      headers: HEADERS,
      body: JSON.stringify({
        message: `Champs manquants ou incomplets : ${missingFields.join(', ')}`,
      }),
    }
  }

  const recipeSnippet = JSON.stringify(
    {
      id,
      type: Type,
      title,
      portions,
      time,
      tags,
      ingredients,
      preparation: instructions,
      image,
      source: source || '',
    },
    null,
    2
  )

  const issueBody =
    `### Nouvelle suggestion de recette\n\n` +
    `**ID**: ${id}\n` +
    `**Titre**: ${title}\n` +
    `**Catégorie**: ${Type}\n` +
    `**Portions**: ${portions}\n` +
    `**Temps**: ${time}\n` +
    `**Image**: ${image}\n` +
    `${source ? `**Source**: ${source}\n` : ''}` +
    `${notes ? `**Notes**: ${notes}\n` : ''}` +
    `\n#### Tags\n${formatTags(tags)}\n` +
    `\n#### Ingrédients\n${formatIngredients(ingredients)}\n` +
    `\n#### Préparation\n${formatInstructions(instructions)}\n` +
    `\n#### JSON proposé\n\n\`\`\`json\n${recipeSnippet}\n\`\`\`\n\n` +
    `_Suggestion envoyée via le formulaire MyCookbook le ${new Date().toISOString()}._`

  try {
    const response = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/issues`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'mycookbook-netlify-function',
        Accept: 'application/vnd.github+json',
      },
      body: JSON.stringify({
        title: `[Recipe] ${title} (${id})`,
        body: issueBody,
        labels: ['recipe-suggestion'],
      }),
    })

    if (!response.ok) {
      const text = await response.text()
      return {
        statusCode: response.status,
        headers: HEADERS,
        body: JSON.stringify({
          message: 'Impossible de créer la suggestion sur GitHub.',
          details: text,
        }),
      }
    }

    const data = await response.json()

    return {
      statusCode: 200,
      headers: HEADERS,
      body: JSON.stringify({
        message: 'Suggestion envoyée avec succès.',
        issueNumber: data.number,
        issueUrl: data.html_url,
      }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: HEADERS,
      body: JSON.stringify({
        message: 'Erreur lors de la communication avec GitHub.',
        details: error.message,
      }),
    }
  }
}
