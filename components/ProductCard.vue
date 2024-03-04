<template>
  <NuxtLink :to="`/shop/${handle}`" class="product---card">
    <div>
      <div class="product---image">
        <NuxtImg loading="lazy" :src="image" alt="Image" />
      </div>
      <div class="product---head">
        <h1 class="product---head---text">{{ title }}</h1>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  handle: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
});
</script>
