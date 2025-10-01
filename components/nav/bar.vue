<script setup lang="ts">
const NAV_ITEMS = [
  { title: "Toutes les recettes", link: "/" },
  { title: "Entrées", link: "/entrees" },
  { title: "Repas", link: "/repas" },
  { title: "Désserts", link: "/desserts" },
  { title: "Boissons", link: "/boissons" },
  { title: "Autres", link: "/autres" },
] as const;

const route = useRoute();
const navigation = computed(() => {
  const currentPath = route.path;
  return NAV_ITEMS.map((item) => ({
    ...item,
    isActive: currentPath === item.link,
  }));
});

const isCollapsed = ref(true);
</script>

<template>
  <div class="absolute top-0 bg-primary w-full p-4 z-10">
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
        :class="[
          'flex flex-col md:flex-row transition-all ease-in-out overflow-hidden duration-500',
          isCollapsed ? 'max-h-0 md:max-h-96' : 'max-h-96',
        ]"
      >
        <div
          v-for="{ title, link, isActive } in navigation"
          :key="link"
          :class="[
            'p-4 text-gray-200 font-extrabold uppercase',
            { underline: isActive },
          ]"
          @click="isCollapsed = true"
        >
          <NuxtLink :to="link"> {{ title }}</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
