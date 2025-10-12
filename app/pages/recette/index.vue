<script setup lang="ts" async>
const recipeStore = useRecipeStore();
const recipe = ref<Recipe | undefined>();
const id = useRoute().query.id?.toString();

if (!recipeStore.recipes) {
  await recipeStore.parseRecipes();
}

if (id) {
  recipe.value = recipeStore.getRecipeById(id);
}

if (!recipe.value) {
  navigateTo("/");
}
</script>

<template>
  <main v-if="recipe" class="flex flex-col items-center w-full md:w-auto">
    <article class="p-4 md:max-w-7xl">
      <h2 class="text-3xl text-primary font-extrabold">
        {{ recipe.title }}
      </h2>

      <ul class="flex flex-row pt-2 flex-wrap gap-2">
        <li>
          <TagWrapper>{{ recipe.portions }}</TagWrapper>
        </li>
        <li>
          <TagWrapper>
            <ClockIcon /><span class="ml-1">{{ recipe.time }}</span>
          </TagWrapper>
        </li>
        <template v-for="tag in recipe.tags" :key="`${tag}-${i}`">
          <li>
            <TagWrapper class="bg-primary text-white">
              {{ tag }}
            </TagWrapper>
          </li>
        </template>
      </ul>

      <section class="w-full flex flex-col md:flex-row mt-4">
        <section class="md:w-1/2 md:pr-2">
          <h4 class="text-xl">Ingrédients:</h4>
          <ul class="max-w-sm mt-2">
            <template
              v-for="({ name, quantity, unit }, i) in recipe.ingredients"
              :key="`${name}-${i}`"
            >
              <li class="flex justify-between border-t-2">
                <p>{{ name }}</p>

                <span>{{ quantity }} {{ unit }}</span>
              </li>
            </template>
          </ul>

          <h4 class="text-xl mt-8">Préparation:</h4>
          <ol class="list-decimal">
            <li
              v-for="(instruction, i) in recipe.preparation"
              :key="`instr-${i}`"
              class="ml-4 mt-2"
            >
              {{ instruction }}
            </li>
          </ol>
        </section>

        <aside class="mt-8 md:mt-0 md:w-1/2 md:pl-2 max-w-[500px]">
          <img
            :src="recipe.image"
            class="w-full rounded-lg max-w-[500px] max-h-[500px] shadow-md"
          />
        </aside>
      </section>
    </article>
  </main>
</template>
