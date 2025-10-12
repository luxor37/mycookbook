<script setup lang="ts">
definePageMeta({
  middleware: 'type',
})
</script>

<template>
  <main class="flex flex-wrap m-2 md:mx-52">
    <CardRecipe
      v-for="{ id, title, image } in useRecipeStore().getRecipesByType()"
      :key="id"
      :id="id"
      :title="title"
      :image="image"
    />
  </main>
</template>
