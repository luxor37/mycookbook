<script setup lang="ts">
definePageMeta({
  colorMode: "light",
});
import { useRoute } from "vue-router";
import { useRecipeStore } from "~/stores/recipes";
import Recipe, { CATEGORY } from "~/types/recipe";

const route = useRoute();
const router = useRouter();
const routeType = ref<CATEGORY>(CATEGORY.ALL);
const recipeStore = useRecipeStore();

watch(
  route,
  (to) => {
    switch (to.params.category) {
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
  { deep: true, immediate: true }
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
    <div
      @click="router.push(`/recette?id=${id}`)"
      v-for="{ id, title, image } in filteredRecipes"
      :key="id"
      class="w-1/2 max-w-xs cursor-pointer p-2"
    >
      <div class="aspect-ratio">
        <div
          class="aspect-content mt-4 rounded-lg bg-slate-500 bg-zoom"
          :style="`background-image: url(${image});`"
        >
          <div class="h-full w-full bg-gradient rounded-lg">
            <div
              class="text-gray-200 bottom-0 absolute w-full p-2 font-extrabold"
            >
              {{ title }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.aspect-ratio {
  width: 100%; /* or any width you desire */
  padding-top: 100%; /* 1:1 Aspect Ratio */
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
