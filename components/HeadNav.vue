<template>
  <div class="bg-white border-b">
    <div class="container w-[90%] mx-auto px-4 py-4">
      <div class="flex items-center gap-2 text-sm text-gray-500">
        <NuxtLink to="/" class="hover:text-green-600">
          الرئيسية
        </NuxtLink>
        
        <span class="text-gray-400">/</span>
        
        <!-- القسم الرئيسي -->
        <template v-if="mainNav">
          <!-- <NuxtLink 
            :to="`/categories/${mainNav}`"
            class="hover:text-green-600"
          >
            {{ categoryName }}
          </NuxtLink> -->
          <button 
            class="hover:text-green-600 cursor-default"
          >
            {{ categoryName }}
          </button>
        </template>
        
        <!-- القسم الفرعي -->
        <template v-if="subNav">
          <span class="text-gray-400">/</span>
          <!-- <NuxtLink 
            :to="`/categories/${mainNav}/${subNav}`"
            class="hover:text-green-600"
          >
            {{ subCategoryName }}
          </NuxtLink> -->
          <button 
            class="hover:text-green-600 cursor-default"
          >
            {{ subCategoryName }}
          </button>
        </template>
        
        <!-- الصفحة الحالية -->
        <template v-if="current">
          <span class="text-gray-400">/</span>
          <span class="text-gray-900">{{ current }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
const { getCategoryById, getSubCategoryById } = useServices();

const props = defineProps({
  mainNav: {
    type: String,
    default: ''
  },
  subNav: {
    type: String,
    default: ''
  },
  current: {
    type: String,
    default: ''
  }
});

// State
const categoryName = ref('');
const subCategoryName = ref('');

// Fetch category name
const fetchCategoryName = async () => {
  if (!props.mainNav) return;
  
  try {
    const { data, error } = await getCategoryById(props.mainNav);
    if (error) throw error;
    
    if (data && data.category) {
      categoryName.value = data.category.name;
    }
  } catch (err) {
    console.error('Error fetching category:', err);
  }
};

// Fetch subcategory name
const fetchSubCategoryName = async () => {
  if (!props.subNav) return;
  
  try {
    const { data, error } = await getSubCategoryById(props.subNav);
    if (error) throw error;
    
    if (data && data.subCategory) {
      subCategoryName.value = data.subCategory.name;
    }
  } catch (err) {
    console.error('Error fetching subcategory:', err);
  }
};

// جلب البيانات عند التحميل
onMounted(() => {
  if (process.client) {
    fetchCategoryName();
    fetchSubCategoryName();
  }
});

// مراقبة التغييرات في الـ props
watch(() => props.mainNav, () => {
  if (process.client) {
    fetchCategoryName();
  }
}, { immediate: true });

watch(() => props.subNav, () => {
  if (process.client) {
    fetchSubCategoryName();
  }
}, { immediate: true });
</script>
