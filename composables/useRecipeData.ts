import { toValue, watch, type MaybeRefOrGetter } from "vue";

type RecipeId = MaybeRefOrGetter<string | null | undefined>;

const hasRecipeId = (value: string | null | undefined): value is string =>
  typeof value === "string" && value.length > 0;

export const useRecipeData = async (recipeId?: RecipeId) => {
  const recipeStore = useRecipeStore();

  await recipeStore.fetchRecipeIndex();

  const loadRecipeById = async (id: string | null | undefined) => {
    if (!hasRecipeId(id)) return;
    await recipeStore.fetchRecipeById(id);
  };

  await loadRecipeById(recipeId ? toValue(recipeId) : undefined);

  if (import.meta.client && recipeId) {
    watch(
      () => toValue(recipeId),
      (id) => {
        if (!hasRecipeId(id)) return;
        void recipeStore.fetchRecipeById(id);
      },
    );
  }
};
