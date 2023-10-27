<script setup lang="ts">
import { useRecipeStore } from "~/stores/recipes";

const route = useRoute();

watch(
  () => route.params.type,
  (newValue) => {
    type.value = newValue;
  }
);

const routeType = ref(route.params.type);

const type = route.params.type as
  | "REPAS"
  | "ENTREES"
  | "DESSERTS"
  | "BOISSONS"
  | "AUTRES";

const filteredRecipes = computed(() => {
  const recipeStore = useRecipeStore();
  const { recipes } = recipeStore;
  if (recipes !== null) {
    if (routeType) {
      const type = routeType as
        | "REPAS"
        | "ENTREES"
        | "DESSERTS"
        | "BOISSONS"
        | "AUTRES";
      return recipeStore.getRecipesByType(type);
    }
    console.log("All recipes");
    return recipes;
  }
  console.log("No Recipes");
  return [];
});
</script>

<template>
  <div v-if="filteredRecipes.length > 0">
    <div :key="recipe.title" v-for="recipe in filteredRecipes">
      {{ recipe.title }}
    </div>
  </div>
</template>
