<template>
  <div>
    <!-- Main Categories -->
    <div class="bg-gray-50 border-b border-gray-100 sticky lg:top-[135px] md:top-[127px] top-[110px] z-40">
      <div class="container mx-auto px-4">
        <div class="overflow-x-auto" dir="rtl">
          <div class="flex space-x-reverse space-x-1 py-2 min-w-max">
            <button
              @click="handleCategoryClick({ _id: 'all', name: 'كل التصنيفات' })"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                activeCategory === 'all'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              ]"
            >
              كل التصنيفات
            </button>

            <button
              v-for="category in categories"
              :key="category._id"
              @click="handleCategoryClick(category)"
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

    <!-- Subcategories -->
    <div v-if="activeSubcategories.length" class="bg-white py-2">
      <div class="container mx-auto px-4">
        <div class="overflow-x-auto" dir="rtl">
          <div class="flex space-x-reverse space-x-1 py-2 min-w-max">
            <button
              v-for="subcategory in activeSubcategories"
              :key="subcategory._id"
              @click="handleSubcategoryClick(subcategory)"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                subcategory._id === activeSubcategory
                  ? 'bg-green-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              ]"
            >
              {{ subcategory.name }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  activeCategory: {
    type: String,
    default: 'all'
  },
  activeSubcategory: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:category', 'update:subcategory'])

// Fetch categories
const { data: categoriesData } = await useFetch('https://pzsyria.com/api/category/all')
const categories = computed(() => categoriesData.value?.categories || [])

// Fetch subcategories when active category changes
const { data: subcategoriesData } = await useFetch(
  computed(() => props.activeCategory === 'all' 
    ? null 
    : `https://pzsyria.com/api/subCategory/${props.activeCategory}/subcategories`
  ),
  { 
    watch: [props.activeCategory],
    immediate: false 
  }
)

// Get subcategories for active category
const activeSubcategories = computed(() => {
  if (props.activeCategory === 'all') return []
  return subcategoriesData.value?.subcategories || []
})

const handleCategoryClick = (category) => {
  emit('update:category', category._id)
  emit('update:subcategory', '') // Reset subcategory when changing category
}

const handleSubcategoryClick = (subcategory) => {
  emit('update:subcategory', subcategory._id)
}
</script>