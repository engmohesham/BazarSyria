<template>
  <div class="grid grid-cols-2 gap-2">
    <div>
      <input
        type="text"
        placeholder="السعر من"
        class="w-full px-3 py-2 border border-gray-200 rounded-lg text-right"
        :value="modelValue.min"
        @input="$emit('update:modelValue', { ...modelValue, min: ($event.target as HTMLInputElement).value })"
      />
    </div>
    <div>
      <input
        type="text"
        placeholder="السعر إلى"
        class="w-full px-3 py-2 border border-gray-200 rounded-lg text-right"
        :value="modelValue.max"
        @input="$emit('update:modelValue', { ...modelValue, max: ($event.target as HTMLInputElement).value })"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface PriceRange {
  min: string
  max: string
}

defineProps<{
  modelValue: PriceRange
}>()

defineEmits<{
  (e: 'update:modelValue', value: PriceRange): void
}>()
</script> 