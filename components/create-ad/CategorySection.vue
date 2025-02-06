<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        الفئة الرئيسية *
      </label>
      <select 
        v-model="modelValue.category"
        class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
        required
      >
        <option value="" disabled selected>ادخل الفئة</option>
        <option v-for="category in categories" :key="category._id" :value="category._id">
          {{ category.name }}
        </option>
      </select>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        الفئة الفرعية *
      </label>
      <select 
        v-model="modelValue.subCategory"
        class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
        required
      >
        <option value="" disabled selected>ادخل الفئة</option>
        <option 
          v-for="subCat in filteredSubCategories" 
          :key="subCat._id" 
          :value="subCat._id"
        >
          {{ subCat.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  categories: {
    type: Array,
    default: () => []
  },
  allSubCategories: {
    type: Array,
    default: () => []
  }
})

const filteredSubCategories = computed(() => {
  if (!props.modelValue.category) return []
  return props.allSubCategories.filter(sub => sub.categoryId === props.modelValue.category)
})
</script> 