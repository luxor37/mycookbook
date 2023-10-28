import { defineStore } from "pinia";
import Recipe, { CATEGORY } from "~/types/recipe"

export const useRecipeStore = defineStore("recipe", {
    state: () => ({
        recipes: null as Recipe[] | null,
    }),
    getters: {
        getRecipesByType: (state) => {
            return (type: CATEGORY): Recipe[] => {
                if (state.recipes === null) return [] as Recipe[]
                if (type === "ALL") return state.recipes.sort((a, b) => (a.title < b.title) ? -1 : (a.title > b.title) ? 1 : 0)
                const filtered = state.recipes.filter(recipe => recipe.type === type).sort((a, b) => (a.title < b.title) ? -1 : (a.title > b.title) ? 1 : 0)
                return filtered
            }
        },
        getRecipeById: (state) => {
            return (id: string): Recipe | undefined => {
                if (state.recipes === null) return undefined
                return state.recipes.find(recipe => recipe.id === id)
            }
        }
    },
    actions: {
        async parseRecipes() {
            try {
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