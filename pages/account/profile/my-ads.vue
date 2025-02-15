<script setup>
definePageMeta({
  middleware: ["auth"]
});

import exampleImage from '~/assets/car.jpg'
import { 
  PhMapPin, 
  PhClock, 
  PhPencilSimple, 
  PhTrash 
} from '@phosphor-icons/vue';

const router = useRouter();
const { fetchUserAds, deleteAd } = useServices();

// State
const isLoading = ref(true);
const error = ref(null);
const ads = ref([]);

// Fetch user ads data
const fetchAdsData = async () => {
  isLoading.value = true;
  try {
    const token = localStorage.getItem("session-token");
    if (!token) {
      router.push("/");
      return;
    }

    const { data, error: apiError } = await fetchUserAds();
    
    if (apiError) {
      throw new Error("فشل في تحميل الإعلانات");
    }

    // console.log('Ads Data Response:', data); // للتأكد من البيانات
    ads.value = data || [];

  } catch (err) {
    console.error("خطأ في تحميل البيانات:", err);
    error.value = err;
  } finally {
    isLoading.value = false;
  }
};

// استخدام watchEffect لمراقبة التغييرات والتحميل الأولي
watchEffect(() => {
  if (process.client) {
    fetchAdsData();
  }
});

// إعادة تحميل البيانات عند التحميل الأولي
onMounted(() => {
  if (process.client) {
    fetchAdsData();
  }
});

const handleDelete = async (adId) => {
  if (confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
    try {
      const { error } = await deleteAd(adId);
      if (error) throw error;
      // تحديث القائمة بعد الحذف
      await fetchAdsData();
    } catch (error) {
      console.error('Error deleting ad:', error);
    }
  }
};
</script>

<template>
  <div class="bg-gray-100 min-h-screen py-8" dir="rtl">
    <div class="container mx-auto px-4">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">إعلاناتي</h1>
            <p class="text-gray-600 mt-1">إدارة وعرض جميع إعلاناتك</p>
          </div>
          <NuxtLink 
            to="/create-ad"
            class="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Icon name="ph:plus-bold" class="w-5 h-5" />
            إضافة إعلان جديد
          </NuxtLink>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-8 text-red-600">
          {{ error.message }}
        </div>

        <!-- Empty State -->
        <div 
          v-else-if="!ads.length" 
          class="bg-white rounded-xl shadow-sm p-8 text-center"
        >
          <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="ph:newspaper" class="w-10 h-10 text-gray-400" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">لا توجد إعلانات</h3>
          <p class="text-gray-500 mb-6 max-w-md mx-auto">
            لم تقم بنشر أي إعلانات بعد. ابدأ بإضافة إعلانك الأول وأصل إلى آلاف المشترين المحتملين.
          </p>
          <NuxtLink 
            to="/create-ad"
            class="inline-flex items-center text-green-600 hover:text-green-700 font-medium gap-1"
          >
            <Icon name="ph:plus-circle" class="w-5 h-5" />
            نشر إعلان جديد
          </NuxtLink>
        </div>

        <!-- Ads Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="ad in ads" 
            :key="ad._id"
            class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow relative"
          >
            <!-- Make the entire card clickable except for the actions -->
            <NuxtLink 
              :to="`/products/${ad._id}`"
              class="block"
            >
              <!-- Ad Image/Gallery -->
              <div class="aspect-w-16 aspect-h-9 bg-gray-100">
                <img 
                  v-if="ad.gallery?.length"
                  :src="ad.gallery.length > 0 ? ad.gallery[0] : exampleImage"
                  :alt="ad.advTitle"
                  class="w-full h-[200px] object-fit"
                />
                <img 
                  v-else
                  :src="exampleImage"
                  :alt="ad.advTitle"
                  class="w-full h-full object-cover"
                />
              </div>

              <!-- Ad Content -->
              <div class="p-5">
                <!-- Title & Price -->
                <div class="flex justify-between items-start gap-4 mb-3">
                  <h3 class="font-semibold text-gray-900 flex-1">{{ ad.advTitle }}</h3>
                  <span class="text-green-600 font-bold whitespace-nowrap">
                    {{ ad.price }} ل.س
                  </span>
                </div>

                <!-- Description -->
                <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ ad.advDescription }}</p>

                <!-- Location -->
                <div class="flex items-center text-sm text-gray-500 mb-2">
                  <PhMapPin class="w-4 h-4 ml-1.5 flex-shrink-0" />
                  <span class="truncate">{{ ad.location.city }}, {{ ad.location.region }}</span>
                </div>

                <!-- Date -->
                <div class="flex items-center text-sm text-gray-500 mb-4">
                  <PhClock class="w-4 h-4 ml-1.5 flex-shrink-0" />
                  <span>{{ new Date(ad.createdAt).toLocaleDateString('ar-SY') }}</span>
                </div>
              </div>
            </NuxtLink>

            <!-- Actions - Outside of the NuxtLink to prevent navigation when clicking buttons -->
            <div class="flex items-center justify-between p-5 border-t border-gray-100">
              <NuxtLink 
                :to="`/products/edit/${ad._id}`"
                class="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                <PhPencilSimple class="w-4 h-4 ml-1" />
                تعديل
              </NuxtLink>
              <button 
                @click="handleDelete(ad._id)"
                class="flex items-center text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
              >
                <PhTrash class="w-4 h-4 ml-1" />
                حذف
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 