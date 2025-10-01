import { defineStore } from "pinia";
import { CATEGORY, type Recipe } from "~/types/recipe"

const compareByTitle = (a: Recipe, b: Recipe) => a.title.localeCompare(b.title);
let fetchPromise: Promise<void> | null = null;

export const useRecipeStore = defineStore("recipe", {
    state: () => ({
        recipes: null as Recipe[] | null,
    }),
    getters: {
        getRecipesByType: (state) => {
            return (type: CATEGORY): Recipe[] => {
                if (state.recipes === null) return [] as Recipe[]
                if (type === CATEGORY.ALL) return [...state.recipes].sort(compareByTitle)
                const filtered = state.recipes
                    .filter(recipe => recipe.type === type)
                    .sort(compareByTitle)
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
            if (this.recipes !== null) return
            if (fetchPromise) {
                await fetchPromise
                return
            }

            fetchPromise = (async () => {
                try {
                    const response = await fetch('https://raw.githubusercontent.com/luxor37/mycookbook_lib/main/recipes.json')
                    if (!response.ok) {
                        throw new Error(`Failed to fetch recipes.json: ${response.status}`)
                    }
                    const parsedRecipes: { recipes: Recipe[] } = await response.json()
                    this.recipes = parsedRecipes.recipes
                } catch (error) {
                    console.error('There has been a problem with your fetch operation:', error)
                } finally {
                    fetchPromise = null
                }
            })()

            await fetchPromise
        }
    },
});
