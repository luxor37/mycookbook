<script setup lang="ts">
definePageMeta({
  colorMode: "light",
});
import { useRecipeStore } from "~/stores/recipes";
import { categories } from "~/types/recipe";

const recipeStore = useRecipeStore();
await useRecipeData();

const recipes = computed(() =>
  recipeStore.getRecipesByCategory(categories.ALL),
);
</script>

<template>
  <div
    class="flex flex-wrap m-2 md:mx-52 justify-center"
    v-if="recipes.length > 0"
  >
    <CardRecipe
      v-for="{ id, title, image } in recipes"
      :key="id"
      :id="id"
      :title="title"
      :image="image"
    />
  </div>
  <div v-else class="p-4 text-center text-gray-500">
    Recettes en cours de chargement…
  </div>
</template>
