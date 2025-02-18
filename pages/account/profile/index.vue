<script setup>
import defaultAvatar from "~/assets/user.png";
import defaultCover from "~/assets/cover.jpeg";
import { ref, computed, onMounted, watchEffect, onBeforeUnmount, watch } from 'vue';
import { PhCamera, PhSealCheck, PhX } from '@phosphor-icons/vue';
import { useServices } from '~/composables/useServices';

const router = useRouter();
const { getProfile, updateProfile, getFavoriteAds } = useServices();
const { notification, showNotification } = useNotification();

// State
const profileData = ref(null);
const isLoading = ref(true);
const error = ref(null);
const activeTab = ref('ads');
const userAds = ref([]);

// Avatar Preview State
const showAvatarPreview = ref(false);
const showEditAvatar = ref(false);

// حالة النموذج
const showEditForm = ref(false);
const loading = ref(false);

// Fetch profile data
const fetchProfileData = async () => {
  isLoading.value = true;
  try {
    const token = localStorage.getItem("session-token");
    if (!token) {
      router.push("/");
      return;
    }

    const { data, error: apiError } = await getProfile();
    
    if (apiError) {
      throw new Error("فشل في تحميل بيانات الملف الشخصي");
    }

    // console.log('Profile Data Response:', data); // للتأكد من البيانات
    profileData.value = data;

  } catch (err) {
    console.error("خطأ في تحميل البيانات:", err);
    error.value = err;
  } finally {
    isLoading.value = false;
  }
};

// Transform API data into component format with null checks
const userData = computed(() => {
  if (!profileData.value?.user) return null;
  // localStorage.setItem("user", JSON.stringify(profileData.value.user));
  
  const user = profileData.value.user;
  // console.log(user)
  return {
    ads: [],
    avatar: user.avatar || null,
    coverImage: "",
    createdAt: user.createdAt,
    email: user.email || "",
    followers: user.followers || [],
    following: user.following || [],
    joinDate: user.createdAt,
    location: "",
    memberId: user.memberId || "",
    name: user.name || "",
    phone: user.phone || "",
    ratings: user.ratings || [],
    verified: user.idVerificationStatus || "deactivated",
    id: user._id || "",
    emailVerified: user.emailVerified || false,
    role: user.role || "user",
    identificationVerified: user.identificationVerified || false,
    gender: user.gender || "",
    birthdate: user.birthdate || "",
    bio: user.bio || "",
  };
});

// Computed properties for images
const avatarImage = computed(() => {
  if (userData.value?.avatarPreview) return userData.value.avatarPreview;
  if (userData.value?.avatar) return `${userData.value.avatar}`;
  return defaultAvatar;
});

const coverImage = computed(() => {
  if (!userData.value?.coverImage) return defaultCover;
  return userData.value.coverImage;
});

// استخدام watchEffect لمراقبة التغييرات والتحميل الأولي
watchEffect(() => {
  if (process.client) { // Check if we're on client-side
    fetchProfileData();
  }
});

// إعادة تحميل البيانات عند التحميل الأولي
onMounted(() => {
  if (process.client) {
    fetchProfileData();
  }
});

// Preview Methods
const openAvatarPreview = () => {
  showAvatarPreview.value = true;
};

const closeAvatarPreview = () => {
  showAvatarPreview.value = false;
};

// Edit Methods
const openEditAvatar = () => {
  showEditAvatar.value = true;
};

const closeEditAvatar = () => {
  showEditAvatar.value = false;
  // Reset preview if needed
  if (userData.value.avatarPreview) {
    URL.revokeObjectURL(userData.value.avatarPreview);
    userData.value = {
      ...userData.value,
      avatarPreview: null
    };
  }
};

// دوال التحكم بالنموذج
const openEditForm = () => {
  showEditForm.value = true;
};

const closeEditForm = () => {
  showEditForm.value = false;
};

// Update handleAvatarChange to work with the new modal
const handleAvatarChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Check file type
    if (!file.type.startsWith('image/')) {
      showNotification('يرجى اختيار ملف صورة صالح', 'error');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification('حجم الصورة يجب أن لا يتجاوز 5 ميجابايت', 'error');
      return;
    }

    // Create preview URL and update avatar
    const previewUrl = URL.createObjectURL(file);
    userData.value = {
      ...userData.value,
      newAvatar: file,
      avatarPreview: previewUrl
    };

    // Auto submit avatar change
    handleAvatarSubmit(file);
  }
};

