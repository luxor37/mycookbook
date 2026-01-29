<script setup lang="ts">
definePageMeta({ colorMode: "light" });

import { useRecipeForm } from "~/composables/useRecipeForm";

const {
  formState,
  schema,
  recipeId,
  categorySelectOptions,
  netlifyJson,
  units,
  onCreateUnit,
  addIngredient,
  removeIngredient,
  addInstruction,
  removeInstruction,
  handleSubmit,
  isSubmitting,
  errorMessage,
  responseMessage,
  responseUrl,
  warnings,
  normalizeIngredientFraction,
  NETLIFY_FORM_NAME,
  imageError,
  imageName,
  onImageFileChange,
} = useRecipeForm();

const imageInput = ref<HTMLInputElement | null>(null);
</script>

<template>
  <div class="md:max-w-5xl md:mx-auto px-4 md:px-6 pb-12">
    <UCard class="w-full" as="div" variant="subtle">
      <template #header>
        <div class="flex flex-wrap justify-between gap-3 items-center">
          <div>
            <p class="text-xs tracking-wide uppercase text-gray-500">
              Soumission
            </p>
            <h1 class="text-3xl font-extrabold text-primary">
              Proposer une recette
            </h1>
          </div>
        </div>
      </template>

      <UForm
        class="mt-6 space-y-6"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        :state="formState"
        :schema="schema"
        @submit="handleSubmit"
      >
        <input type="hidden" name="form-name" :value="NETLIFY_FORM_NAME" />
        <input type="hidden" name="json" :value="netlifyJson" />
        <div class="hidden">
          <label>
            Ne pas remplir :
            <input
              name="bot-field"
              v-model="formState.botField"
              autocomplete="off"
            />
          </label>
        </div>

        <UAlert
          v-if="errorMessage"
          color="error"
          variant="soft"
          icon="i-heroicons-exclamation-circle"
          :description="errorMessage"
        />
        <UAlert
          v-if="responseMessage"
          color="success"
          variant="soft"
          icon="i-heroicons-check-badge"
          :description="responseMessage"
        >
          <template #title>
            Suggestion envoyée
            <UButton
              v-if="responseUrl"
              :href="responseUrl"
              target="_blank"
              color="success"
              variant="ghost"
              size="xs"
              label="Voir la PR"
              class="ml-2"
            />
          </template>
        </UAlert>
        <UAlert
          v-if="warnings.length > 0"
          color="warning"
          variant="soft"
          icon="i-heroicons-exclamation-triangle"
          :description="warnings.join(' ')"
        />

        <div class="grid md:grid-cols-2 gap-4">
          <UFormField label="Titre" name="title" required>
            <UInput
              v-model="formState.title"
              name="title"
              placeholder="Tarte aux pommes"
              required
              class="w-full"
            />
            <p class="text-xs text-gray-500 mt-1">
              Identifiant généré :
              <code>{{ recipeId || "à compléter" }}</code>
            </p>
          </UFormField>

          <UFormField label="Catégorie" name="category" required>
            <USelect
              v-model="formState.category"
              name="category"
              :options="categorySelectOptions"
              placeholder="Choisir une catégorie"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Portions" name="portions" required>
            <UInput
              v-model="formState.portions"
              name="portions"
              placeholder="4 portions"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField label="Temps de préparation" name="time" required>
            <UInput
              v-model="formState.time"
              name="time"
              placeholder="30 minutes"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField label="Image (500x500)" name="image" required>
            <div
              class="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary"
              @dragover.prevent
              @drop.prevent="(e) => onImageFileChange(e.dataTransfer?.files || null)"
              @click="imageInput?.click()"
            >
              <p class="font-semibold">Glisser-déposer ou cliquer pour choisir</p>
              <p class="text-xs text-gray-500 mt-1">
                JPEG/PNG exactement 500x500
              </p>
              <p v-if="imageName" class="text-xs text-primary mt-2">
                {{ imageName }}
              </p>
            </div>
            <input
              ref="imageInput"
              type="file"
              class="hidden"
              accept="image/jpeg,image/png"
              @change="(e) => onImageFileChange((e.target as HTMLInputElement)?.files)"
            />
            <p v-if="imageError" class="text-xs text-red-600 mt-1">
              {{ imageError }}
            </p>
          </UFormField>

          <UFormField
            label="Tags (séparés par des virgules)"
            name="tags"
            description="Appuyer 'ENTER' entre chaque tag"
          >
            <UInputTags class="w-full" v-model="formState.tags" name="tags" />
          </UFormField>
        </div>

        <USeparator label="Ingrédients" />
        <FormIngredientsSection
          :ingredients="formState.ingredients"
          :units="units"
          @add="addIngredient"
          @remove="removeIngredient"
          @create-unit="onCreateUnit"
          @normalize-fraction="({ index, value }) => normalizeIngredientFraction(index, value)"
        />

        <USeparator label="Préparation" />
        <FormInstructionsSection
          :instructions="formState.instructions"
          @add="addInstruction"
          @remove="removeInstruction"
        />

        <div
          class="flex flex-col md:flex-row md:items-center md:justify-end gap-3 pt-2"
        >
          <UButton
            type="submit"
            color="primary"
            size="lg"
            icon="i-heroicons-paper-airplane"
            :loading="isSubmitting"
            :label="isSubmitting ? 'Envoi...' : 'Envoyer la recette'"
          />
        </div>
      </UForm>
    </UCard>
  </div>
</template>
