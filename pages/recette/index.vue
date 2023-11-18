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
    <div class="p-4 md:max-w-7xl">
      <div class="text-3xl text-primary font-extrabold">
        {{ recipe.title }}
      </div>
      <div class="flex flex-row pt-2">
        <Tag>{{ recipe.portions }}</Tag>
        <Tag class="ml-2">
          <Clock /><span class="ml-1">{{ recipe.time }}</span>
        </Tag>
        <Tag
          v-for="(tag, i) in recipe.tags"
          :key="`${tag}-${i}`"
          class="bg-primary text-white ml-2"
        >
          {{ tag }}
        </Tag>
      </div>
      <div class="flex flex-col md:flex-row mt-4">
        <div class="md:w-1/2 md:pr-2">
          <div class="text-xl">Ingrédients:</div>
          <div class="max-w-sm mt-2">
            <div
              v-for="({ name, quantity, unit }, i) in recipe.ingredients"
              :key="`${name}-${i}`"
              class="flex justify-between border-t-2"
            >
              <div>{{ name }}</div>
              <div>{{ quantity }} {{ unit }}</div>
            </div>
          </div>
          <div class="mt-8">
            <div class="text-xl">Préparation:</div>
            <ol class="list-decimal">
              <li
                v-for="(instruction, i) in recipe.preparation"
                :key="`instr-${i}`"
                class="ml-4 mt-2"
              >
                {{ instruction }}
              </li>
            </ol>
          </div>
        </div>

        <div class="mt-8 md:mt-0 md:w-1/2 md:pl-2 max-w-[500px]">
          <img
            :src="recipe.image"
            class="w-full rounded-lg max-w-[500px] max-h-[500px] shadow-md"
          />
        </div>
      </div>
    </div>
  </div>
</template>
