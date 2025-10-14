export default defineNuxtRouteMiddleware(async (to, from) => {
    const recipeStore = useRecipeStore();
    const { activeRecipeId, allRecipes } = storeToRefs(recipeStore);

    if (allRecipes.value == null || allRecipes.value.length === 0) {
        await recipeStore.fetchRecipes();
    }

    const recipeParam = to.params.recipe_id;
    const recipeIdSlug = typeof recipeParam === "string"
        ? recipeParam.toLowerCase()
        : null;

    if (recipeIdSlug == null) {
        activeRecipeId.value = null;
        return;
    }

    if (process.server || from === undefined) {
        activeRecipeId.value = recipeIdSlug;
        return;
    }

    if (activeRecipeId.value === recipeIdSlug) return;

    const nuxtApp = useNuxtApp();

    nuxtApp.hooks.hookOnce("page:transition:finish", () => {
        activeRecipeId.value = recipeIdSlug;
    });
});
