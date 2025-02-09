<script setup>
definePageMeta({
  middleware: ["auth"]
});

const selectedMethod = ref("الثاني"); // القيمة الافتراضية
const newPassword = ref("");
const confirmPassword = ref("");
const error = ref("");
const success = ref("");

const { updateSettings, updatePassword, updateVerification } = useServices();
const router = useRouter();

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
</script>

<template>
  <div class="bg-gray-100 min-h-screen py-8" dir="rtl">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto">
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
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
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
        </div>

        <!-- إنشاء كلمة مرور -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-lg font-semibold mb-4">إنشاء كلمة مرور</h2>
          <form @submit.prevent="handlePasswordChange" class="space-y-4">
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
            >
              حفظ التغييرات
            </button>
          </form>
        </div>

        <!-- توثيق الحساب -->
        <div class="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 class="text-lg font-semibold mb-6">توثيق الحساب</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- توثيق الحساب للأفراد -->
            <div class="bg-gray-50 rounded-lg p-6 text-center">
              <div class="flex justify-center mb-4">
                <Icon
                  name="hugeicons:user-id-verification"
                  class="w-12 h-12 text-green-600"
                />
              </div>
              <h3 class="font-semibold mb-2">توثيق الحساب</h3>
              <p class="text-sm text-gray-600 mb-4">
                للاستمرار في استخدام منصة بازار سوريا يتوجب عليك توثيق هويتك
              </p>
              <button
                @click="handleVerification('all')"
                class="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
              >
                توثيق الهوية
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
