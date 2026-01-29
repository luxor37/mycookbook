## Coding style for contributions

 - `yarn` over `npm` at all times
 - User the `Composition API` over the `Options API` (https://vueschool.io/articles/vuejs-tutorials/options-api-vs-composition-api/)
 - interfaces in the `/types/` folder (with the exception of a Props interface in each component receiving Props)
 - Always use fixed versions for all packages in the packages.json

## Setup

Make sure to install the dependencies:

```bash
yarn
```

## Soumettre une recette (Netlify Free)

- Le formulaire public `/form` appelle la fonction serverless `/.netlify/functions/submit-recipe` qui ouvre une Pull Request sur GitHub pour mettre à jour `recipes.json` (repo par défaut : `luxor37/mycookbook_lib`). Une copie de sauvegarde est aussi enregistrée via Netlify Forms (`recipe-submissions`, 100 entrées/mois sur l'offre gratuite).
- Variables d’environnement Netlify à définir : `GITHUB_TOKEN` (PAT avec droits repo), optionnellement `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_BASE_BRANCH` et `GITHUB_RECIPES_PATH` (par défaut `recipes.json` à la racine).
- Pour tester le flux complet en local, lancez `netlify dev` afin de disposer du proxy `/.netlify/functions/*` et de la capture Netlify Forms. En mode `yarn dev`, l’appel Netlify Forms peut échouer (un avertissement est affiché), mais l’UI fonctionne.

## Development Server

Start the development server on `http://localhost:3000`:

```bash
yarn dev
```

## Production

Build the application for production:

```bash
yarn generate
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
