<script setup lang="ts">
const route = useRoute();
const navigation = computed(() => {
  const currentPath = route.path;
  return [
    {
      title: "Toutes les recettes",
      link: "/",
      isActive: currentPath === "/",
    },
    {
      title: "Entrées",
      link: "/entrees",
      isActive: currentPath === "/entrees",
    },
    {
      title: "Repas",
      link: "/repas",
      isActive: currentPath === "/repas",
    },
    {
      title: "Désserts",
      link: "/desserts",
      isActive: currentPath === "/desserts",
    },
    {
      title: "Boissons",
      link: "/boissons",
      isActive: currentPath === "/boissons",
    },
    {
      title: "Autres",
      link: "/autres",
      isActive: currentPath === "/autres",
    },
  ];
});

const isCollapsed = ref(true);
</script>

<template>
  <div class="absolute top-0 bg-primary w-screen p-4 z-10">
    <div class="flex flex-col items-center md:items-start md:flex-row">
      <div
        class="flex md:hidden p-4 text-white opacity-75 font-extrabold uppercase align-middle"
        @click="isCollapsed = !isCollapsed"
      >
        <div class="mr-2">Menu</div>
        <div>
          <UIcon
            :name="`${
              isCollapsed
                ? 'i-heroicons-chevron-up'
                : 'i-heroicons-chevron-down'
            }`"
          />
        </div>
      </div>
      <div
        :class="`flex flex-col md:flex-row transition-all ease-in-out overflow-hidden duration-500
        ${isCollapsed ? 'max-h-0 md:max-h-96' : 'max-h-96'}`"
      >
        <div
          :key="title"
          v-for="{ title, link, isActive } in navigation"
          :class="`p-4 text-white opacity-75 font-extrabold uppercase  ${
            isActive ? 'underline' : ''
          }`"
          @click="isCollapsed = true"
        >
          <NuxtLink :to="link"> {{ title }}</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
