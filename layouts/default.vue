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
  <div class="min-h-screen flex flex-col justify-between">
    <div class="pt-24 justify-center flex flex-col pb-12">
      <slot />
    </div>
    <div class="text-white bg-primary flex flex-col items-center py-4">
      <div>
        ©
        <a
          class="underline text-white"
          href="https://www.rmartel.dev"
          target="_blank"
          >Rémi Martel</a
        >, {{ new Date().getFullYear() }}. Tous droits réservés.
      </div>
      <div>
        <a
          class="underline text-white"
          href="https://github.com/luxor37/mycookbook"
          target="_blank"
          >Projet Github</a
        >
      </div>
      <div>
        <a
          class="underline text-white"
          href="https://github.com/luxor37/mycookbook_lib"
          target="_blank"
          >Librairies de recettes et d'images</a
        >
      </div>
    </div>
  </div>
</template>
