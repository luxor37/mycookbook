<script setup lang="ts">
import { useRecipeStore } from "~/stores/recipes";

const recipeStore = useRecipeStore();

onMounted(() => {
  if (recipeStore.recipes === null) {
    recipeStore.parseRecipes();
  }
});
if (recipeStore.recipes === null) {
  recipeStore.parseRecipes();
}
</script>

<template>
  <NavBar />
  <div class="mt-24">
    <slot />
  </div>
</template>
