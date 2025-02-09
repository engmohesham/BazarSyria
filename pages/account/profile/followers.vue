<script setup>
definePageMeta({
  layout: 'default',
  middleware: ["auth"]
})

const loading = ref(true)
const followers = ref([])
const error = ref(null)

const { getFollowers, followUser, unfollowUser } = useServices()

const fetchFollowers = async () => {
  loading.value = true
  try {
    const { data, error: apiError } = await getFollowers()
    if (apiError) throw apiError
    
    // تأكد من تنسيق البيانات الصحيح
    followers.value = data?.followers || []
    console.log('Followers data:', followers.value) // للتحقق من البيانات
  } catch (err) {
    error.value = 'فشل في تحميل قائمة المتابعين'
    console.error('Error fetching followers:', err)
  } finally {
    loading.value = false
  }
}

const handleFollow = async (userId) => {
  try {
    const { error: apiError } = await followUser(userId)
    if (apiError) throw apiError
    await fetchFollowers() // تحديث القائمة بعد المتابعة
  } catch (err) {
    console.error('Error following user:', err)
  }
}

const handleUnfollow = async (userId) => {
  try {
    const { error: apiError } = await unfollowUser(userId)
    if (apiError) throw apiError
    await fetchFollowers() // تحديث القائمة بعد إلغاء المتابعة
  } catch (err) {
    console.error('Error unfollowing user:', err)
  }
}

// جلب البيانات عند تحميل الصفحة
onMounted(() => {
  fetchFollowers()
})
</script>

<template>
  <div class="bg-gray-100 min-h-screen py-8" dir="rtl">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold">المتابعين</h1>
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

        <!-- Followers List -->
        <div v-else class="space-y-4">
          <div 
            v-for="follower in followers" 
            :key="follower._id"
            class="bg-white rounded-lg shadow-sm p-4"
          >
            <div class="flex items-center justify-between">
              <!-- User Info -->
              <div class="flex items-center gap-4">
                <img 
                  :src="follower.avatar || 'https://via.placeholder.com/40'"
                  class="w-12 h-12 rounded-full object-cover"
                  :alt="follower.name"
                />
                <div>
                  <h3 class="font-medium">{{ follower.name }}</h3>
                  <p class="text-sm text-gray-500">{{ follower.location }}</p>
                </div>
              </div>

              <!-- Follow/Unfollow Button -->
              <button 
                @click="follower.isFollowing ? handleUnfollow(follower._id) : handleFollow(follower._id)"
                class="px-4 py-2 rounded-lg text-sm font-medium"
                :class="follower.isFollowing ? 
                  'bg-gray-100 text-gray-700 hover:bg-gray-200' : 
                  'bg-green-600 text-white hover:bg-green-700'"
              >
                {{ follower.isFollowing ? 'إلغاء المتابعة' : 'متابعة' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 