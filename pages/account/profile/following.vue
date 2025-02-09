<script setup>
definePageMeta({
  layout: 'default',
  middleware: ["auth"]
})

const loading = ref(true)
const following = ref([])
const error = ref(null)

const { getFollowing, unfollowUser } = useServices()

const fetchFollowing = async () => {
  loading.value = true
  try {
    const { data, error: apiError } = await getFollowing()
    if (apiError) throw apiError
    
    following.value = data?.following || []
    console.log('Following data:', following.value)
  } catch (err) {
    error.value = 'فشل في تحميل قائمة المتابَعين'
    console.error('Error fetching following:', err)
  } finally {
    loading.value = false
  }
}

const handleUnfollow = async (userId) => {
  try {
    const { error: apiError } = await unfollowUser(userId)
    if (apiError) throw apiError
    await fetchFollowing()
  } catch (err) {
    console.error('Error unfollowing user:', err)
  }
}

onMounted(() => {
  fetchFollowing()
})
</script>

<template>
  <div class="bg-gray-100 min-h-screen py-8" dir="rtl">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold">الأشخاص الذين تتابعهم</h1>
          <NuxtLink to="/account/profile" class="text-gray-600 hover:text-gray-800">
            <Icon name="ph:arrow-right" class="w-6 h-6" />
          </NuxtLink>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          جاري التحميل...
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-8 text-red-600">
          {{ error }}
        </div>

        <!-- Following List -->
        <div v-else class="space-y-4">
          <div 
            v-for="user in following" 
            :key="user._id"
            class="bg-white rounded-lg shadow-sm p-4"
          >
            <div class="flex items-center justify-between">
              <!-- User Info -->
              <div class="flex items-center gap-4">
                <img 
                  :src="user.avatar || 'https://via.placeholder.com/40'"
                  class="w-12 h-12 rounded-full object-cover"
                  :alt="user.name"
                />
                <div>
                  <h3 class="font-medium">{{ user.name }}</h3>
                  <p class="text-sm text-gray-500">{{ user.location }}</p>
                </div>
              </div>

              <!-- Unfollow Button -->
              <button 
                @click="handleUnfollow(user._id)"
                class="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                إلغاء المتابعة
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 