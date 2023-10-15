<script setup lang="ts">
import { useRecipeStore } from "~/stores/recipes";
const recipeStore = useRecipeStore();

const { recipes } = recipeStore;
const route = useRoute();

const filteredRecipes = computed(() => {
  if (recipes !== null) {
    if (route.params.type) {
      return recipeStore.getRecipesByType("REPAS");
    }
    console.log("All recipes");
    return recipes;
  }
  console.log("No Recipes");
  return [];
});
</script>

<template>
  <div :key="recipe.title" v-for="recipe in filteredRecipes">
    {{ recipe.title }}
  </div>
</template>
