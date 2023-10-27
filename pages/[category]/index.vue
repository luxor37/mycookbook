<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
const routeType = ref<CATEGORY>("ALL");

watch(
  route,
  (to) => {
    switch (to.params.category) {
      case "entree":
        routeType.value = "ENTREES";
        break;
      case "repas":
        routeType.value = "REPAS";
        break;
      case "desserts":
        routeType.value = "DESSERTS";
        break;
      case "boissons":
        routeType.value = "BOISSONS";
        break;
      case "autres":
        routeType.value = "AUTRES";
        break;
      default:
        routeType.value = "ALL";
    }
  },
  { deep: true, immediate: true }
);

import { useRecipeStore } from "~/stores/recipes";
import { CATEGORY } from "~/types/recipe";

const filteredRecipes = computed(() => {
  const recipeStore = useRecipeStore();
  const { recipes } = recipeStore;
  if (recipes !== null) {
    if (routeType) {
      return recipeStore.getRecipesByType(routeType.value);
    }
    console.log("All recipes");
    return recipes;
  }
  console.log("No Recipes");
  return [];
});
</script>

<template>
  <div :key="routeType" v-if="filteredRecipes.length > 0">
    <div :key="recipe.title" v-for="recipe in filteredRecipes">
      {{ recipe.title }}
    </div>
  </div>
</template>

<style scoped>
.aspect-ratio {
  width: 100%; /* or any width you desire */
  padding-top: 50%; /* 2:1 Aspect Ratio */
  position: relative; /* If you want text inside of the container */
}

.aspect-content {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

.bg-zoom {
  background-size: cover;
  transition: background-size 0.5s ease-in-out;
  background-position: center;
}

.bg-zoom:hover {
  background-size: 110%;
}

.bg-gradient {
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0) 60%
  );
}
</style>
