import { defineStore } from "pinia";
import Recipe, { CATEGORY } from "~/types/recipe"

export const useRecipeStore = defineStore("recipe", {
    state: () => ({
        recipes: null as Recipe[] | null,
    }),
    getters: {
        getRecipesByType: (state) => {
            return (type: CATEGORY) => {
                if (state.recipes === null) return [] as Recipe[]
                if (type === "ALL") return state.recipes.sort((a, b) => (a.title < b.title) ? -1 : (a.title > b.title) ? 1 : 0)
                const filtered = state.recipes.filter(recipe => recipe.type === type).sort((a, b) => (a.title < b.title) ? -1 : (a.title > b.title) ? 1 : 0)
                console.log("Filtered recipes:", filtered)
                return filtered
            }
        }
    },
    actions: {
        async parseRecipes() {
            try {
                console.warn("Parsing recipes...")
                const response = await fetch('/recipes.json');
                if (!response.ok) {
                    throw console.error('Failed to fetch recipes.json', response);
                }
                const parsedRecipes: { recipes: Recipe[] } = await response.json();
                this.recipes = parsedRecipes.recipes
                console.log("Parsed recipes:", this.recipes)
            } catch (error) {
                console.error('There has been a problem with your fetch operation:', error);
            }
        }
    },
});