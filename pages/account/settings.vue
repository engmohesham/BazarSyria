<script setup>
definePageMeta({
  middleware: ["auth"]
});

const selectedMethod = ref("الثاني");
const newPassword = ref("");
const confirmPassword = ref("");
const error = ref("");
const success = ref("");
const currentUser = ref(null);
const isLoading = ref(true);
const email = ref("");
const resetPasswordEmail = ref("");
const resetPasswordSuccess = ref(false);

const { updateSettings, updatePassword, updateVerification, getProfile } = useServices();
const router = useRouter();

// Fetch fresh profile data from API
const fetchProfileData = async () => {
  isLoading.value = true;
  try {
    const { data, error: apiError } = await getProfile();
    
    if (apiError) throw apiError;

    if (data?.user) {
      // تحديث البيانات في localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      // تحديث حالة المستخدم في الكومبوننت
      currentUser.value = data.user;
      // تحديث طريقة التواصل المختارة
      selectedMethod.value = data.user.contactMethod || "الثاني";
      email.value = data.user.email || "";
    }
  } catch (err) {
    console.error("Error fetching profile data:", err);
    error.value = "فشل في تحميل بيانات الملف الشخصي";
  } finally {
    isLoading.value = false;
  }
};

// Computed property for verification status
const verificationStatus = computed(() => {
  if (!currentUser.value) return null;

  const status = currentUser.value.idVerificationStatus;
  
  switch (status) {
    case 'approved':
      return {
        text: 'تم توثيق حسابك بنجاح',
        icon: 'ph:check-circle',
        color: 'text-green-600',
        showButton: false,
        bgColor: 'bg-green-50'
      };
    case 'pending':
      return {
        text: 'طلب التوثيق قيد المراجعة',
        icon: 'ph:clock',
        color: 'text-yellow-600',
        showButton: false,
        bgColor: 'bg-yellow-50'
      };
    case 'deactivated':
    default:
      return {
        text: 'للاستمرار في استخدام منصة بازار سوريا يتوجب عليك توثيق هويتك',
        icon: 'hugeicons:user-id-verification',
        color: 'text-gray-600',
        showButton: true,
        bgColor: 'bg-gray-50'
      };
  }
});

const handlePasswordChange = async () => {
  error.value = "";
  success.value = "";

  if (newPassword.value !== confirmPassword.value) {
    error.value = "كلمات المرور غير متطابقة";
    return;
  }

  try {
    const { error: apiError } = await updatePassword({
      newPassword: newPassword.value,
    });

    if (apiError) throw apiError;

    success.value = "تم تحديث كلمة المرور بنجاح";
    newPassword.value = "";
    confirmPassword.value = "";
  } catch (err) {
    error.value = "فشل تحديث كلمة المرور";
  }
};

const handleMethodChange = async (method) => {
  selectedMethod.value = method;
  try {
    const { error: apiError } = await updateSettings({
      contactMethod: method,
    });
    if (apiError) throw apiError;
  } catch (err) {
    console.error("Error updating contact method:", err);
  }
};

// دالة معالجة التوثيق
const handleVerification = (type) => {
  try {
    // التوجيه المباشر إلى صفحة التوثيق المناسبة
    router.push({
      path: `/account/verification?type=${type}`,
    });
  } catch (err) {
    console.error("Error in verification:", err);
  }
};

// دالة إعادة تعيين كلمة المرور
const handleResetPassword = async () => {
  error.value = "";
  success.value = "";

  if (!newPassword.value || !confirmPassword.value) {
    error.value = "الرجاء إدخال كلمة المرور وتأكيدها";
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = "كلمات المرور غير متطابقة";
    return;
  }

  try {
    const token = localStorage.getItem('session-token');
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) {
      throw new Error('لم يتم العثور على جلسة تسجيل الدخول');
    }

    const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        password: newPassword.value,
        // confirmPassword: confirmPassword.value
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'حدث خطأ في تغيير كلمة المرور');
    }

    success.value = data.message || "تم تغيير كلمة المرور بنجاح";
    
    // إعادة تعيين حقول كلمة المرور
    newPassword.value = "";
    confirmPassword.value = "";
  } catch (err) {
    console.error('Change password error:', err);
    error.value = err.message || "فشل في تغيير كلمة المرور";
  }
};

