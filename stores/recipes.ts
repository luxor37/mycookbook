import { categories, type Category, type Recipe } from "~/types/recipe"

type RecipeIndexEntry = Pick<Recipe, "id" | "type" | "title">
type RecipeCard = RecipeIndexEntry & { image: string }

const config = useRuntimeConfig();
const BASE_URL = config.public.recipeBaseUrl
const compareByTitle = (a: { title: string }, b: { title: string }) => a.title.localeCompare(b.title);

const categoryLookup: Record<string, Category> = Object.values(categories).reduce((acc, value) => {
    acc[value.toLowerCase()] = value;
    return acc;
}, {} as Record<string, Category>);

const typeToDir: Record<Category, string> = {
    REPAS: "repas",
    ENTREES: "entrees",
    DESSERTS: "desserts",
    BOISSONS: "boissons",
    AUTRES: "autres",
    ALL: "index",
};

export const useRecipeStore = defineStore("recipe", () => {
    const recipeIndex = ref<RecipeIndexEntry[] | null>(null)
    const recipeById = ref<Record<string, Recipe | undefined>>({})

    const getCategoryFromSlug = (slug?: string): Category => {
        if (!slug) return categories.ALL;
        return categoryLookup[slug.toLowerCase()] ?? categories.ALL;
    };

    const imageUrl = (entry: RecipeIndexEntry) =>
        `${BASE_URL}/recipes/${typeToDir[entry.type]}/${entry.id}/image.webp`;

    const getRecipesByCategory = (category?: Category | null): RecipeCard[] => {
        if (recipeIndex.value === null) return [];
        const target = category ?? categories.ALL;
        const list = target === categories.ALL
            ? recipeIndex.value
            : recipeIndex.value.filter(r => r.type === target);
        return [...list].sort(compareByTitle).map((entry) => ({
            ...entry,
            image: imageUrl(entry),
        }));
    };

    const getRecipeById = (id: string): Recipe | undefined => {
        return recipeById.value[id.toLowerCase()]
    }

    const fetchRecipeIndex = async () => {
        if (recipeIndex.value !== null) return

        try {
            const response = await fetch(`${BASE_URL}/recipes/index.json`)
            if (!response.ok) {
                throw new Error(`Failed to fetch recipes index: ${response.status}`)
            }
            const parsedRecipes: { recipes: RecipeIndexEntry[] } = await response.json()
            recipeIndex.value = parsedRecipes.recipes
        } catch (error) {
            console.error('Failed to fetch recipe index:', error)
        }
    }

    const fetchRecipeById = async (id: string): Promise<Recipe | undefined> => {
        const key = id.toLowerCase()
        if (recipeById.value[key]) return recipeById.value[key]

        if (recipeIndex.value === null) {
            await fetchRecipeIndex()
        }

        const entry = recipeIndex.value?.find(r => r.id.toLowerCase() === key)
        if (!entry) return undefined

        const dir = typeToDir[entry.type]
        if (!dir) return undefined

        try {
            const response = await fetch(`${BASE_URL}/recipes/${dir}/${entry.id}/index.json`)
            if (!response.ok) {
                throw new Error(`Failed to fetch recipe ${entry.id}: ${response.status}`)
            }
            const recipe: Recipe = await response.json()
            recipe.type = entry.type
            recipe.image = imageUrl(entry)
            recipeById.value[key] = recipe
            return recipe
        } catch (error) {
            console.error('Failed to fetch recipe:', error)
            return undefined
        }
    }

    return {
        recipeIndex,
        recipeById,
        getCategoryFromSlug,
        getRecipesByCategory,
        fetchRecipeIndex,
        fetchRecipeById,
        getRecipeById,
    }
});
