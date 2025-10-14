<script setup lang="ts">
definePageMeta({
  colorMode: "light",
  middleware: ["recipe"],
});

const recipeStore = useRecipeStore();
const { activeRecipe: recipe } = storeToRefs(recipeStore);
</script>

<template>
  <div class="flex flex-col items-center w-full md:w-auto">
    <div v-if="recipe" class="p-4 md:max-w-7xl">
      <div class="text-3xl text-primary font-extrabold">
        {{ recipe.title }}
      </div>
      <div class="flex flex-row pt-2 flex-wrap gap-2">
        <UBadge :label="`${recipe.portions} portions`" class="font-bold" />
        <UBadge icon="i-mdi-clock" :label="recipe.time" class="font-bold" />
        <!-- <UBadge
          v-for="(tag, i) in recipe.tags"
          :key="`${tag}-${i}`"
          class="bg-primary text-white"
          :label="tag"
        /> -->
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
              <div class="flex flex-row">
                <UCheckbox class="pr-2" />{{ name }}
              </div>
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
    <div v-else class="p-4 text-center text-gray-500">
      Recette en cours de chargement…
    </div>
  </div>
</template>
