Public submissions are handled via Netlify:

- Form `/form` posts to Netlify Forms (`recipe-submissions`) and to the function `submit-recipe`.
- The function opens a GitHub PR on the recipes repo (defaults to `luxor37/mycookbook_lib`).
- Configure env vars on Netlify: `GITHUB_TOKEN` (repo scope), optionally `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_BASE_BRANCH`, `GITHUB_RECIPES_PATH`.
