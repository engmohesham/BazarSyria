<template>
  <NuxtLink 
    :to="`/products/${product._id}`" 
    class="block"
    @click="$emit('click')"
  >
    <div
      class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      <div class="flex flex-col md:flex-row">
        <div class="md:w-1/3 relative">
          <img
            :src="product.gallery?.[0] || 'https://via.placeholder.com/300'"
            :alt="product.advTitle"
            class="w-full h-48 md:h-full object-cover"
          />
          <button
            v-if="isUserLoggedIn"
            @click.prevent="handleFavoriteClick"
            class="absolute top-3 right-3 p-2 flex justify-center items-center rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
            :class="{ 'text-red-500': isInFavorites }"
          >
            <PhHeart 
              class="w-5 h-5" 
              :weight="isInFavorites ? 'fill' : 'regular'"
              :class="isInFavorites ? 'text-red-500' : 'text-gray-600'"
            />
          </button>
        </div>
        <div class="md:w-2/3 p-4">
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-2xl font-bold text-green-600">
              {{ product.price }} ل.س
            </h3>
            <div class="flex gap-2">
              <button
                @click.prevent="handleReport"
                class="px-3 py-1.5 text-xs font-medium bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
              >
                ابلاغ
              </button>
            </div>
          </div>
          <h4 class="text-xl font-semibold mb-3">{{ product.advTitle }}</h4>
          <div class="space-y-3 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <span class="font-medium">{{ product.advDescription }}</span>
            </div>
            <div class="flex items-center gap-2">
              <PhMapPin class="w-4 h-4" />
              <span>{{ formatLocation(product.location) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <PhClock class="w-4 h-4" />
                <span>{{ formatDate(product.createdAt) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <PhUser class="w-4 h-4" />
                <span>عضو {{ product.creator.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { 
  PhHeart,
  PhMapPin,
  PhClock,
  PhUser
} from '@phosphor-icons/vue';
import { useServices } from '~/composables/useServices';

const { addToFavorites, removeFromFavorites, getFavoriteAds } = useServices();

// تحديث دالة showNotification
const showNotification = (message, type = 'success') => {
  const notificationEvent = new CustomEvent('show-notification', {
    detail: {
      message,
      type // 'success' or 'error'
    }
  });
  window.dispatchEvent(notificationEvent);
};

// التحقق من حالة تسجيل الدخول
const isUserLoggedIn = computed(() => {
  return !!localStorage.getItem('session-token');
});

const props = defineProps({
  product: {
    type: Object,
    required: true,
    default: () => ({
      _id: '',
      advTitle: '',
      advDescription: '',
      category: '',
      contact: 'chat',
      createdAt: '',
      creator: '',
      gallery: [],
      location: {
        lat: '',
        long: ''
      },
      modifiedAt: '',
      price: 0,
      specialProperties: [],
      subCategory: '',
      __v: 0
    })
  }
});

// قائمة الإعلانات المفضلة
const favoriteAdsIds = ref(new Set());
const isInFavorites = computed(() => {
  return favoriteAdsIds.value.has(props.product._id);
});

// جلب قائمة الإعلانات المفضلة
const fetchFavoriteAds = async () => {
  if (!isUserLoggedIn.value) return;
  
  try {
    const { data, error } = await getFavoriteAds();
    if (!error && data) {
      favoriteAdsIds.value = new Set(data.map(ad => ad._id));
    }
  } catch (err) {
    console.error('Error fetching favorite ads:', err);
    showNotification('حدث خطأ في تحميل المفضلة', 'error');
  }
};

onMounted(() => {
  if (isUserLoggedIn.value) {
    fetchFavoriteAds();
  }
});

// استخدام الإشعارات في handleFavoriteClick
const handleFavoriteClick = async (event) => {
  event.preventDefault();
  
  if (!isUserLoggedIn.value) {
    window.dispatchEvent(new CustomEvent('open-login-modal'));
    return;
  }

  try {
    const { error } = isInFavorites.value
      ? await removeFromFavorites(props.product._id)
      : await addToFavorites(props.product._id);

    if (error) {
      throw error;
    }

    if (isInFavorites.value) {
      favoriteAdsIds.value.delete(props.product._id);
      showNotification('تم الإزالة من المفضلة بنجاح');
    } else {
      favoriteAdsIds.value.add(props.product._id);
      showNotification('تمت الإضافة إلى المفضلة بنجاح');
    }

  } catch (err) {
    console.error('Error toggling favorite:', err);
    showNotification('حدث خطأ في تحديث المفضلة', 'error');
  }
};

// تنسيق التاريخ
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("ar-SA");
};

// تنسيق الموقع
const formatLocation = (location) => {
  if (!location) return '';
  return `${location.lat}, ${location.long}`;
};

// استخدام الإشعارات في handleReport
const handleReport = async (event) => {
  event.preventDefault();
  
  if (!isUserLoggedIn.value) {
    window.dispatchEvent(new CustomEvent('open-login-modal'));
    return;
  }

  try {
    showNotification('تم إرسال البلاغ بنجاح', 'success');
  } catch (err) {
    console.error('Error reporting ad:', err);
    showNotification('حدث خطأ في إرسال البلاغ', 'error');
  }
};

// إضافة emit للنقر
defineEmits(['click']);
</script>

<style scoped>
/* تأثيرات انتقالية سلسة */
.transition-colors {
  transition: all 0.2s ease-in-out;
}

/* تأثير النقر على زر المفضلة */
button:active {
  transform: scale(0.95);
}
</style>
