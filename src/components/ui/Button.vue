<script setup>
  const props = defineProps({
    variant: {
      type: String,
      default: 'primary'
    }
  })
</script>

<template>
  <button
    v-bind="$attrs"
    :class="[
      'px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 cursor-pointer',
      variant === 'primary'
        ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-300'
        : variant === 'danger'
        ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-300'
        : variant === 'secondary'
        ? 'bg-gray-300 hover:bg-gray-400 text-gray-800 focus:ring-gray-300'
        : ''
    ]"
  >
    <slot />
  </button>
</template>
