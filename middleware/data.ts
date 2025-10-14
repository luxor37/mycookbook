import { categories, type Category } from "~/types/recipe";

const categoryLookup: Record<string, Category> = Object.values(categories).reduce((acc, value) => {
    acc[value.toLowerCase()] = value;
    return acc;
}, {} as Record<string, Category>);

export default defineNuxtRouteMiddleware(async (to, from) => {
    const recipeStore = useRecipeStore();
    const { activeCategory, allRecipes } = storeToRefs(recipeStore);

    if (allRecipes.value == null || allRecipes.value.length === 0) {
        await recipeStore.fetchRecipes()
    }

    const categorySlug = typeof to.params.category === "string"
        ? to.params.category.toLowerCase()
        : "";

    const nextCategory = categoryLookup[categorySlug] ?? categories.ALL;

    if (process.server || from === undefined) {
        activeCategory.value = nextCategory;
        return;
    }

    if (activeCategory.value === nextCategory) return;

    const nuxtApp = useNuxtApp();

    nuxtApp.hooks.hookOnce("page:transition:finish", () => {
        activeCategory.value = nextCategory;
    });
})
