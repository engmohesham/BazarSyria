<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        الماركة *
      </label>
      <select 
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
        required
      >
        <option value="" disabled selected>اختر الماركة</option>
        <option v-for="brand in brands" :key="brand._id" :value="brand._id">
          {{ brand.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true
  },
  brands: {
    type: Array,
    default: () => []
  }
})

defineEmits(['update:modelValue'])
</script> 