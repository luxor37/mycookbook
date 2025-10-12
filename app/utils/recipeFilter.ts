export default computed((): Recipe[] => {
  const routeType = useRouteType();
  const recipeStore = useRecipeStore();

  if (!recipeStore.recipes) {
    return [];
  }

  if (routeType) {
    return recipeStore.getRecipesByType(routeType.get().value);
  }

  return recipeStore.recipes;
});
