<script setup lang="ts">
definePageMeta({
  colorMode: "light",
});

const recipeStore = useRecipeStore();
const ensureRecipes = async () => {
  await recipeStore.parseRecipes();
};

onServerPrefetch(ensureRecipes);
onMounted(ensureRecipes);
</script>

<template>
  <NavBar />
  <main class="min-h-screen flex flex-col justify-between">
    <section class="pt-24 justify-center flex flex-col pb-12">
      <slot />
    </section>
    <footer class="text-white bg-primary flex flex-col items-center py-4">
      <span>
        ©
        <NuxtLink
          to="https://www.rmartel.dev"
          target="_blank"
          class="underline text-white"
        >
          Rémi Martel
        </NuxtLink>
        , {{ new Date().getFullYear() }}. Tous droits réservés.
      </span>
      <span>
        <NuxtLink
          to="https://github.com/luxor37/mycookbook"
          target="_blank"
          class="underline text-white"
        >
          Github Projet
        </NuxtLink>
      </span>
      <span>
        <NuxtLink
          to="https://github.com/luxor37/mycookbook_lib"
          target="_blank"
          class="underline text-white"
        >
          Librairies de recettes et d'images
        </NuxtLink>
      </span>
    </footer>
  </main>
</template>
