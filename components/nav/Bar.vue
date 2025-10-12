<script setup lang="ts">
const isCollapsed = ref(true)
const RECIPE_FORM_URL =
  'https://github.com/luxor37/mycookbook_lib/issues/new?template=new_recipe.yml&labels=recipe-suggestion'

const pages = [
  { title: 'Toutes les recettes', link: '/' },
  { title: 'Entrées', link: '/entrees' },
  { title: 'Repas', link: '/repas' },
  { title: 'Désserts', link: '/desserts' },
  { title: 'Boissons', link: '/boissons' },
  { title: 'Autres', link: '/autres' },
] as const satisfies Readonly<{
  title: string
  link: `/${Partial<Type> | ''}`
}>[]

const active = useRoute().path
</script>

<template>
  <nav
    class="absolute top-0 flex flex-col md:flex-row items-center md:items-start bg-primary w-full p-4 z-10"
  >
    <section
      class="flex md:hidden p-4 text-white opacity-75 font-extrabold uppercase align-middle"
      @click="isCollapsed = !isCollapsed"
    >
      <span class="mr-2">Menu</span>
      <UIcon :name="`${isCollapsed ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'}`" />
    </section>
    <section
      :class="[
        'flex flex-col md:flex-row transition-all ease-in-out overflow-hidden duration-500 md:items-center md:gap-4',
        isCollapsed ? 'max-h-0 md:max-h-96' : 'max-h-96',
      ]"
    >
      <section class="flex flex-col md:flex-row md:items-center">
        <section
          v-for="{ title, link } in pages"
          :key="link"
          :class="['p-4 text-gray-200 font-extrabold uppercase', active == link ? 'underline' : '']"
          @click="isCollapsed = true"
        >
          <NuxtLink :to="link">{{ title }}</NuxtLink>
        </section>
      </section>
      <section class="flex justify-center md:justify-start px-4 md:px-0 pb-4 md:pb-0">
        <UButton
          icon="i-heroicons-plus"
          color="neutral"
          variant="solid"
          size="sm"
          :to="RECIPE_FORM_URL"
          target="_blank"
          rel="noopener"
          class="font-bold"
          @click="isCollapsed = true"
          >Ajouter une recette</UButton
        >
      </section>
    </section>
  </nav>
</template>
