export default defineNuxtRouteMiddleware(async (to, _from) => {
    const recipeStore = useRecipeStore();
    const { recipeIndex } = storeToRefs(recipeStore);

    if (recipeIndex.value == null || recipeIndex.value.length === 0) {
        await recipeStore.fetchRecipeIndex()
    }

    if (typeof to.params.recipe_id === 'string') {
        await recipeStore.fetchRecipeById(to.params.recipe_id)
    }
})
