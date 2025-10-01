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
const source = ref<string>("");
const notes = ref<string>("");
const imagePath = computed(() => {
  if (image.value)
    return `https://raw.githubusercontent.com/luxor37/mycookbook_lib/main/images/${image.value}`;
  return undefined;
});

const ingredients = ref<Ingredient[]>([
  { name: "", quantity: "", unit: "" },
]);
const tags = ref<string>("");
const instructions = ref<string>("");
const prep = computed(() => {
  if (instructions.value.length < 1) return [];
  return instructions.value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
});
const taglist = computed(() => {
  if (tags.value.length < 1) return [];
  return tags.value
    .split(/\s+/)
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
});

const normalizedIngredients = computed(() =>
  ingredients.value.filter((ingredient) => ingredient.name?.trim())
);

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
      ingredients: normalizedIngredients.value,
      preparation: prep.value,
      image: imagePath.value,
      source: source.value,
    },
    null,
    2
  );
});

const submitting = ref(false);
const submitState = ref<'idle' | 'success' | 'error'>('idle');
const submitMessage = ref('');

const clearStatus = () => {
  submitState.value = 'idle';
  submitMessage.value = '';
};

watch([id, title, portions, time, type, image, tags, instructions, source, notes], clearStatus);

const submitRecipe = async () => {
  if (submitting.value) return;

  const missing: string[] = [];
  const cleanedIngredients = normalizedIngredients.value;
  const cleanedInstructions = prep.value;
  const cleanedTags = taglist.value;

  if (!id.value?.trim()) missing.push('Identifiant');
  if (!title.value?.trim()) missing.push('Titre');
  if (!type.value) missing.push('Catégorie');
  if (!portions.value?.trim()) missing.push('Portions');
  if (!time.value?.trim()) missing.push('Temps');
  if (!image.value?.trim()) missing.push("Nom de l'image");
  if (!cleanedIngredients.length) missing.push('Ingrédients');
  if (!cleanedInstructions.length) missing.push('Préparation');

  if (missing.length > 0) {
    submitState.value = 'error';
    submitMessage.value = `Veuillez compléter les champs suivants : ${missing.join(', ')}`;
    return;
  }

  submitting.value = true;
  submitState.value = 'idle';
  submitMessage.value = '';

  try {
    await $fetch('/.netlify/functions/submit-recipe', {
      method: 'POST',
      body: {
        id: id.value?.trim(),
        title: title.value?.trim(),
        category: type.value,
        portions: portions.value?.trim(),
        time: time.value?.trim(),
        tags: cleanedTags,
        ingredients: cleanedIngredients,
        instructions: cleanedInstructions,
        image: imagePath.value,
        source: source.value?.trim() || null,
        notes: notes.value?.trim() || null,
      },
    });

    submitState.value = 'success';
    submitMessage.value =
      "Merci! Votre suggestion a été soumise et sera examinée avant d'être ajoutée.";
  } catch (error: any) {
    submitState.value = 'error';
    submitMessage.value =
      error?.data?.message || error?.message || "Une erreur est survenue lors de l'envoi.";
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col justify-center">
    <div class="flex justify-center">
      <p class="text-center max-w-3xl">
        Ce formulaire vous permet de proposer une nouvelle recette pour MyCookbook. Une fois
        envoyé, votre suggestion créera automatiquement une demande d'ajout afin qu'elle puisse
        être revue avant d'être intégrée dans la librairie publique. Merci de fournir une image
        (500x500), des instructions détaillées et toutes les informations utiles!
      </p>
    </div>
    <div class="flex flex-row justify-center">
      <div class="flex flex-row justify-center w-1/2">
        <form @submit.prevent="submitRecipe">
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

          <div class="flex mt-2">
            <UButton
              type="button"
              icon="i-heroicons-plus"
              color="primary"
              variant="soft"
              size="sm"
              @click="addIngredient"
            >
              Ajouter un ingredient
            </UButton>
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
          <div>
            Source (optionnel):
            <input class="border" type="text" v-model="source" placeholder="https://..." />
          </div>
          <div>
            Notes (optionnel):
            <textarea v-model="notes" class="border" cols="90" rows="4" />
          </div>
          <div class="mt-4">
            <UButton
              type="submit"
              icon="i-heroicons-paper-airplane"
              color="primary"
              :loading="submitting"
            >
              Soumettre la suggestion
            </UButton>
          </div>
          <div class="mt-4 space-y-2">
            <UAlert
              v-if="submitState === 'success'"
              color="green"
              variant="soft"
              title="Suggestion envoyée"
            >
              {{ submitMessage }}
            </UAlert>
            <UAlert
              v-else-if="submitState === 'error'"
              color="red"
              variant="soft"
              title="Erreur"
            >
              {{ submitMessage }}
            </UAlert>
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
