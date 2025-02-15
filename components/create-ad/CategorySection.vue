<template>
  <div class="bg-white rounded-lg p-6 shadow-sm">
    <h2 class="text-xl mb-4">{{ selectedCategory?.name || 'الفئة' }}</h2>
    
    <!-- Category Selection -->
    <div class="mb-4">
      <label class="block text-gray-700 mb-2">اختر الفئة</label>
      <select
        v-model="modelValue.category"
        class="w-full p-2 border rounded-lg"
        required
      >
        <option value="">اختر الفئة</option>
        <option
          v-for="category in categories"
          :key="category._id"
          :value="category._id"
        >
          {{ category.name }}
        </option>
      </select>
    </div>

    <!-- Subcategory Selection -->
    <div v-if="modelValue.category && allSubCategories.length > 0">
      <label class="block text-gray-700 mb-2">
        {{ selectedCategory?.name || 'اختر الفئة الفرعية' }}
      </label>
      <select
        v-model="modelValue.subCategory"
        class="w-full p-2 border rounded-lg"
        required
      >
        <option value="">اختر الفئة الفرعية</option>
        <option
          v-for="subCategory in allSubCategories"
          :key="subCategory._id"
          :value="subCategory._id"
        >
          {{ subCategory.name }}
        </option>
      </select>
    </div>

    <!-- Trade Marks Display -->
    <div v-if="selectedCategory?.tradeMarks?.length" class="mt-4">
      <label class="block text-gray-700 mb-2">الماركات المتاحة:</label>
      <div class="flex flex-wrap gap-2">
        <span 
          v-for="tradeMark in selectedCategory.tradeMarks" 
          :key="tradeMark"
          class="px-3 py-1 bg-gray-100 rounded-full text-sm"
        >
          {{ tradeMark }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  categories: {
    type: Array,
    required: true
  },
  allSubCategories: {
    type: Array,
    required: true
  }
});

const selectedCategory = computed(() => {
  return props.categories.find(cat => cat._id === props.modelValue.category);
});

defineEmits(['update:modelValue']);
</script> 