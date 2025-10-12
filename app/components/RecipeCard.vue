<script setup lang="ts">
defineProps<{
  id: string;
  title: string;
  image: string;
}>();
</script>

<template>
  <NuxtLink :to="`/recette?id=${id}`" class="w-1/2 max-w-xs p-2">
    <section
      class="relative w-full pt-[100%] mt-4 rounded-lg bg-slate-500 bg-center bg-cover hover:bg-size-[110%] transition duration-500 ease-in-out"
      :style="`background-image: url(${image});`"
    >
      <aside
        class="absolute inset-0 w-full h-full rounded-lg bg-linear-to-b from-slate-950/0 from-60% via-slate-950/50 via-80% to-slate-950/70"
      >
        <span class="absolute bottom-0 w-full p-2 font-extrabold text-gray-200">
          {{ title }}
        </span>
      </aside>
    </section>
  </NuxtLink>
</template>
