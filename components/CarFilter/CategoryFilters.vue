<template>
  <div class="bg-gray-50 border-b border-gray-100 sticky lg:top-[135px] md:top-[127px] top-[110px] z-40">
    <div class="container mx-auto px-4">
      <div class="overflow-x-auto" dir="rtl">
        <div class="flex space-x-reverse space-x-1 py-2 min-w-max">
          <button
            @click="$emit('category-change', { _id: 'all', name: 'كل التصنيفات' })"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
              'all' === activeCategory
                ? 'bg-green-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            ]"
          >
            كل التصنيفات
          </button>

          <button
            v-for="category in categoriesData"
            :key="category._id"
            @click="$emit('category-change', category)"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
              category._id === activeCategory
                ? 'bg-green-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            ]"
          >
            {{ category.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: categories } = await useFetch(
  'https://pzsyria.com/api/category/all'
);

// console.log(categories);

const categoriesData = categories?._value?.categories;

const props = defineProps({
  activeCategory: {
    type: String,
    required: true
  }
});

// console.log(props.activeCategory);

defineEmits(['category-change']);
</script>