// Update handleAvatarSubmit to close the modal on success
const handleAvatarSubmit = async (file) => {
  try {
    const formData = new FormData();
    formData.append('id', userData.value.id);
    formData.append('avatar', file);

    const { error, message } = await updateProfile(formData);

    if (error) {
      throw new Error(error);
    }

    // Refresh profile data
    await fetchProfileData();
    
    // Reset file upload state
    if (userData.value.avatarPreview) {
      URL.revokeObjectURL(userData.value.avatarPreview);
    }
    userData.value = {
      ...userData.value,
      newAvatar: null,
      avatarPreview: null
    };

    showNotification(message || "تم تحديث الصورة الشخصية بنجاح", "success");
    closeEditAvatar(); // Close the modal after successful update
  } catch (error) {
    console.error("Error updating avatar:", error);
    showNotification("حدث خطأ أثناء تحديث الصورة الشخصية", "error");
  }
};

// تحديث دالة handleUpdateProfile
const handleUpdateProfile = async () => {
  loading.value = true;
  try {
    const formData = new FormData();
    formData.append('id', userData.value.id);
    formData.append('name', userData.value.name);
    formData.append('birthdate', userData.value.birthdate);
    formData.append('bio', userData.value.bio);

    const { error, message } = await updateProfile(formData);

    if (error) {
      showNotification(message || "حدث خطأ أثناء تحديث الملف الشخصي", "error");
      return;
    }

    showNotification(message || "تم تحديث الملف الشخصي بنجاح", "success");
    closeEditForm();
    await fetchProfileData(); // تحديث البيانات
  } catch (error) {
    console.error("Error updating profile:", error);
    showNotification("حدث خطأ أثناء تحديث الملف الشخصي", "error");
  } finally {
    loading.value = false;
  }
};

// Add these new refs for date handling
const selectedDay = ref("");
const selectedMonth = ref("");
const selectedYear = ref("");

// Generate arrays for days, months, and years
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

// Watch for changes in date selections and update birthDate
watch([selectedDay, selectedMonth, selectedYear], ([day, month, year]) => {
  if (day && month && year) {
    // Format date as YYYY-MM-DD
    const formattedMonth = month.toString().padStart(2, "0");
    const formattedDay = day.toString().padStart(2, "0");
    userData.value.birthdate = `${year}-${formattedMonth}-${formattedDay}`;
  }
});

// Initialize date selections when userData is loaded
watchEffect(() => {
  if (userData.value?.birthdate) {
    const date = new Date(userData.value.birthdate);
    selectedDay.value = date.getDate();
    selectedMonth.value = date.getMonth() + 1;
    selectedYear.value = date.getFullYear();
  }
});

// Define gender options with matching API values
const genderOptions = [
  { value: "male", label: "ذكر" }, // Matches API's "male" value
  { value: "female", label: "أنثى" }, // Will match API's "female" value
];

// Initialize gender when userData is loaded
watchEffect(() => {
  if (userData.value) {
    // API returns "male" or "female" directly, so we can use it as is
    userData.value.gender = userData.value.gender || "";
    // console.log("Current gender:", userData.value.gender); // For debugging
  }
});

// Clean up URLs on component unmount
onBeforeUnmount(() => {
  if (userData.value?.avatarPreview) {
    URL.revokeObjectURL(userData.value.avatarPreview);
  }
});

// Watch for tab changes
watch(activeTab, (newTab) => {
  if (newTab === 'ads') {
    fetchProfileData();
  }
});
</script>

