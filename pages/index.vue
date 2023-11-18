<script setup lang="ts">
definePageMeta({
  colorMode: "light",
});
import { useRecipeStore } from "~/stores/recipes";
import Recipe, { CATEGORY } from "~/types/recipe";

const routeType = ref<CATEGORY>(CATEGORY.ALL);
const recipeStore = useRecipeStore();

const filteredRecipes = computed((): Recipe[] => {
  if (recipeStore.recipes === null) return [];
  if (routeType) {
    return recipeStore.getRecipesByType(routeType.value);
  }
  return recipeStore.recipes;
});
</script>

<template>
  <div
    :key="routeType"
    class="flex flex-wrap m-2 md:mx-52"
    v-if="recipeStore.recipes !== null && filteredRecipes.length > 0"
  >
    <RecipeCard
      v-for="{ id, title, image } in filteredRecipes"
      :key="id"
      :id="id"
      :title="title"
      :image="image"
    />
  </div>
</template>
