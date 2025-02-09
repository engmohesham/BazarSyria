<script setup>
definePageMeta({
  middleware: ["auth"]
});

const ads = ref([])
const loading = ref(true)

const { fetchUserAds, deleteAd } = useServices()

// Fetch ads from API
const fetchAds = async () => {
  loading.value = true
  try {
    const { data, error } = await fetchUserAds()
    if (error) throw error
    ads.value = data || []
    console.log('Fetched ads:', ads.value)
  } catch (error) {
    console.error('Error fetching ads:', error)
  } finally {
    loading.value = false
  }
}

const handleDelete = async (adId) => {
  if (confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
    try {
      const { error } = await deleteAd(adId)
      if (error) throw error
      await fetchAds()
    } catch (error) {
      console.error('Error deleting ad:', error)
    }
  }
}

onMounted(() => {
  fetchAds()
})
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
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
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
            class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <!-- Ad Image/Gallery -->
            <div class="aspect-w-16 aspect-h-9 bg-gray-100">
              <img 
                v-if="ad.gallery?.length"
                :src="ad.gallery[0]"
                :alt="ad.advTitle"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <Icon name="ph:image" class="w-8 h-8 text-gray-400" />
              </div>
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
                <Icon name="ph:map-pin" class="w-4 h-4 ml-1.5 flex-shrink-0" />
                <span class="truncate">{{ ad.location.city }}, {{ ad.location.region }}</span>
              </div>

              <!-- Date -->
              <div class="flex items-center text-sm text-gray-500 mb-4">
                <Icon name="ph:clock" class="w-4 h-4 ml-1.5 flex-shrink-0" />
                <span>{{ new Date(ad.createdAt).toLocaleDateString('ar-SY') }}</span>
              </div>

              <!-- Actions -->
              <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                <NuxtLink 
                  :to="`/edit-ad/${ad._id}`"
                  class="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <Icon name="ph:pencil-simple" class="w-4 h-4 ml-1" />
                  تعديل
                </NuxtLink>
                <button 
                  @click="handleDelete(ad._id)"
                  class="flex items-center text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  <Icon name="ph:trash" class="w-4 h-4 ml-1" />
                  حذف
                </button>
              </div>
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