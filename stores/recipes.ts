import { defineStore } from "pinia";
import Recipe from "~/types/recipe"

export const useRecipeStore = defineStore("recipe", {
    state: () => ({
        recipes: null as Recipe[] | null,
    }),
    getters: {
        getRecipesByType: (state) => {
            return (type: "REPAS" | "ENTREES" | "DESSERTS" | "BOISSONS" | "AUTRES") => {
                if (state.recipes === null) return [] as Recipe[]
                return state.recipes.filter(recipe => recipe.type === type)
            }
        }
    },
    actions: {
        async parseRecipes() {
            try {
                const response = await fetch('/recipes.json');
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                const parsedRecipes: { recipes: Recipe[] } = await response.json();
                this.recipes = parsedRecipes.recipes
            } catch (error) {
                console.error('There has been a problem with your fetch operation:', error);
            }
        }
    },
});