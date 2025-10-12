import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useRecipeStore = defineStore('recipe', () => {
  const recipes = ref<Recipe[]>([])
  const isLoading = ref(false)

  const compareByTitle = (a: Recipe, b: Recipe) => a.title.localeCompare(b.title)
  const filterByType = (type: Type) => (recipe: Recipe) => recipe.type.toLowerCase() === type
  const isEmpty = (): boolean => recipes.value.length === 0

  const getRecipesByType = (): Recipe[] => {
    const type = useType()

    if (type.get().value === type.DEFAULT) {
      return recipes.value.sort(compareByTitle)
    }

    return recipes.value.filter(filterByType(type.get().value)).sort(compareByTitle)
  }

  const getRecipeById = computed(() => {
    return (id: string): Recipe | undefined => {
      if (!recipes.value) {
        return undefined
      }

      return recipes.value.find((recipe) => recipe.id === id)
    }
  })

  const parseRecipes = async () => {
    if (isLoading.value) {
      return
    }

    try {
      isLoading.value = true

      const response = await fetch(
        'https://raw.githubusercontent.com/luxor37/mycookbook_lib/main/recipes.json'
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch recipes.json: ${response.status}`)
      }

      const { recipes: rawRecipes } = await response.json()

      recipes.value = (rawRecipes as Recipe[]).map((recipe) => ({
        ...recipe,
        type: recipe.type.toLowerCase() as Type,
      }))
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    recipes,
    isEmpty,
    isLoading,
    getRecipesByType,
    getRecipeById,
    parseRecipes,
  }
})
