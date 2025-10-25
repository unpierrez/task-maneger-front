<script setup>
  const props = defineProps({
    title: { type: String, required: true },
    subtitle: { type: String, default: '' }
  })
</script>

<template>
  <header class="flex justify-between items-center pb-4 mb-8 border-b border-gray-300 flex-wrap">
    <div>
      <h1 class="text-3xl font-bold text-gray-800">{{ title }}</h1>
      <p v-if="subtitle" class="text-gray-600 text-sm mt-1" v-html="subtitle" />
    </div>

    <slot name="actions" />
  </header>
</template>
