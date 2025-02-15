<template>
  <div class="sticky top-[80px] lg:top-[70px] z-10 bg-white">
    <!-- Main Categories -->
    <div class="bg-gray-50 border-b border-gray-100">
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

    <!-- Subcategories with New Design -->
    <div v-if="activeSubcategories.length" class="bg-white border-b border-gray-100">
      <div class="container mx-auto px-4">
        <div class="overflow-x-auto scrollbar-hide" dir="rtl">
          <div class="flex space-x-reverse space-x-6 py-3 min-w-max">
            <button
              v-for="subcategory in activeSubcategories"
              :key="subcategory._id"
              @click="handleSubcategoryClick(subcategory)"
              class="group whitespace-nowrap px-2"
            >
              <span 
                class="text-sm transition-colors"
                :class="[
                  subcategory._id === activeSubcategory
                    ? 'text-green-600 font-semibold'
                    : 'text-gray-700 hover:text-green-600'
                ]"
              >
                {{ subcategory.name }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

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

const subcategoriesData = ref(null)

// تحديث دالة جلب البيانات
const fetchSubCategories = async () => {
  try {
    if (props.activeCategory !== 'all') {
      const response = await fetch(`https://pzsyria.com/api/subCategory/${props.activeCategory}/subCategories`)
      const data = await response.json()
      subcategoriesData.value = data
    } else {
      subcategoriesData.value = null
    }
  } catch (error) {
    console.error('Error fetching subcategories:', error)
    subcategoriesData.value = null
  }
}

// تنفيذ الدالة عند تحميل المكون
onMounted(() => {
  if (props.activeCategory !== 'all') {
    fetchSubCategories()
  }
})

// مراقبة التغييرات في التصنيف النشط
watch(() => props.activeCategory, () => {
  if (props.activeCategory !== 'all') {
    fetchSubCategories()
  } else {
    subcategoriesData.value = null
  }
})

// الحصول على التصنيفات الفرعية للتصنيف النشط
const activeSubcategories = computed(() => {
  if (!subcategoriesData.value?.subCategories) return []
  return subcategoriesData.value.subCategories
})

const handleCategoryClick = (category) => {
  emit('update:category', category._id)
  emit('update:subcategory', '') // إعادة تعيين التصنيف الفرعي عند تغيير التصنيف
}

const handleSubcategoryClick = (subcategory) => {
  emit('update:subcategory', subcategory._id)
}

// دالة للحصول على الأحرف الأولى
const getSubcategoryInitials = (name) => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
};

// دالة لتوليد لون ثابت لكل قسم فرعي
const getSubcategoryColor = (name) => {
  const colors = [
    '#2563eb', // أزرق
    '#059669', // أخضر
    '#dc2626', // أحمر
    '#7c3aed', // بنفسجي
    '#ea580c', // برتقالي
    '#0891b2', // سماوي
    '#be185d', // وردي
    '#854d0e', // بني
    '#475569', // رمادي
    '#111827'  // أسود
  ];
  
  const index = name.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0) % colors.length;
  
  return colors[index];
};
</script>

<style scoped>
.sticky {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* تخصيص شريط التمرير */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;     /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}

/* تأثير التحويم */
.group:hover span {
  color: #059669;
}

/* تأثير النقر */
.group:active {
  transform: scale(0.98);
}

/* تحسين التأثير البصري عند التمرير */
.sticky::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.05), transparent);
}

/* تنسيق المسافات */
.space-x-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
  margin-right: calc(1.5rem * var(--tw-space-x-reverse));
  margin-left: calc(1.5rem * calc(1 - var(--tw-space-x-reverse)));
}
</style>
