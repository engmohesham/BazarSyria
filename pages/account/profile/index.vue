<script setup>
import defaultAvatar from "~/assets/user.png";
import defaultCover from "~/assets/cover.jpeg";
import { ref, computed, onMounted, watchEffect } from 'vue';

const router = useRouter();
const { getProfile, updateProfile } = useServices();
const { notification, showNotification } = useNotification();

// State
const profileData = ref(null);
const isLoading = ref(true);
const error = ref(null);

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

    console.log('Profile Data Response:', data); // للتأكد من البيانات
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
    bio: user.bio || "",
  };
});

// Computed properties for images
const avatarImage = computed(() => {
  if (!userData.value?.avatar) return defaultAvatar;
  return `${API_BASE_URL}/${userData.value.avatar}`;
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

// Update handleUpdateProfile function
const handleUpdateProfile = async (e) => {
  e.preventDefault();
  try {
    const updateData = {
      id: userData.value.id,
      name: userData.value.name,
      email: userData.value.email,
      phone: userData.value.phone,
      location: userData.value.location,
      bio: userData.value.bio,
      gender: userData.value.gender,
      birthDate: userData.value.birthDate,
    };

    if (userData.value.newAvatar instanceof File) {
      updateData.avatar = userData.value.newAvatar;
    }
    if (userData.value.newCoverImage instanceof File) {
      updateData.coverImage = userData.value.newCoverImage;
    }

    const { error, message } = await updateProfile(updateData);

    if (error) {
      throw new Error(error);
    }

    // Refresh the data immediately after successful update
    await fetchProfileData();
    
    // Reset file upload states
    userData.value.newAvatar = null;
    userData.value.newCoverImage = null;

    showNotification(message || "تم تحديث الملف الشخصي بنجاح", "success");
  } catch (error) {
    console.error("Error updating profile:", error);
    showNotification("حدث خطأ أثناء تحديث الملف الشخصي", "error");
  }
};

// File handlers
const handleAvatarChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    userData.value.newAvatar = file;
    const previewUrl = URL.createObjectURL(file);
    userData.value.avatar = previewUrl;
  }
};

const handleCoverImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    userData.value.newCoverImage = file;
    const previewUrl = URL.createObjectURL(file);
    userData.value.coverImage = previewUrl;
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
    userData.value.birthDate = `${year}-${formattedMonth}-${formattedDay}`;
  }
});

// Initialize date selections when userData is loaded
watchEffect(() => {
  if (userData.value?.birthDate) {
    const date = new Date(userData.value.birthDate);
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
    console.log("Current gender:", userData.value.gender); // For debugging
  }
});
</script>

<template>
  <div class="bg-gray-100 min-h-screen" dir="rtl">
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
          <div class="w-6"></div>
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
              <img
                :src="avatarImage"
                class="w-32 h-32 rounded-full border-4 border-white object-cover"
                alt="الصورة الشخصية"
              />

              <!-- اسم المستخدم والتقييم -->
              <div class="mt-4 text-center">
                <h2 class="text-xl font-bold">{{ userData.name }}</h2>
                <p class="text-gray-600 mt-1">
                  رقم العضوية {{ userData.memberId }}
                </p>
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

            <!-- نموذج تحديث المعلومات -->
            <form class="mt-8 space-y-6">
              <!-- الاسم -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >الاسم</label
                >
                <input
                  type="text"
                  v-model="userData.name"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <!-- تاريخ الميلاد -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >تاريخ الميلاد</label
                >
                <div class="grid grid-cols-3 gap-4">
                  <select
                    v-model="selectedDay"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">يوم</option>
                    <option v-for="day in days" :key="day" :value="day">
                      {{ day }}
                    </option>
                  </select>
                  <select
                    v-model="selectedMonth"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">شهر</option>
                    <option v-for="month in months" :key="month" :value="month">
                      {{ month }}
                    </option>
                  </select>
                  <select
                    v-model="selectedYear"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">سنة</option>
                    <option v-for="year in years" :key="year" :value="year">
                      {{ year }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- الجنس -->
              <div class="mt-6">
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >الجنس</label
                >
                <select
                  v-model="userData.gender"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">اختر الجنس</option>
                  <option
                    v-for="option in genderOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <!-- رقم الجوال -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >رقم الجوال</label
                >
                <div class="flex gap-2">
                  <select
                    class="w-24 px-3 py-2 border border-gray-300 rounded-md"
                  >
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
                <label class="block text-sm font-medium text-gray-700"
                  >البريد الإلكتروني</label
                >
                <input
                  type="email"
                  v-model="userData.email"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  disabled
                />
              </div>

              <!-- نبذة عني -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >نبذة عني</label
                >
                <textarea
                  v-model="userData.bio"
                  rows="4"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                ></textarea>
              </div>

              <!-- Add file inputs for avatar and cover image -->
              <div class="relative">
                <input
                  type="file"
                  accept="image/*"
                  @change="handleAvatarChange"
                  class="hidden"
                  ref="avatarInput"
                />
                <button
                  @click="$refs.avatarInput.click()"
                  class="absolute bottom-0 right-0"
                >
                  <PhCamera :size="20" class="text-gray-600" />
                </button>
              </div>

              <div class="relative">
                <input
                  type="file"
                  accept="image/*"
                  @change="handleCoverImageChange"
                  class="hidden"
                  ref="coverInput"
                />
                <button
                  @click="$refs.coverInput.click()"
                  class="absolute top-4 right-4"
                >
                  <PhCamera :size="20" class="text-gray-600" />
                </button>
              </div>

              <!-- زر الحفظ -->
              <div>
                <button
                  @click="handleUpdateProfile"
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
</style>
