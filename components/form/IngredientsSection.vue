<script setup lang="ts">
import type { Ingredient } from "~/types/recipe";

const props = defineProps<{
  ingredients: Ingredient[];
  units: string[];
}>();

const emit = defineEmits<{
  (e: "add"): void;
  (e: "remove", index: number): void;
  (e: "create-unit", index: number, item: string): void;
  (e: "normalize-fraction", payload: { index: number; value: string }): void;
}>();
</script>

<template>
  <div class="space-y-2">
    <div class="space-y-3">
      <div
        v-for="(ingredient, index) in props.ingredients"
        :key="`ing-${index}`"
        class="grid md:grid-cols-3 gap-2 items-center bg-gray-50 border border-gray-100 rounded-lg p-3"
      >
        <UFormField :name="`ingredients.${index}.name`" label="Nom">
          <UInput
            v-model="ingredient.name"
            :name="`ingredients.${index}.name`"
            placeholder="Nom"
            required
            class="w-full"
          />
        </UFormField>
        <UFormField :name="`ingredients.${index}.quantity`" label="Quantité">
          <UInput
            v-model="ingredient.quantity"
            :name="`ingredients.${index}.quantity`"
            placeholder="Quantité"
            class="w-full"
            @update:model-value="(value) => emit('normalize-fraction', { index, value })"
          />
        </UFormField>
        <div class="flex gap-2">
          <UFormField
            :name="`ingredients.${index}.unit`"
            label="Unité"
            class="w-full"
          >
            <USelectMenu
              v-model="ingredient.unit"
              :name="`ingredients.${index}.unit`"
              create-item
              placeholder="Unité"
              :items="props.units"
              class="w-full"
              @create="(item) => emit('create-unit', index, item)"
            />
          </UFormField>
          <UButton
            v-if="props.ingredients.length > 1"
            color="error"
            variant="ghost"
            icon="i-heroicons-trash"
            :aria-label="`Supprimer l'ingrédient ${index + 1}`"
            @click="emit('remove', index)"
            type="button"
          />
        </div>
      </div>
    </div>
    <div class="flex justify-between items-center">
      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        icon="i-heroicons-plus-circle"
        @click="emit('add')"
        label="Ajouter"
        type="button"
      />
    </div>
  </div>
</template>
