<script setup>
const router = useRouter()
const { getProfile, updateProfile } = useUser()
const userData = ref({
  ads: [],
  avatar: null,
  coverImage: '',
  createdAt: '',
  email: '',
  followers: [],
  following: [],
  joinDate: '',
  location: '',
  memberId: '',
  name: '',
  phone: '',
  ratings: [],
  type: '',
  verified: false
})

const loading = ref(true)
const error = ref('')

onMounted(async () => {
  const token = localStorage.getItem('session-token')
  if (!token) {
    router.push('/login')
    return
  }

  try {
    const { data, error: profileError } = await getProfile()

    if (profileError) {
      error.value = 'فشل في تحميل بيانات الملف الشخصي'
      return
    }

    console.log(data._value.user)

    // تحديث البيانات مع الحفاظ على الهيكل المطلوب
    userData.value = {
      ads: data._value.user.ads || [],
      avatar: data._value.user.avatar,
      coverImage: data._value.user.coverImage || '',
      createdAt: data._value.user.createdAt,
      email: data._value.user.email || '',
      followers: data._value.user.followers || [],
      following: data._value.user.following || [],
      joinDate: data._value.user.joinDate || '',
      location: data._value.user.location || '',
      memberId: data._value.user.memberId || '',
      name: data._value.user.name || '',
      phone: data._value.user.phone || '',
      ratings: data._value.user.ratings || [],
      type: data._value.user.type || '',
      verified: data._value.user.verified || false
    }

    console.log('تم تحديث البيانات:', userData.value)
  } catch (e) {
    console.error('خطأ في تحميل البيانات:', e)
    error.value = 'حدث خطأ في تحميل البيانات'
  } finally {
    loading.value = false
  }
})

const handleUpdateProfile = async () => {
  try {
    const { error: updateError } = await updateProfile(userData.value)
    if (updateError) {
      throw new Error('Failed to update profile')
    }
    // Show success message
  } catch (e) {
    // Handle error
    console.error('Error updating profile:', e)
  }
}

console.log(userData.value)
</script>

