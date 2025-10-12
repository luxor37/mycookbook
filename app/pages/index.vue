<script setup lang="ts">
import { useRecipeStore } from "~/stores/recipes";

definePageMeta({
  middleware: "category",
});

const routeType = useRouteType();
const recipeStore = useRecipeStore();
</script>

<template>
  <main
    v-if="recipeStore.recipes !== null && recipeFilter.length > 0"
    :key="routeType.get().value"
    class="flex flex-wrap m-2 md:mx-52"
  >
    <CardRecipe
      v-for="{ id, title, image } in recipeFilter"
      :key="id"
      :id="id"
      :title="title"
      :image="image"
    />
  </main>
</template>
