<script setup lang="ts">
definePageMeta({
  colorMode: "light",
  middleware: ["data"],
});

const recipeStore = useRecipeStore();

const { recipes } = storeToRefs(recipeStore);
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
    Catégorie en cours de chargement…
  </div>
</template>
