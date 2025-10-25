<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    modelValue: String,
    label: String
  })

  const emit = defineEmits(['update:modelValue'])

  const model = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
  })
</script>

<template>
  <div class="flex flex-col w-full pt-3">
    <label v-if="label" class="text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </label>
    <select
      v-model="model"
      class="cursor-pointer p-2 pr-6 border rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <slot />
    </select>
  </div>
</template>


