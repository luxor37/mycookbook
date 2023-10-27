<script setup lang="ts">
const navigation = [
  {
    title: "Accueil",
    link: "/",
  },
  {
    title: "Entrées",
    link: "/entrees",
  },
  {
    title: "Repas",
    link: "/repas",
  },
  {
    title: "Désserts",
    link: "/desserts",
  },
  {
    title: "Boissons",
    link: "/boissons",
  },
  {
    title: "Autres",
    link: "/autres",
  },
];
</script>

<template>
  <div class="absolute top-0 bg-primary w-screen p-4">
    <div class="flex flex-row">
      <div
        :key="title"
        v-for="{ title, link } in navigation"
        class="p-4 text-white opacity-75 font-extrabold uppercase"
      >
        <NuxtLink :to="link"> {{ title }}</NuxtLink>
      </div>
    </div>
  </div>
</template>
