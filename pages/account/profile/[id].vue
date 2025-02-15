<script setup>
import defaultAvatar from "~/assets/user.png";
import defaultCover from "~/assets/cover.jpeg";
import { ref, computed, onMounted, watchEffect } from "vue";
import { PhSealCheck, PhStar, PhFlag } from "@phosphor-icons/vue";

const route = useRoute();
const router = useRouter();
const { getUserProfile, getUserAds, reportUser } = useServices();
const { notification, showNotification } = useNotification();

// State
const profileData = ref(null);
const isLoading = ref(true);
const error = ref(null);
const activeTab = ref("ads"); // ads, about, ratings
const showReportModal = ref(false);
const reportReason = ref("");
const reportAttachment = ref(null);
const isSubmitting = ref(false);

// Fetch user profile data
const fetchProfileData = async () => {
  isLoading.value = true;
  try {
    const { data, error: apiError } = await getUserProfile(route.params.id);

    if (apiError) {
      throw new Error("فشل في تحميل بيانات الملف الشخصي");
    }

    profileData.value = data;
  } catch (err) {
    console.error("خطأ في تحميل البيانات:", err);
    error.value = err;
  } finally {
    isLoading.value = false;
  }
};

// Computed for advertisements
const userAds = computed(() => {
  return profileData.value?.advertisements || [];
});

// Computed properties for user data
const userData = computed(() => {
  return profileData.value?.user || {};
});

const avatarImage = computed(() => {
  if (!userData.value?.avatar) return defaultAvatar;
  return `${userData.value.avatar}`;
});

const coverImage = computed(() => {
  if (!userData.value?.coverImage) return defaultCover;
  return `${userData.value.coverImage}`;
});

