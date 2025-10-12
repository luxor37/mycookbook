<template>
  <footer class="text-white bg-primary flex flex-col items-center py-4">
    <span>
      ©
      <NuxtLink to="https://www.rmartel.dev" target="_blank" class="underline text-white"
        >Rémi Martel</NuxtLink
      >
      , {{ new Date().getFullYear() }}. Tous droits réservés.
    </span>
    <span>
      <NuxtLink
        to="https://github.com/luxor37/mycookbook"
        target="_blank"
        class="underline text-white"
        >Github Projet</NuxtLink
      >
    </span>
    <span>
      <NuxtLink
        to="https://github.com/luxor37/mycookbook_lib"
        target="_blank"
        class="underline text-white"
        >Librairies de recettes et d'images</NuxtLink
      >
    </span>
  </footer>
</template>
