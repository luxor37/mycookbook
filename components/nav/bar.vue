<script setup lang="ts">
const navigation = [
  {
    title: "Accueil",
    link: "/",
  },
  {
    title: "Entrées",
    link: "/?type=ENTREES",
  },
  {
    title: "Repas",
    link: "/?type=REPAS",
  },
  {
    title: "Désserts",
    link: "/?type=DESSERTS",
  },
  {
    title: "Boissons",
    link: "/?type=BOISSONS",
  },
  {
    title: "Autres",
    link: "/?type=AUTRES",
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
