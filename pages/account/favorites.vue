<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { useServices } from '~/composables/useServices';
import { 
  PhArrowRight,
  PhHeart,
  PhSpinner
} from "@phosphor-icons/vue";

const route = useRoute();
const { getFavoriteAds, toggleFavorite } = useServices();
const favoriteAds = ref([]);
const isLoading = ref(true);
const error = ref(null);

// Fetch user's favorite ads
const fetchFavoriteAds = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    
    const { data, error: apiError } = await getFavoriteAds();
    
    if (apiError) throw apiError;
    favoriteAds.value = data;
  } catch (err) {
    console.error('Error fetching favorites:', err);
    error.value = err.message || 'حدث خطأ في تحميل المفضلة';
  } finally {
    isLoading.value = false;
  }
};

// Handle favorite toggle
const handleToggleFavorite = async (productId) => {
  try {
    const { error: toggleError } = await toggleFavorite(productId);
    if (toggleError) throw toggleError;
    // Refresh favorites list
    await fetchFavoriteAds();
  } catch (err) {
    console.error('Error toggling favorite:', err);
    showNotification('حدث خطأ أثناء تحديث المفضلة', 'error');
  }
};

// Watch for route changes and authentication status
watchEffect(() => {
  if (process.client) {
    const token = localStorage.getItem('session-token');
    if (token && route.path === '/account/favorites') {
      fetchFavoriteAds();
    }
  }
});

// Initial load
onMounted(() => {
  if (process.client) {
    fetchFavoriteAds();
  }
});

// Watch for custom events
onMounted(() => {
  if (process.client) {
    // Refresh data when favorites are updated
    window.addEventListener('favorites-updated', fetchFavoriteAds);
  }
});

onBeforeUnmount(() => {
  if (process.client) {
    window.removeEventListener('favorites-updated', fetchFavoriteAds);
  }
});
</script>

<template>
  <div class="bg-gray-100 min-h-screen" dir="rtl">
    <!-- رأس الصفحة مع العنوان -->
    <div class="bg-white p-4 border-b">
      <div class="flex items-center justify-between max-w-4xl mx-auto">
        <button
          @click="$router.back()"
          class="text-gray-600 hover:text-gray-800"
        >
          <PhArrowRight class="w-6 h-6" />
        </button>
        <h1 class="text-xl font-bold">المفضلة</h1>
        <div class="w-6"></div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-8">
        <PhSpinner 
          class="w-12 h-12 mx-auto text-green-500 animate-spin" 
        />
        <p class="mt-4 text-gray-600">جاري التحميل...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-8">
        <div class="bg-red-50 p-4 rounded-lg">
          <p class="text-red-600">{{ error }}</p>
          <button 
            @click="fetchFavoriteAds" 
            class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>

      <!-- Content -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ProductCard 
          v-for="ad in favoriteAds" 
          :key="ad._id" 
          :product="ad"
          @toggle-favorite="handleToggleFavorite"
        />
        <div 
          v-if="!favoriteAds.length" 
          class="col-span-full text-center py-12 bg-white rounded-lg shadow"
        >
          <PhHeart 
            class="w-16 h-16 text-gray-400 mx-auto mb-4" 
            :weight="'light'"
          />
          <p class="text-gray-500">لا توجد إعلانات مفضلة</p>
          <NuxtLink 
            to="/" 
            class="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            تصفح الإعلانات
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template> 