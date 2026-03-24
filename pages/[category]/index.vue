<script setup lang="ts">
definePageMeta({
  colorMode: "light",
});

const recipeStore = useRecipeStore();
const route = useRoute();

await useRecipeData();

const category = computed(() =>
  recipeStore.getCategoryFromSlug(
    typeof route.params.category === "string" ? route.params.category : undefined,
  ),
);

const recipes = computed(() => recipeStore.getRecipesByCategory(category.value));
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
