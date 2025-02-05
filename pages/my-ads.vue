<script setup>
const activeTab = ref('active') // active, inactive, pending
const ads = ref([])
const loading = ref(true)

const { fetchUserAds, deleteAd, toggleAdStatus } = useAds()

// Fetch ads from API
const fetchAds = async () => {
  loading.value = true
  try {
    const { data, error } = await fetchUserAds()
    if (error) throw error
    ads.value = data
    
  } catch (error) {
    console.error('Error fetching ads:', error)
    // يمكنك إضافة إشعار خطأ هنا
  } finally {
    loading.value = false
  }
}

// Handle ad actions
const handleEdit = (adId) => {
  navigateTo(`/edit-ad/${adId}`)
}

const handleDelete = async (adId) => {
  if (confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
    try {
      const { error } = await deleteAd(adId)
      if (error) throw error
      await fetchAds()
      // يمكنك إضافة إشعار نجاح هنا
    } catch (error) {
      console.error('Error deleting ad:', error)
      // يمكنك إضافة إشعار خطأ هنا
    }
  }
}

const handleToggleStatus = async (adId) => {
  try {
    const { error } = await toggleAdStatus(adId)
    if (error) throw error
    await fetchAds()
    // يمكنك إضافة إشعار نجاح هنا
  } catch (error) {
    console.error('Error toggling ad status:', error)
    // يمكنك إضافة إشعار خطأ هنا
  }
}

// Filter ads based on active tab
const filteredAds = computed(() => {
  return ads.value.filter(ad => {
    if (activeTab.value === 'active') return ad.status === 'active'
    if (activeTab.value === 'inactive') return ad.status === 'inactive'
    if (activeTab.value === 'pending') return ad.status === 'pending'
    return true
  })
})

// Get counts for tabs
const adCounts = computed(() => ({
  active: ads.value.filter(ad => ad.status === 'active').length,
  inactive: ads.value.filter(ad => ad.status === 'inactive').length,
  pending: ads.value.filter(ad => ad.status === 'pending').length
}))

onMounted(() => {
  fetchAds()
})
</script>

<template>
  <div class="bg-gray-100 min-h-screen py-8" dir="rtl">
    <div class="container mx-auto px-4">
      <div class="max-w-5xl mx-auto">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">إدارة إعلاناتك</h1>
          <NuxtLink 
            to="/create-ad"
            class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            إضافة إعلان جديد
          </NuxtLink>
        </div>

        <!-- Tabs -->
        <div class="bg-white rounded-lg shadow-sm mb-6">
          <div class="flex border-b">
            <button 
              @click="activeTab = 'active'"
              :class="[
                'px-6 py-3 text-sm font-medium',
                activeTab === 'active' 
                  ? 'border-b-2 border-green-500 text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              الإعلانات النشطة ({{ adCounts.active }})
            </button>
            <button 
              @click="activeTab = 'inactive'"
              :class="[
                'px-6 py-3 text-sm font-medium',
                activeTab === 'inactive' 
                  ? 'border-b-2 border-green-500 text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              الإعلانات غير النشطة ({{ adCounts.inactive }})
            </button>
            <button 
              @click="activeTab = 'pending'"
              :class="[
                'px-6 py-3 text-sm font-medium',
                activeTab === 'pending' 
                  ? 'border-b-2 border-green-500 text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              قيد التنفيذ ({{ adCounts.pending }})
            </button>
          </div>
        </div>

        <!-- Ads List -->
        <div v-if="loading" class="text-center py-8">
          جاري التحميل...
        </div>
        <div v-else class="space-y-4">
          <div 
            v-for="ad in filteredAds" 
            :key="ad._id"
            class="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div class="flex">
              <!-- Ad Image -->
              <div class="w-48 h-32">
                <img 
                  :src="ad.image" 
                  :alt="ad.title"
                  class="w-full h-full object-cover"
                />
              </div>

              <!-- Ad Details -->
              <div class="flex-1 p-4">
                <div class="flex justify-between">
                  <h3 class="font-medium">{{ ad.title }}</h3>
                  <span class="text-green-600 font-medium">{{ ad.price }} ل.س</span>
                </div>
                <div class="mt-2 flex items-center text-sm text-gray-500">
                  <Icon name="ph:map-pin" class="w-4 h-4 ml-1" />
                  {{ ad.location }}
                </div>
                <div class="mt-2 flex items-center text-sm text-gray-500">
                  <Icon name="ph:clock" class="w-4 h-4 ml-1" />
                  {{ ad.createdAt }}
                </div>
              </div>

              <!-- Actions -->
              <div class="w-48 p-4 border-r flex flex-col justify-between">
                <div class="flex justify-end">
                  <span 
                    :class="[
                      'px-2 py-1 rounded-full text-xs',
                      ad.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ ad.status === 'active' ? 'نشط' : 'غير نشط' }}
                  </span>
                </div>
                <div class="space-y-2">
                  <button 
                    @click="handleEdit(ad._id)"
                    class="w-full flex items-center justify-center gap-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    <Icon name="ph:pencil" class="w-4 h-4" />
                    تعديل
                  </button>
                  <button 
                    @click="handleDelete(ad._id)"
                    class="w-full flex items-center justify-center gap-1 text-sm text-red-600 hover:text-red-800"
                  >
                    <Icon name="ph:trash" class="w-4 h-4" />
                    حذف
                  </button>
                  <button 
                    @click="handleToggleStatus(ad._id)"
                    class="w-full flex items-center justify-center gap-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    <Icon name="ph:power" class="w-4 h-4" />
                    {{ ad.status === 'active' ? 'إيقاف' : 'تفعيل' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 