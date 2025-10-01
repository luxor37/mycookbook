<script setup lang="ts">
interface Props {
  id: string;
  title: string;
  image: string;
}

const { id, title, image } = defineProps<Props>();

const router = useRouter();
</script>
<template>
  <div
    @click="router.push(`/recette?id=${id}`)"
    class="w-1/2 max-w-xs cursor-pointer p-2"
  >
    <div class="aspect-ratio">
      <div
        class="aspect-content mt-4 rounded-lg bg-slate-500 bg-zoom"
        :style="`background-image: url(${image});`"
      >
        <div class="h-full w-full bg-gradient rounded-lg">
          <div
            class="text-gray-200 bottom-0 absolute w-full p-2 font-extrabold"
          >
            {{ title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.aspect-ratio {
  width: 100%; /* or any width you desire */
  padding-top: 100%; /* 1:1 Aspect Ratio */
  position: relative; /* If you want text inside of the container */
}

.aspect-content {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

.bg-zoom {
  background-size: cover;
  transition: background-size 0.5s ease-in-out;
  background-position: center;
}

.bg-zoom:hover {
  background-size: 110%;
}

.bg-gradient {
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0) 60%
  );
}
</style>
