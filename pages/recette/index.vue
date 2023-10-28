<script setup lang="ts">
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
  <div v-if="recipe" class="flex flex-col">
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
    <div>
      <img :src="recipe.image" class="max-w-[500px] max-h-[500px]" />
    </div>

    <div>
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
    <div>
      <div class="text-xl">Préparation:</div>
      <ol>
        <li
          v-for="(instruction, i) in recipe.preparation"
          :key="`instr-${i}`"
          class="flex"
        >
          {{ instruction }}
        </li>
      </ol>
    </div>
  </div>
</template>
