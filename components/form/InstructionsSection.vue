<script setup lang="ts">
const props = defineProps<{
  instructions: string[];
}>();

const emit = defineEmits<{
  (e: "add"): void;
  (e: "remove", index: number): void;
}>();
</script>

<template>
  <div class="space-y-2">
    <div class="space-y-3">
      <div
        v-for="(instruction, index) in props.instructions"
        :key="`prep-${index}`"
        class="bg-gray-50 border border-gray-100 rounded-lg p-3"
      >
        <UFormField :name="`instructions.${index}`" :label="`Étape ${index + 1}`">
          <UTextarea
            v-model="props.instructions[index]"
            :name="`instructions.${index}`"
            placeholder="Décris cette étape"
            :rows="2"
            class="w-full"
            required
          />
        </UFormField>
        <div class="flex justify-end">
          <UButton
            v-if="props.instructions.length > 1"
            color="error"
            variant="ghost"
            size="xs"
            icon="i-heroicons-trash"
            class="mt-2"
            :aria-label="`Supprimer l'étape ${index + 1}`"
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
        label="Ajouter une étape"
        type="button"
      />
    </div>
  </div>
</template>
