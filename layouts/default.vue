<script setup lang="ts">
const year = computed<string>(() => `${new Date().getFullYear()}`);
</script>

<template>
  <NavBar />
  <div class="min-h-screen flex flex-col justify-between">
    <div class="pt-24 justify-center flex flex-col pb-12">
      <slot />
    </div>
    <div class="text-white bg-primary flex flex-col items-center py-4">
      <div class="flex flex-row">
        <UButton
          variant="ghost"
          class="text-white underline p-0"
          label="Rémi Martel"
          size="xl"
          icon="i-mdi-copyright"
          href="https://www.rmartel.dev"
          :ui="{
            leadingIcon: 'text-white',
          }"
        />
        {{ `, ${year}. Tous droits réservés.` }}
      </div>
      <div>
        <UButton
          variant="ghost"
          class="text-white underline text-md"
          href="https://github.com/luxor37/mycookbook"
          target="_blank"
          label="Projet Github"
        />
      </div>
      <div>
        <UButton
          variant="ghost"
          class="text-white underline text-md"
          href="https://github.com/luxor37/mycookbook_lib"
          target="_blank"
          label="Librairies de recettes et d'images"
        />
      </div>
    </div>
  </div>
</template>
