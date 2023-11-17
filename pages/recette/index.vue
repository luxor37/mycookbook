<script setup lang="ts">
definePageMeta({
  colorMode: "light",
});

import { useRoute } from "vue-router";
import Recipe from "~/types/recipe";

const recipeStore = useRecipeStore();
const recipe = ref<Recipe | undefined>(undefined);
const route = useRoute();

watch(
  () => route.query.id,
  async (newId, oldId) => {
    if (newId) {
      if (recipeStore.recipes === null) {
        await recipeStore.parseRecipes();
      }
      const r = recipeStore.getRecipeById(newId?.toString());
      recipe.value = r;
    }
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <div v-if="recipe" class="flex flex-col items-center w-full md:w-auto">
    <div class="p-4">
      <div class="text-3xl text-primary">
        {{ recipe.title }}
      </div>
      <div class="flex flex-row">
        <div class="shadow rounded p-2">{{ recipe.portions }}</div>
        <div class="shadow rounded p-2 ml-2 flex">
          <Clock /><span class="ml-1">{{ recipe.time }}</span>
        </div>
        <div
          v-for="(tag, i) in recipe.tags"
          :key="`${tag}-${i}`"
          class="rounded shadow bg-primary text-white p-2 ml-2"
        >
          {{ tag }}
        </div>
      </div>
      <div class="flex flex-col md:flex-row">
        <div class="md:w-1/2 mt-4 md:mt-0">
          <div class="text-xl">Ingrédients:</div>
          <div class="max-w-sm">
            <div
              v-for="({ name, quantity, unit }, i) in recipe.ingredients"
              :key="`${name}-${i}`"
              class="flex justify-between"
            >
              <div>{{ name }}</div>
              <div>{{ quantity }} {{ unit }}</div>
            </div>
          </div>
        </div>
        <div class="md:w-1/2 mt-4 md:mt-0">
          <img
            :src="recipe.image"
            class="w-full rounded-lg max-w-[500px] max-h-[500px]"
          />
        </div>
      </div>

      <div class="mt-4 md:mt-0">
        <div class="text-xl">Préparation:</div>
        <ol class="list-decimal">
          <li
            v-for="(instruction, i) in recipe.preparation"
            :key="`instr-${i}`"
            class="ml-4"
          >
            {{ instruction }}
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>
