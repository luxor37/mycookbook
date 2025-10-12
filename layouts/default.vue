<script setup lang="ts">
definePageMeta({
  colorMode: 'light',
})

const recipeStore = useRecipeStore()
const ensureRecipes = async () => {
  await recipeStore.parseRecipes()
}

onServerPrefetch(ensureRecipes)
onMounted(ensureRecipes)
</script>

<template>
  <NavBar />
  <main class="min-h-screen flex flex-col justify-between">
    <section class="pt-24 justify-center flex flex-col pb-12">
      <slot />
    </section>
    <Footer />
  </main>
</template>
