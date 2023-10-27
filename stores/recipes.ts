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
                return state.recipes.filter(recipe => recipe.type === type)
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
            } catch (error) {
                console.error('There has been a problem with your fetch operation:', error);
            }
        }
    },
});