// Handle report submission
const handleReport = async () => {
  if (!reportReason.value) {
    showNotification('الرجاء إدخال سبب الإبلاغ', 'error');
    return;
  }

  isSubmitting.value = true;
  try {
    const { error } = await reportUser({
      reportedUser: route.params.id,
      reason: reportReason.value,
      attachment: reportAttachment.value
    });

    if (error) throw error;

    showNotification('تم إرسال البلاغ بنجاح', 'success');
    showReportModal.value = false;
    reportReason.value = '';
    reportAttachment.value = null;
  } catch (err) {
    showNotification('حدث خطأ أثناء إرسال البلاغ', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

// Handle file selection
const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    reportAttachment.value = file;
  }
};

// Load data on mount and route change
watchEffect(() => {
  if (process.client && route.params.id) {
    fetchProfileData();
  }
});
</script>

<template>
  <div class="bg-gray-100 min-h-screen" dir="rtl">
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-8">جاري التحميل...</div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8 text-red-600">
      {{ error.message }}
    </div>

    <!-- Content -->
    <div v-else-if="profileData" class="pb-8">
      <!-- Header with Cover -->
      <div class="relative h-64">
        <img
          :src="coverImage"
          class="w-full h-full object-cover"
          alt="صورة الغلاف"
        />

        <!-- Profile Info Overlay -->
        <div
          class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6"
        >
          <div class="max-w-4xl mx-auto flex items-end gap-6">
            <img
              :src="avatarImage"
              class="w-32 h-32 rounded-full border-4 border-white object-cover"
              alt="الصورة الشخصية"
            />
            <div class="text-white mb-4">
              <div class="flex items-center gap-2">
                <h1 class="text-2xl font-bold">{{ userData.name }}</h1>
                <!-- Verification Badge -->
                <div
                  v-if="userData.identificationVerified"
                  class="bg-white p-1 rounded-full"
                  title="حساب موثق"
                >
                  <PhSealCheck class="w-6 h-6 text-blue-500" weight="fill" />
                </div>
              </div>
              <p class="text-sm opacity-90">
                عضو منذ
                {{ new Date(userData.createdAt).toLocaleDateString("ar-SY") }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="border-b bg-white">
        <div class="max-w-4xl mx-auto">
          <div class="flex gap-8">
            <button
              v-for="tab in ['ads', 'about', 'ratings']"
              :key="tab"
              @click="activeTab = tab"
              class="px-4 py-3 border-b-2 transition-colors"
              :class="
                activeTab === tab
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent'
              "
            >
              {{
                tab === "ads"
                  ? "الإعلانات"
                  : tab === "about"
                  ? "حول"
                  : "التقييمات"
              }}
            </button>
          </div>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="max-w-4xl mx-auto mt-6">
        <!-- Ads Tab -->
        <div
          v-if="activeTab === 'ads'"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="ad in userAds"
            :key="ad._id"
            class="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <NuxtLink :to="`/products/${ad._id}`">
              <img
                :src="ad.gallery?.[0] || defaultCover"
                class="w-full h-48 object-cover"
                :alt="ad.advTitle"
              />
              <div class="p-4">
                <h3 class="font-semibold">{{ ad.advTitle }}</h3>
                <p class="text-green-600 font-bold mt-2">{{ ad.price }} ل.س</p>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- About Tab -->
        <div v-else-if="activeTab === 'about'" class="bg-white rounded-lg p-6">
          <div class="space-y-4">
            <div v-if="userData.bio">
              <h3 class="font-semibold mb-2">نبذة</h3>
              <p>{{ userData.bio }}</p>
            </div>
            <div>
              <h3 class="font-semibold mb-2">معلومات التواصل</h3>
              <div class="space-y-2">
                <p v-if="userData.email">
                  البريد الإلكتروني: {{ userData.email }}
                </p>
                <p v-if="userData.phone">رقم الهاتف: {{ userData.phone }}</p>
                <p v-if="userData.location">الموقع: {{ userData.location }}</p>
                <p v-if="userData.gender">
                  الجنس: {{ userData.gender === "male" ? "ذكر" : "أنثى" }}
                </p>
                <p v-if="userData.birthDate">
                  تاريخ الميلاد:
                  {{ new Date(userData.birthDate).toLocaleDateString("ar-SY") }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Ratings Tab -->
        <div v-else class="bg-white rounded-lg p-6">
          <div v-if="userData.ratings?.length" class="space-y-4">
            <div
              v-for="rating in userData.ratings"
              :key="rating._id"
              class="border-b pb-4"
            >
              <div class="flex items-center gap-2 mb-2">
                <div class="flex">
                  <PhStar
                    v-for="i in 5"
                    :key="i"
                    :class="
                      i <= rating.rating ? 'text-yellow-400' : 'text-gray-300'
                    "
                    class="w-5 h-5"
                  />
                </div>
                <span class="text-sm text-gray-600">
                  {{ new Date(rating.createdAt).toLocaleDateString("ar-SY") }}
                </span>
              </div>
              <p>{{ rating.comment }}</p>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            لا توجد تقييمات بعد
          </div>
        </div>
      </div>

      <!-- Report Button -->
      <button
        @click="showReportModal = true"
        class="fixed bottom-6 left-6 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition-colors flex items-center gap-2"
      >
        <PhFlag class="w-5 h-5" />
        <span>إبلاغ</span>
      </button>
    </div>

    <!-- Report Modal -->
    <div
      v-if="showReportModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold mb-4">الإبلاغ عن مستخدم</h3>
        
        <textarea
          v-model="reportReason"
          rows="4"
          placeholder="سبب الإبلاغ"
          class="w-full border rounded-lg p-2 mb-4 resize-none"
          :disabled="isSubmitting"
        ></textarea>

        <!-- File Upload -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            إرفاق ملف (اختياري)
          </label>
          <input
            type="file"
            @change="handleFileSelect"
            class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            :disabled="isSubmitting"
          />
        </div>

        <div class="flex justify-end gap-4">
          <button
            @click="showReportModal = false"
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
            :disabled="isSubmitting"
          >
            إلغاء
          </button>
          <button
            @click="handleReport"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting">جاري الإرسال...</span>
            <span v-else>إرسال</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