<template>
  <div class="bg-gray-100 min-h-screen pb-10" dir="rtl">
    <Transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="notification.show"
        class="fixed top-4 left-4 z-50 rounded-md p-4 max-w-sm w-full shadow-lg"
        :class="{
          'bg-green-50': notification.type === 'success',
          'bg-red-50': notification.type === 'error',
        }"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Icon
              v-if="notification.type === 'success'"
              name="ph:check-circle-fill"
              class="h-5 w-5 text-green-400"
            />
            <Icon v-else name="ph:x-circle-fill" class="h-5 w-5 text-red-400" />
          </div>
          <div class="mr-3">
            <p
              class="text-sm font-medium"
              :class="{
                'text-green-800': notification.type === 'success',
                'text-red-800': notification.type === 'error',
              }"
            >
              {{ notification.message }}
            </p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-8">
      جاري التحميل...
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8 text-red-600">
      {{ error.message }}
    </div>

    <!-- Content -->
    <div v-else-if="userData">
      <!-- رأس الصفحة مع العنوان -->
      <div class="bg-white p-4 border-b">
        <div class="flex items-center justify-between max-w-4xl mx-auto">
          <button
            @click="router.back()"
            class="text-gray-600 hover:text-gray-800"
          >
            <Icon name="ph:arrow-right-bold" class="w-6 h-6" />
          </button>
          <h1 class="text-xl font-bold">حسابي</h1>
          <!-- إضافة زر التعديل -->
          <button
            @click="openEditForm"
            class="text-green-600 hover:text-green-700 flex items-center gap-2"
          >
            <Icon name="ph:pencil-simple" class="w-5 h-5" />
            <span>تعديل</span>
          </button>
        </div>
      </div>

      <!-- نافذة تعديل الملف الشخصي -->
      <div
        v-if="showEditForm"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto"
        @click="closeEditForm"
      >
        <div 
          class="bg-white rounded-lg max-w-2xl w-full m-4 p-6" 
          @click.stop
          style="max-height: 90vh; overflow-y: auto;"
        >
          <!-- رأس النموذج -->
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold">تعديل الملف الشخصي</h2>
            <button 
              @click="closeEditForm"
              class="text-gray-500 hover:text-gray-700"
            >
              <Icon name="ph:x" class="w-6 h-6" />
            </button>
          </div>

          <!-- نموذج التعديل -->
          <form @submit.prevent="handleUpdateProfile" class="space-y-6">
            <!-- الاسم -->
            <!-- <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
              <input
                v-model="userData.name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div> -->

            <!-- تاريخ الميلاد -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">تاريخ الميلاد</label>
              <div class="grid grid-cols-3 gap-4">
                <select
                  v-model="selectedDay"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">يوم</option>
                  <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
                </select>
                <select
                  v-model="selectedMonth"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">شهر</option>
                  <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
                </select>
                <select
                  v-model="selectedYear"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">سنة</option>
                  <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                </select>
              </div>
            </div>

            <!-- نبذة عني -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">نبذة عني</label>
              <textarea
                v-model="userData.bio"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md"
              ></textarea>
            </div>

            <!-- أزرار التحكم -->
            <div class="flex justify-end gap-4">
              <button
                type="button"
                @click="closeEditForm"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                :disabled="loading"
              >
                {{ loading ? 'جاري الحفظ...' : 'حفظ التغييرات' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- صورة الغلاف والمعلومات الشخصية -->
      <div class="max-w-4xl mx-auto">
        <!-- صورة الغلاف -->
        <div class="relative h-64 rounded-b-lg">
          <img
            :src="coverImage"
            class="w-full h-full object-cover"
            alt="صورة الغلاف"
          />

          <!-- الصورة الشخصية والمعلومات -->
          <div
            class="absolute -bottom-16 right-1/2 translate-x-1/2 bg-white rounded-lg px-3 py-2 w-fit"
          >
            <div class="flex flex-col items-center">
              <!-- الصورة الشخصية -->
              <div class="mb-6 flex flex-col items-center">
                <div class="relative group">
                  <!-- Avatar Image with Preview -->
                  <img
                    :src="avatarImage"
                    class="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg cursor-pointer"
                    alt="الصورة الشخصية"
                    @click="openAvatarPreview"
                  />
                  
                  <!-- Edit Button -->
                  <button
                    @click="openEditAvatar"
                    class="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full shadow-lg hover:bg-green-600 transition-colors"
                    title="تعديل الصورة الشخصية"
                  >
                    <PhCamera class="w-5 h-5" />
                  </button>
                </div>
                <p class="text-sm text-gray-500 mt-2">اضغط على الصورة لتغييرها</p>
              </div>

              <!-- اسم المستخدم والتقييم -->
              <div class="mt-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <h2 class="text-xl font-bold">{{ userData.name }}</h2>
                  <!-- إضافة علامة التوثيق -->
                  <div
                    v-if="userData.identificationVerified"
                    class="bg-white p-1 rounded-full shadow-sm"
                    title="حساب موثق"
                  >
                    <PhSealCheck class="w-6 h-6 text-blue-500" weight="fill" />
                  </div>
                </div>
                <p class="text-gray-600 mt-1">
                  رقم العضوية {{ userData.memberId }}
                </p>
                <p class="text-gray-600 mt-1">
                  تاريخ الانشاء {{ new Date(userData.createdAt).toLocaleDateString('ar-SY', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric'
                  }) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- مساحة إضافية للمحتوى تحت الصورة الشخصية -->
        <div class="mt-20 bg-white rounded-lg shadow-sm p-6">
          <!-- معلومات المستخدم الأساسية -->
          <div class="relative px-6 pb-6">
            <!-- اسم المستخدم والتقييم -->
            <div class="pt-5">
              <div class="flex items-center gap-2">
                <h1 class="text-xl font-bold">{{ userData.name }}</h1>
                <span v-if="userData.type" class="text-sm text-gray-500"
                  >({{ userData.type }})</span
                >
                <!-- عرض التقييمات -->
                <div
                  v-if="userData.ratings && userData.ratings.length > 0"
                  class="flex items-center"
                >
                  <Icon
                    v-for="i in 5"
                    :key="i"
                    :name="
                      i <= userData.ratings[0].rating
                        ? 'ph:star-fill'
                        : 'ph:star'
                    "
                    class="w-4 h-4"
                    :class="
                      i <= userData.ratings[0].rating
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    "
                  />
                </div>
              </div>
              <p v-if="userData.location" class="text-sm text-gray-500">
                {{ userData.location }}
              </p>
              <div class="mt-2 flex items-center gap-4">
                <NuxtLink
                  to="/account/profile/followers"
                  class="text-sm hover:text-green-600"
                >
                  المتابعون: {{ userData.followers.length }}
                </NuxtLink>
                <NuxtLink
                  to="/account/profile/following"
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

            <div class="mt-6 space-y-4">
              <div v-if="userData.bio">
                <label class="text-sm text-gray-500">نبذة عني</label>
                <p>{{ userData.bio }}</p>
              </div>
            </div>

            <div class="mt-6 space-y-4">
              <div v-if="userData.location">
                <label class="text-sm text-gray-500">الموقع</label>
                <p>{{ userData.location }}</p>
              </div>
              <div v-if="userData.birthdate">
                <label class="text-sm text-gray-500">تاريخ الميلاد</label>
                <p>{{ userData.birthdate }}</p>
              </div>
            </div>

            <!-- حالة التوثيق -->
            <div class="mt-4">
              <div class="flex items-center gap-2">
                <Icon
                  :name="
                    userData.verified === 'active'
                      ? 'ph:check-circle-fill'
                      : 'ph:x-circle'
                  "
                  class="w-5 h-5"
                  :class="
                    userData.verified === 'active'
                      ? 'text-green-500'
                      : userData.verified === 'pending'
                      ? 'text-yellow-500'
                      : 'text-red-500'
                  "
                />
                <span>{{
                  userData.verified === "active"
                    ? "حساب موثق"
                    : userData.verified === "pending"
                    ? "الحساب تحت المراجعة"
                    : "حساب غير موثق"
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Avatar Preview Modal -->
      <div
        v-if="showAvatarPreview"
        class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center"
        @click="closeAvatarPreview"
      >
        <div class="relative max-w-2xl mx-auto" @click.stop>
          <!-- Close Button -->
          <button
            @click="closeAvatarPreview"
            class="absolute -top-10 right-0 text-white text-3xl"
          >
            ×
          </button>
          
          <!-- Preview Image -->
          <img
            :src="avatarImage"
            alt="معاينة الصورة الشخصية"
            class="max-h-[80vh] max-w-full rounded-lg"
          />
        </div>
      </div>

      <!-- Edit Avatar Modal -->
      <div
        v-if="showEditAvatar"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      >
        <div class="bg-white rounded-lg max-w-md w-full p-6" @click.stop>
          <!-- Modal Header -->
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">تغيير الصورة الشخصية</h3>
            <button @click="closeEditAvatar" class="text-gray-500 hover:text-gray-700">
              <PhX :size="24" />
            </button>
          </div>

          <!-- Upload Form -->
          <div class="space-y-4">
            <div class="flex justify-center">
              <img
                :src="userData.avatarPreview || avatarImage"
                class="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                alt="معاينة"
              />
            </div>
            
            <label class="block">
              <span class="sr-only">اختر صورة</span>
              <input
                type="file"
                accept="image/*"
                class="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-green-50 file:text-green-700
                  hover:file:bg-green-100"
                @change="handleAvatarChange"
              />
            </label>

            <div class="text-sm text-gray-500">
              * يجب أن لا يتجاوز حجم الصورة 5 ميجابايت
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs Section -->
      <!-- <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="bg-white rounded-lg shadow">
          <div class="border-b border-gray-200">
            <nav class="flex -mb-px">
              <div class="px-6 py-4 text-sm font-medium border-b-2 border-green-500 text-green-600">
                إعلاناتي
              </div>
            </nav>
          </div>

          <div class="p-4">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <ProductCard 
                v-for="ad in userAds" 
                :key="ad._id" 
                :product="ad"
              />
              <div v-if="!userAds.length" class="col-span-full text-center py-8 text-gray-500">
                لا توجد إعلانات
              </div>
            </div>
          </div>
        </div>
      </div> -->
    </div>

    <!-- Not Found State -->
    <div v-else class="text-center py-8">
      لم يتم العثور على الملف الشخصي
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 1024px;
  margin: 0 auto;
}

.profile-header {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.4),
    rgba(0, 0, 0, 0.6)
  );
}

.transform {
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y));
}

.transition {
  transition-property: color, background-color, border-color,
    text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter,
    backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.duration-300 {
  transition-duration: 300ms;
}

.duration-100 {
  transition-duration: 100ms;
}

.ease-out {
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
}

.ease-in {
  transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
}

/* Add these styles for better select appearance */
select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: left 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-left: 2.5rem;
}

select:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

.group:hover .opacity-0 {
  opacity: 1;
}

/* Add any additional styles you need */
.modal-overlay {
  backdrop-filter: blur(2px);
}

.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #e5e7eb transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 3px;
}
</style>
