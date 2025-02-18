<template>
  <div class="bg-gray-100" dir="rtl">
    <div v-if="isLoading" class="container w-[90%] mx-auto px-4 py-6">
      جاري التحميل...
    </div>
    
    <div v-else-if="error" class="container w-[90%] mx-auto px-4 py-6 text-red-500">
      حدث خطأ في تحميل البيانات
    </div>
    
    <div v-else-if="productData" class="container w-[90%] mx-auto px-4 py-6">
      <HeadNav
        :mainNav="productData.categoryId"
        :subNav="productData.subCategoryId"
        :current="productData.name"
      />
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Main Content (Not Blurred) -->
        <div class="md:col-span-2">
          <div
            v-if="productData"
            class="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <!-- Product content remains visible -->
            <ProductGallery
              :mainImage="productData.image"
              :gallery="productData.gallery"
              :title="productData.name"
            />
            <ProductHeader
              :title="productData.name"
              :price="productData.price"
              :location="productData.location"
              :timeAgo="productData.timeAgo"
              :adNumber="productData.advertisement?._id"
            />
            <!-- المواصفات البارزة -->
            <div 
              v-if="productData.advertisement?.specialProperties?.length" 
              class="border-t border-b py-6 m-6"
            >
              <h3 class="text-lg font-semibold mb-4">المواصفات البارزة</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                <div
                  v-for="spec in productData.advertisement.specialProperties"
                  :key="spec.property"
                  class="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm"
                >
                  <component 
                    :is="getIconComponent(spec.icon)" 
                    class="w-8 h-8 text-green-600 mb-2" 
                  />
                  <span class="text-sm text-gray-600 mb-1">{{ spec.property }}</span>
                  <span class="font-medium text-gray-900">{{ spec.value }}</span>
                </div>
              </div>
            </div>

            <!-- Debug section -->
            <div v-if="!productData.advertisement?.specialProperties?.length" class="m-6 text-red-500">
              No special properties available
            </div>

            <!-- التفاصيل -->
            <div class="m-6 bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-lg font-semibold mb-4">التفاصيل</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Special Properties -->
                <!-- <div 
                  v-for="prop in productData.advertisement?.specialProperties" 
                  :key="prop.property"
                  class="flex justify-between py-2 border-b"
                >
                  <span class="text-gray-600">{{ prop.property }}</span>
                  <span class="font-medium">{{ prop.value }}</span>
                </div> -->

                <!-- Basic Advertisement Details -->
                <!-- <div class="flex justify-between py-2 border-b">
                  <span class="text-gray-600">رقم الإعلان</span>
                  <span class="font-medium">{{ productData.advertisement?._id }}</span>
                </div> -->

                <div class="flex justify-between py-2 border-b">
                  <span class="text-gray-600">تاريخ النشر</span>
                  <span class="font-medium">{{ formatDate(productData.advertisement?.createdAt) }}</span>
                </div>

                <div class="flex justify-between py-2 border-b">
                  <span class="text-gray-600">آخر تحديث</span>
                  <span class="font-medium">{{ formatDate(productData.advertisement?.modifiedAt) }}</span>
                </div>

                <div class="flex justify-between py-2 border-b">
                  <span class="text-gray-600">السعر</span>
                  <span class="font-medium">{{ productData.advertisement?.price }} ل.س</span>
                </div>

                <div class="flex justify-between py-2 border-b">
                  <span class="text-gray-600">الفئة</span>
                  <span class="font-medium">{{ getCategoryName(productData.advertisement?.category) }}</span>
                </div>

                <div class="flex justify-between py-2 border-b">
                  <span class="text-gray-600">الفئة الفرعية</span>
                  <span class="font-medium">{{ getSubCategoryName(productData.advertisement?.subCategory) }}</span>
                </div>

                <div class="flex justify-between py-2 border-b">
                  <span class="text-gray-600">الوصف</span>
                  <span class="font-medium">{{ productData.advertisement?.advDescription }}</span>
                </div>

                <!-- Location Details -->
                <div class="col-span-full">
                  <div class="flex justify-between py-2 border-b">
                    <span class="text-gray-600">العنوان التفصيلي</span>
                    <span class="font-medium">{{ productData.advertisement?.location?.addressDetails }}</span>
                  </div>
                  <div class="flex justify-between py-2 border-b">
                    <span class="text-gray-600">المدينة</span>
                    <span class="font-medium">{{ productData.advertisement?.location?.city }}</span>
                  </div>
                  <div class="flex justify-between py-2 border-b">
                    <span class="text-gray-600">المنطقة</span>
                    <span class="font-medium">{{ productData.advertisement?.location?.region }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- User Profile Section with Blur -->
        <div class="md:col-span-1">
          <div class="sticky top-[127px]">
            <!-- Blur Overlay for User Section -->
            <div 
              v-if="!userId" 
              class="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-lg"
            >
              <div class="text-center p-6">
                <h3 class="text-lg font-bold text-gray-800 mb-3">
                  معلومات البائع
                </h3>
                <p class="text-gray-600 mb-4">
                  سجل دخول للتواصل مع البائع
                </p>
                <div class="flex gap-3 justify-center">
                  <button
                    @click="handleLoginClick"
                    class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    تسجيل الدخول
                  </button>
                  <button
                    @click="handleRegisterClick"
                    class="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors text-sm"
                  >
                    إنشاء حساب
                  </button>
                </div>
              </div>
            </div>

            <!-- User Profile Component -->
            <div :class="{ 'filter blur-sm': !userId }">
              <UserProfile 
                v-if="productData.advertisement?.creator"
                :creatorId="productData.advertisement.creator"
                :advertisementData="productData.advertisement"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="container w-[90%] mx-auto px-4 py-6">
      لم يتم العثور على الإعلان
    </div>
  </div>
</template>

<script setup>
import UserProfile from "@/components/SingleProduct/UserProfile.vue";
import ProductGallery from "@/components/SingleProduct/ProductGallery.vue";
import ProductHeader from "@/components/SingleProduct/ProductHeader.vue";
import ProductSpecifications from "@/components/SingleProduct/ProductSpecifications.vue";
import ContactButtons from "@/components/SingleProduct/ContactButtons.vue";
import { useRoute } from 'vue-router'
import * as PhosphorIcons from '@phosphor-icons/vue';
import { ref, computed, onMounted, watchEffect } from 'vue';

const route = useRoute();
const { getAdById, getCategories, getSubCategories } = useServices();

// State
const adData = ref(null);
const categories = ref([]);
const subCategories = ref([]);
const isLoading = ref(true);
const error = ref(null);

// تأكد من أن localStorage متاح فقط في جانب العميل
const userId = ref(null);

onMounted(() => {
  // التحقق من localStorage فقط بعد تحميل المكون
  userId.value = localStorage.getItem('userId');
});

// Fetch ad data
const fetchAdData = async () => {
  isLoading.value = true;
  try {
    const { data, error: apiError } = await getAdById(route.params.id);
    if (apiError) throw apiError;
    
    // console.log('Ad Data Response:', data); // للتأكد من البيانات
    adData.value = data;
    
    // Fetch categories and subcategories if we have the ad data
    if (data?.advertisement?.category) {
      await fetchCategories();
      await fetchSubCategories(data.advertisement.category);
    }
  } catch (err) {
    console.error('Error fetching ad:', err);
    error.value = err;
  } finally {
    isLoading.value = false;
  }
};

// Fetch categories
const fetchCategories = async () => {
  try {
    const { data, error: apiError } = await getCategories();
    if (apiError) throw apiError;
    categories.value = data || [];
  } catch (err) {
    console.error('Error fetching categories:', err);
  }
};

// Fetch subcategories
const fetchSubCategories = async (categoryId) => {
  if (!categoryId) return;
  try {
    const { data, error: apiError } = await getSubCategories(categoryId);
    if (apiError) throw apiError;
    subCategories.value = data || [];
  } catch (err) {
    console.error('Error fetching subcategories:', err);
  }
};

// Transform API data into component format with null checks
const productData = computed(() => {
  if (!adData.value?.advertisement) return null;
  
  const ad = adData.value.advertisement;
  return {
    name: ad.advTitle || '',
    price: ad.price || 0,
    location: ad.location || {},
    timeAgo: ad.createdAt ? new Date(ad.createdAt).toLocaleDateString('ar-SY') : '',
    description: ad.advDescription || '',
    image: ad.gallery?.[0] || '',
    gallery: ad.gallery || [],
    categoryId: ad.category || null,
    subCategoryId: ad.subCategory || null,
    advertisement: ad,
    creator: ad.creator
  };
});

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('ar-SY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Helper function to get category name
const getCategoryName = (categoryId) => {
  const category = categories.value.find(cat => cat._id === categoryId);
  return category?.name || categoryId;
};

// Helper function to get subcategory name
const getSubCategoryName = (subCategoryId) => {
  const subCategory = subCategories.value.find(subCat => subCat._id === subCategoryId);
  return subCategory?.name || subCategoryId;
};

// Watch for advertisement data changes to fetch subcategories
watch(() => adData.value?.advertisement?.category, async (newCategoryId) => {
  if (newCategoryId) {
    await fetchSubCategories(newCategoryId);
  }
}, { immediate: true });

// استخدام watchEffect لمراقبة route.params.id
watchEffect(() => {
  if (route.params.id) {
    fetchAdData();
  }
});

// إعادة تحميل البيانات عند التحميل الأولي
onMounted(() => {
  if (route.params.id) {
    fetchAdData();
  }
});

// إضافة emit events
const emit = defineEmits(['open-login', 'open-register']);

// تحديث أزرار تسجيل الدخول
const handleLoginClick = () => {
  window.dispatchEvent(new CustomEvent('open-login-modal'));
};

const handleRegisterClick = () => {
  window.dispatchEvent(new CustomEvent('open-register-modal'));
};

// Update the getIconComponent function to be more dynamic
const getIconComponent = (iconName) => {
  // Add null/undefined check
  if (!iconName) {
    console.warn('No icon name provided, using default PhSealQuestion ');
    return PhosphorIcons.PhSealQuestion;
  }

  // Ensure iconName is a string
  const formattedIconName = String(iconName).startsWith('Ph') 
    ? iconName 
    : `Ph${iconName}`;
  
  const icon = PhosphorIcons[formattedIconName];
  
  if (icon) {
    return icon;
  }
  
  console.warn(`Icon ${formattedIconName} not found, using default PhSealQuestion`);
  return PhosphorIcons.PhSealQuestion;
};
</script>

<style scoped>
/* تأثيرات انتقالية سلسة */
.backdrop-blur-sm {
  transition: all 0.3s ease-in-out;
}

/* تحسين مظهر الأزرار */
button {
  transition: all 0.2s ease-in-out;
}

button:active {
  transform: scale(0.98);
}

/* تحسين مظهر قسم المستخدم */
.user-section {
  position: relative;
  border-radius: 0.5rem;
  overflow: hidden;
}
</style>
