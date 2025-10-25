<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    modelValue: [String, Number],
    label: String,
    id: String,
    placeholder: String,
    type: { type: String, default: 'text' }
  })

  const emit = defineEmits(['update:modelValue'])

  const model = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
  })
</script>

<template>
  <div class="flex flex-col w-full pt-3">
    <label v-if="label" :for="id" class="text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </label>
    <input
      :id="id"
      v-bind="$attrs"
      v-model="model"
      class="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      :type="type"
      :placeholder="placeholder"
    />
  </div>
</template>