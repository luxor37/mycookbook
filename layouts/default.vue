<script setup lang="ts">
import { useRecipeStore } from "~/stores/recipes";

onMounted(() => {
  const recipeStore = useRecipeStore();
  if (recipeStore.recipes === null) {
    recipeStore.parseRecipes();
  }
});
</script>

<template>
  <NavBar />
  <slot />
</template>
