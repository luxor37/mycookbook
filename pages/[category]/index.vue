<script setup lang="ts">
definePageMeta({
  colorMode: "light",
});
import { useRoute } from "vue-router";
import { useRecipeStore } from "~/stores/recipes";
import { CATEGORY, type Recipe } from "~/types/recipe";

const route = useRoute();
const routeType = ref<CATEGORY>(CATEGORY.ALL);
const recipeStore = useRecipeStore();
const routeCategory = computed(() => route.params.category);

watch(
  routeCategory,
  (categoryParam) => {
    switch (categoryParam) {
      case "entrees":
        routeType.value = CATEGORY.ENTREES;
        break;
      case "repas":
        routeType.value = CATEGORY.REPAS;
        break;
      case "desserts":
        routeType.value = CATEGORY.DESSERTS;
        break;
      case "boissons":
        routeType.value = CATEGORY.BOISSONS;
        break;
      case "autres":
        routeType.value = CATEGORY.AUTRES;
        break;
      default:
        routeType.value = CATEGORY.ALL;
    }
  },
  { immediate: true }
);

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