// استخدام watchEffect لمراقبة التغييرات والتحميل الأولي
watchEffect(() => {
  if (process.client) {
    fetchProfileData();
  }
});

// إعادة تحميل البيانات عند التحميل الأولي
onMounted(() => {
  if (process.client) {
    fetchProfileData();
  }
});
</script>

<template>
  <div class="bg-gray-100 min-h-screen py-8" dir="rtl">
    <!-- Loading State -->
    <div v-if="isLoading" class="container mx-auto px-4 text-center py-8">
      جاري التحميل...
    </div>

    <div v-else class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto">
        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {{ error }}
        </div>

        <!-- Content -->
        <template v-if="currentUser">
          <!-- رأس الصفحة -->
          <div class="flex items-center justify-between mb-6">
            <h1 class="text-2xl font-bold">الإعدادات العامة</h1>
            <NuxtLink
              to="/account"
              class="text-gray-600 hover:text-gray-800"
            >
              <Icon name="ph:arrow-left" class="w-6 h-6" />
            </NuxtLink>
          </div>

          <!-- طريقة التواصل -->
          <!-- <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 class="text-lg font-semibold mb-4">طريقة التواصل</h2>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button
                v-for="method in [
                  'برقم الهاتف',
                  'الثاني',
                  'عبر رسول سوريا',
                  'لا يوجد',
                ]"
                :key="method"
                @click="handleMethodChange(method)"
                :class="[
                  'p-4 rounded-lg border-2 text-center transition-colors',
                  selectedMethod === method
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300',
                ]"
              >
                {{ method }}
              </button>
            </div>
          </div> -->

          <!-- إضافة قسم البريد الإلكتروني -->
          <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 class="text-lg font-semibold mb-4">البريد الإلكتروني</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  البريد الإلكتروني
                </label>
                <input
                  v-model="email"
                  type="email"
                  class="w-full border rounded-lg py-2 px-3"
                  placeholder="أدخل بريدك الإلكتروني"
                  :disabled="true"
                />
              </div>
            </div>
          </div>

          <!-- إنشاء كلمة مرور -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-semibold mb-4">تغيير كلمة المرور</h2>
            <form @submit.prevent="handleResetPassword" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  كلمة مرور جديدة
                </label>
                <input
                  v-model="newPassword"
                  type="password"
                  class="w-full border rounded-lg py-2 px-3"
                  placeholder="كلمة مرور جديدة"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  تأكيد كلمة المرور
                </label>
                <input
                  v-model="confirmPassword"
                  type="password"
                  class="w-full border rounded-lg py-2 px-3"
                  placeholder="تأكيد كلمة المرور"
                />
              </div>

              <div v-if="error" class="text-red-500 text-sm">
                {{ error }}
              </div>

              <div v-if="success" class="text-green-500 text-sm">
                {{ success }}
              </div>

              <button
                type="submit"
                class="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                :disabled="!newPassword || !confirmPassword"
              >
                تغيير كلمة المرور
              </button>
            </form>
          </div>

          <!-- توثيق الحساب -->
          <div class="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h2 class="text-lg font-semibold mb-6">توثيق الحساب</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- توثيق الحساب للأفراد -->
              <div 
                v-if="verificationStatus"
                :class="[
                  'rounded-lg p-6 text-center',
                  verificationStatus.bgColor
                ]"
              >
                <div class="flex justify-center mb-4">
                  <Icon
                    :name="verificationStatus.icon"
                    :class="[
                      'w-12 h-12',
                      verificationStatus.color
                    ]"
                  />
                </div>
                <h3 class="font-semibold mb-2">توثيق الحساب</h3>
                <p class="text-sm text-gray-600 mb-4">
                  {{ verificationStatus.text }}
                </p>
                <button
                  v-if="verificationStatus.showButton"
                  @click="handleVerification('all')"
                  class="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                >
                  توثيق الهوية
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
