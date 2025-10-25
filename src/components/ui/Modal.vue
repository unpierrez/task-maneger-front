<script setup>
  const props = defineProps({
    isOpen: { type: Boolean, default: false },
    title: { type: String, default: '' }
  })

  const emit = defineEmits(['close'])
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
      <h2 class="text-xl font-bold mb-4">{{ title }}</h2>
      
      <slot />

      <div class="flex justify-end gap-2 mt-4">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>
