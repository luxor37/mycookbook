import { categories, type Category, type Recipe } from "~/types/recipe"

const compareByTitle = (a: Recipe, b: Recipe) => a.title.localeCompare(b.title);

const categoryLookup: Record<string, Category> = Object.values(categories).reduce((acc, value) => {
    acc[value.toLowerCase()] = value;
    return acc;
}, {} as Record<string, Category>);

export const useRecipeStore = defineStore("recipe", () => {
    const allRecipes = ref<Recipe[] | null>(null)
    const route = useRoute();

    const recipeIdFromRoute = computed(() => {
        if (typeof route.params.recipe_id !== 'string') return null
        const recipeId = route.params.recipe_id.toLowerCase()
        return recipeId
    });

    const activeRecipe = computed<Recipe | null>(() => {
        if (!allRecipes.value || !recipeIdFromRoute.value) return null;
        return allRecipes.value.find(
            r => r.id.toLowerCase() === recipeIdFromRoute.value
        ) ?? null;
    });

    const categoryFromRoute = computed<Category>(() => {
        if (typeof route.params.category !== 'string') return categories.ALL
        const categorySlug = route.params.category.toLowerCase()

        return categoryLookup[categorySlug] ?? categories.ALL;
    }
    );

    const recipes = computed<Recipe[]>(() => {
        if (allRecipes.value === null) return []
        if (categoryFromRoute.value === categories.ALL) return [...allRecipes.value].sort(compareByTitle)
        return allRecipes.value
            .filter(recipe => recipe.type === categoryFromRoute.value)
            .sort(compareByTitle)
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
        recipes,
        activeRecipe,
        fetchRecipes,
    }
});
