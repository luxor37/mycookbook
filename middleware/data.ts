export default defineNuxtRouteMiddleware(async (to, from) => {
    const recipeStore = useRecipeStore();
    const { allRecipes } = storeToRefs(recipeStore);

    if (allRecipes.value == null || allRecipes.value.length === 0) {
        await recipeStore.fetchRecipes()
    }
})
