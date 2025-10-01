<script setup lang="ts">
import { CATEGORY, type Ingredient } from "~/types/recipe";

definePageMeta({
  colorMode: "light",
});
const id = ref<string>();
const title = ref<string>();
const portions = ref<string>();
const time = ref<string>();
const type = ref<CATEGORY>();
const image = ref<string>();
const imagePath = computed(() => {
  if (image.value)
    return `https://raw.githubusercontent.com/luxor37/mycookbook_lib/main/images/${image.value}`;
  return undefined;
});

const ingredients = ref<Ingredient[]>([]);
const tags = ref<string>("");
const instructions = ref<string>("");
const prep = computed(() => {
  if (instructions.value.length < 1) return [];
  return instructions.value.split(/\r?\n/);
});
const taglist = computed(() => {
  if (tags.value.length < 1) return [];
  return tags.value.split(/ /);
});

const addIngredient = () => {
  ingredients.value.push({
    name: "",
    quantity: "",
    unit: "",
  });
};

const types = computed(() => {
  return Object.values(CATEGORY).filter((t) => t !== CATEGORY.ALL);
});

const output = computed(() => {
  return JSON.stringify(
    {
      id: id.value,
      type: type.value?.toString(),
      title: title.value,
      portions: portions.value,
      time: time.value,
      tags: taglist.value,
      ingredients: ingredients.value,
      preparation: prep.value,
      image: imagePath.value,
      source: "",
    },
    null,
    2
  );
});
</script>

<template>
  <div class="flex flex-col justify-center">
    <div class="flex justify-center">
      <p>
        Ce formulaire permet de creer le code JSON pour ajouter une recette. Une
        fois la recette entree, simplement copier le code dans la boite et me la
        soumettre sur
        <a
          class="underline text-primary"
          href="https://github.com/luxor37/mycookbook_lib"
          target="_blank"
        >
          github
        </a>
        avec une image png ou jpeg 500x500
      </p>
    </div>
    <div class="flex flex-row justify-center">
      <div class="flex flex-row justify-center w-1/2">
        <form>
          <div>
            ID (unique): <input class="border" type="text" v-model="id" />
          </div>
          <div>
            Type:
            <select v-model="type" class="border">
              <option v-for="(type, i) in types" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>
          <div>Titre: <input class="border" type="text" v-model="title" /></div>
          <div>
            Portions: <input class="border" type="text" v-model="portions" />
          </div>
          <div>Temps: <input class="border" type="text" v-model="time" /></div>
          <div>
            <div>Tags (separe par un espace):</div>
            <textarea v-model="tags" class="border" cols="90" rows="2" />
          </div>

          <div
            v-for="(ingredient, i) in ingredients"
            :key="`i-${i}`"
            class="border p-4"
          >
            <div>
              name:
              <input class="border" type="text" v-model="ingredient.name" />
            </div>
            <div>
              qty:
              <input class="border" type="text" v-model="ingredient.quantity" />
            </div>
            <div>
              unit:
              <input class="border" type="text" v-model="ingredient.unit" />
            </div>
          </div>

          <div class="flex">
            <div
              class="border rounded-md p-1 bg-primary text-white cursor-pointer"
              @click="addIngredient"
            >
              Ajouter un ingredient
            </div>
          </div>
          <div>
            <div>Preparation (une instruction par ligne):</div>
            <textarea
              v-model="instructions"
              class="border"
              cols="90"
              rows="10"
            />
          </div>
          <div>
            Nom de l'image (incluant l'extension):
            <input class="border" type="text" v-model="image" />
          </div>
        </form>
      </div>
      <div class="mt-4 flex justify-center w-1/2">
        <textarea
          readonly
          v-model="output"
          class="border"
          rows="50"
          cols="100"
        />
      </div>
    </div>
  </div>
</template>
