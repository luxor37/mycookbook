import { defineStore } from "pinia";

const compareByTitle = (a: Recipe, b: Recipe) => a.title.localeCompare(b.title);
let isLoading = false;

export const useRecipeStore = defineStore("recipe", {
  state: () => ({
    recipes: null as Recipe[] | null,
  }),
  getters: {
    getRecipesByType:
      (state) =>
      (route: Route): Recipe[] => {
        if (state.recipes === null) {
          return [];
        }

        if (route === "all") {
          return [...state.recipes].sort(compareByTitle);
        }

        return state.recipes
          .filter((recipe) => recipe.type.toLowerCase() === route)
          .sort(compareByTitle);
      },
    getRecipeById:
      (state) =>
      (id: string): Recipe | undefined => {
        if (!state.recipes) {
          return undefined;
        }

        return state.recipes.find((recipe) => recipe.id === id);
      },
  },
  actions: {
    async parseRecipes() {
      if (this.recipes) {
        return;
      }

      if (isLoading) {
        return;
      }

      try {
        isLoading = true;

        const response = await fetch(
          "https://raw.githubusercontent.com/luxor37/mycookbook_lib/main/recipes.json"
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch recipes.json: ${response.status}`);
        }

        const { recipes } = await response.json();

        this.recipes = (recipes as Recipe[]).map((recipe) => ({
          ...recipe,
          type: recipe.type.toLowerCase(),
        }));
      } catch (error) {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      } finally {
        isLoading = false;
      }
    },
  },
});
