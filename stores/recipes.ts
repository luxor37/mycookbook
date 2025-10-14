import { categories, type Category, type Recipe } from "~/types/recipe"

const compareByTitle = (a: Recipe, b: Recipe) => a.title.localeCompare(b.title);

export const useRecipeStore = defineStore("recipe", () => {
    const allRecipes = ref<Recipe[] | null>(null)
    const activeCategory = ref<Category>(categories.ALL)
    const activeRecipeId = ref<string | null>(null)

    const recipes = computed<Recipe[]>(() => {
        if (allRecipes.value === null) return []
        if (activeCategory.value === categories.ALL) return [...allRecipes.value].sort(compareByTitle)
        return allRecipes.value
            .filter(recipe => recipe.type === activeCategory.value)
            .sort(compareByTitle)
    })

    const activeRecipe = computed<Recipe | null>(() => {
        if (allRecipes.value === null || activeRecipeId.value === null) return null
        console.log(activeRecipeId.value)
        const index = allRecipes.value.findIndex(recipe => recipe.id === activeRecipeId.value)
        if (index === -1) return null
        return allRecipes.value[index] || null
    })

    const getRecipeById = (id: string): Recipe | undefined => {
        if (allRecipes.value === null) return undefined
        return allRecipes.value.find(recipe => recipe.id === id)
    }

    const fetchRecipes = async () => {
        if (allRecipes.value !== null) return

        try {
            const response = await fetch('https://raw.githubusercontent.com/luxor37/mycookbook_lib/main/recipes.json')
            if (!response.ok) {
                throw new Error(`Failed to fetch recipes.json: ${response.status}`)
            }
            const parsedRecipes: { recipes: Recipe[] } = await response.json()
            allRecipes.value = parsedRecipes.recipes
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error)
        }
    }

    return {
        allRecipes,
        activeCategory,
        recipes,
        activeRecipeId,
        activeRecipe,
        getRecipeById,
        fetchRecipes,
    }
});
