<template>
  <div v-if="showBrands" class="bg-white rounded-lg shadow-sm p-6">
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
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  brands: {
    type: Array,
    default: () => []
  },
  selectedCategory: {
    type: Object,
    default: null
  }
});

const showBrands = computed(() => {
  return props.selectedCategory && props.selectedCategory.tradeMarks?.length > 0;
});

defineEmits(['update:modelValue']);
</script> 