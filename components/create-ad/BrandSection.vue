<template>
  <div v-if="showTradeMarks" class="bg-white rounded-lg shadow-sm p-6">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        {{ selectedCategory?.name || 'الماركة' }} *
      </label>
      <select 
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
        required
      >
        <option value="" disabled selected>اختر {{ selectedCategory?.name }}</option>
        <option 
          v-for="tradeMark in tradeMarks" 
          :key="tradeMark" 
          :value="tradeMark"
        >
          {{ tradeMark }}
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
  tradeMarks: {
    type: Array,
    default: () => []
  },
  selectedCategory: {
    type: Object,
    default: null
  }
});

const showTradeMarks = computed(() => {
  return props.selectedCategory && props.tradeMarks?.length > 0;
});

defineEmits(['update:modelValue']);
</script> 