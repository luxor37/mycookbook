<script setup lang="ts">
import { useRoute } from "vue-router";

watch(
  () => route.query.id,
  (newId, oldId) => {
    // elementStore.fetchElement(Number(newId));
  },
  { deep: true, immediate: true }
);

const route = useRoute();
const { id } = route.params;
</script>

<template>ID: {{ id }}</template>