<template>
  <div class="bg-gray-100 min-h-screen" dir="rtl">
    <div v-if="loading" class="text-center py-8">جاري التحميل...</div>
    <div v-else-if="error" class="text-center py-8 text-red-600">{{ error }}</div>
    <div v-else>
      <!-- رأس الصفحة مع العنوان -->
      <div class="bg-white p-4 border-b">
        <h1 class="text-xl font-bold text-center">حسابي</h1>
      </div>

      <!-- صورة الغلاف والمعلومات الشخصية -->
      <div class="max-w-4xl mx-auto">
        <!-- صورة الغلاف -->
        <div class="relative h-64 overflow-hidden rounded-b-lg">
          <img 
            :src="userData.coverImage || '/default-cover.jpg'"
            class="w-full h-full object-cover"
            alt="صورة الغلاف"
          />
          
          <!-- الصورة الشخصية والمعلومات -->
          <div class="absolute -bottom-16 w-full">
            <div class="flex flex-col items-center">
              <!-- الصورة الشخصية -->
              <img 
                :src="userData.avatar || 'https://via.placeholder.com/100'" 
                class="w-32 h-32 rounded-full border-4 border-white object-cover"
                alt="الصورة الشخصية"
              />
              
              <!-- اسم المستخدم والتقييم -->
              <div class="mt-4 text-center">
                <h2 class="text-xl font-bold">{{ userData.name }}</h2>
                <p class="text-gray-600 mt-1">رقم العضوية {{ userData.memberId }}</p>
                <!-- نجوم التقييم -->
                <div class="flex justify-center mt-2">
                  <div class="flex items-center gap-1">
                    <Icon 
                      v-for="i in 5" 
                      :key="i"
                      :name="i <= 3 ? 'ph:star-fill' : 'ph:star'" 
                      class="w-5 h-5"
                      :class="i <= 3 ? 'text-yellow-400' : 'text-gray-300'"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- مساحة إضافية للمحتوى تحت الصورة الشخصية -->
        <div class="mt-20 bg-white rounded-lg shadow-sm p-6">
          <!-- معلومات المستخدم الأساسية -->
          <div class="relative px-6 pb-6">
            <!-- اسم المستخدم والتقييم -->
            <div class="pt-20">
              <div class="flex items-center gap-2">
                <h1 class="text-xl font-bold">{{ userData.name }}</h1>
                <span v-if="userData.type" class="text-sm text-gray-500">({{ userData.type }})</span>
                <!-- عرض التقييمات -->
                <div v-if="userData.ratings && userData.ratings.length > 0" class="flex items-center">
                  <Icon 
                    v-for="i in 5" 
                    :key="i"
                    :name="i <= userData.ratings[0].rating ? 'ph:star-fill' : 'ph:star'" 
                    class="w-4 h-4" 
                    :class="i <= userData.ratings[0].rating ? 'text-yellow-400' : 'text-gray-300'"
                  />
                </div>
              </div>
              <p v-if="userData.location" class="text-sm text-gray-500">{{ userData.location }}</p>
              <div class="mt-2 flex items-center gap-4">
                <NuxtLink 
                  to="/user/profile/followers"
                  class="text-sm hover:text-green-600"
                >
                  المتابعون: {{ userData.followers.length }}
                </NuxtLink>
                <NuxtLink 
                  to="/user/profile/following"
                  class="text-sm hover:text-green-600"
                >
                  يتابع: {{ userData.following.length }}
                </NuxtLink>
              </div>
            </div>

            <!-- معلومات الاتصال -->
            <div class="mt-6 space-y-4">
              <div v-if="userData.email">
                <label class="text-sm text-gray-500">البريد الإلكتروني</label>
                <p>{{ userData.email }}</p>
              </div>
              <div v-if="userData.phone">
                <label class="text-sm text-gray-500">رقم الهاتف</label>
                <p>{{ userData.phone }}</p>
              </div>
              <div>
                <label class="text-sm text-gray-500">رقم العضوية</label>
                <p>{{ userData.memberId }}</p>
              </div>
            </div>

            <!-- حالة التوثيق -->
            <div class="mt-4">
              <div class="flex items-center gap-2">
                <Icon 
                  :name="userData.verified ? 'ph:check-circle-fill' : 'ph:x-circle'" 
                  class="w-5 h-5"
                  :class="userData.verified ? 'text-green-500' : 'text-red-500'"
                />
                <span>{{ userData.verified ? 'حساب موثق' : 'حساب غير موثق' }}</span>
              </div>
            </div>

            <!-- نموذج تحديث المعلومات -->
            <form class="mt-8 space-y-6">
              <!-- الاسم -->
              <div>
                <label class="block text-sm font-medium text-gray-700">الاسم</label>
                <input 
                  type="text" 
                  v-model="userData.name"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <!-- تاريخ الميلاد -->
              <div>
                <label class="block text-sm font-medium text-gray-700">تاريخ الميلاد</label>
                <div class="grid grid-cols-3 gap-4">
                  <select class="block w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option>يوم</option>
                  </select>
                  <select class="block w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option>شهر</option>
                  </select>
                  <select class="block w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option>سنة</option>
                  </select>
                </div>
              </div>

              <!-- الجنس -->
              <div>
                <label class="block text-sm font-medium text-gray-700">الجنس</label>
                <select class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option>ذكر</option>
                  <option>أنثى</option>
                </select>
              </div>

              <!-- رقم الجوال -->
              <div>
                <label class="block text-sm font-medium text-gray-700">رقم الجوال</label>
                <div class="flex gap-2">
                  <select class="w-24 px-3 py-2 border border-gray-300 rounded-md">
                    <option>+966</option>
                  </select>
                  <input 
                    type="tel" 
                    v-model="userData.phone"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <!-- البريد الإلكتروني -->
              <div>
                <label class="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  v-model="userData.email"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  disabled
                />
              </div>

              <!-- نبذة عني -->
              <div>
                <label class="block text-sm font-medium text-gray-700">نبذة عني</label>
                <textarea 
                  v-model="userData.bio"
                  rows="4"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                ></textarea>
              </div>

              <!-- زر الحفظ -->
              <div>
                <button 
                  type="submit"
                  class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                >
                  حفظ التغييرات
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 1024px;
  margin: 0 auto;
}

.profile-header {
  background: linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.6));
}
</style> 