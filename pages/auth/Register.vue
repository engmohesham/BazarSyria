<script setup>
const router = useRouter();
const isOpen = ref(false);
const selectedType = ref("شخصي"); // Default to personal account
const fullName = ref("");
const phone = ref("");
const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

const openModal = () => {
  isOpen.value = true;
};

const closeModal = () => {
  isOpen.value = false;
  resetForm();
};

const resetForm = () => {
  fullName.value = "";
  phone.value = "";
  email.value = "";
  password.value = "";
  error.value = "";
  selectedType.value = "شخصي";
};

const emit = defineEmits(["register-success"]);

const handleRegister = async () => {
  loading.value = true;
  error.value = "";

  try {
    const { data, error: apiError } = await useFetch(
      "https://taste-back.cowdly.com/api/users/register/",
      {
        method: "POST",
        body: {
          fullName: fullName.value,
          phone: phone.value,
          email: email.value,
          password: password.value,
          type: selectedType.value,
        },
      }
    );

    if (apiError.value) {
      error.value = "فشل التسجيل. يرجى المحاولة مرة أخرى.";
      return;
    }

    emit("register-success");
    closeModal();
  } catch (e) {
    error.value = "حدث خطأ أثناء التسجيل";
  } finally {
    loading.value = false;
  }
};

const handleLoginClick = () => {
  closeModal();
  // Small delay to ensure smooth transition between modals
  setTimeout(() => {
    emit("register-success");
  }, 100);
};

defineExpose({ openModal, closeModal });

import logo from "~/assets/logo.png";
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
  >
    <div class="bg-white rounded-lg w-full max-w-md max-h-[90vh] flex flex-col">
      <!-- Header Section (Fixed) -->
      <div class="p-6 border-b">
        <!-- Close button -->
        <div class="flex justify-end">
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
            <Icon name="ph:x" class="w-6 h-6" />
          </button>
        </div>

        <!-- Logo -->
        <div class="flex justify-center mb-4">
          <img :src="logo" alt="Logo" class="h-12" />
        </div>

        <!-- Title -->
        <h2 class="text-2xl font-bold text-center">إنشاء حساب جديد</h2>
      </div>

      <!-- Scrollable Content -->
      <div class="overflow-y-auto p-6 flex-1">
        <!-- Account Type Selection -->
        <div class="flex justify-center gap-4 mb-8">
          <button
            @click="selectedType = 'تجاري'"
            :class="[
              'flex flex-col items-center p-4 rounded-lg border-2 transition-colors w-32',
              selectedType === 'تجاري' ? 'border-green-500' : 'border-gray-200',
            ]"
          >
            <Icon name="ph:buildings" class="w-8 h-8 mb-2" />
            <span>تجاري</span>
          </button>
          <button
            @click="selectedType = 'شخصي'"
            :class="[
              'flex flex-col items-center p-4 rounded-lg border-2 transition-colors w-32',
              selectedType === 'شخصي' ? 'border-green-500' : 'border-gray-200',
            ]"
          >
            <Icon name="ph:user" class="w-8 h-8 mb-2" />
            <span>شخصي</span>
          </button>
        </div>

        <!-- Registration form -->
        <form @submit.prevent="handleRegister" class="space-y-4">
          <!-- Full Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              الاسم كامل
            </label>
            <div class="relative">
              <input
                v-model="fullName"
                type="text"
                required
                :disabled="loading"
                placeholder="ادخل اسمك بالكامل"
                class="w-full border rounded-lg py-3 px-4 pr-10"
                dir="rtl"
              />
              <Icon
                name="ph:user"
                class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 w-5 h-5"
              />
            </div>
          </div>

          <!-- Phone Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              رقم التلفون
            </label>
            <div class="relative">
              <input
                v-model="phone"
                type="tel"
                required
                :disabled="loading"
                placeholder="ادخل رقم التلفون"
                class="w-full border rounded-lg py-3 px-4 pr-10"
                dir="rtl"
              />
              <Icon
                name="ph:phone"
                class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 w-5 h-5"
              />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              البريد الالكتروني
            </label>
            <div class="relative">
              <input
                v-model="email"
                type="email"
                required
                :disabled="loading"
                placeholder="البريد الالكتروني"
                class="w-full border rounded-lg py-3 px-4 pr-10"
                dir="rtl"
              />
              <Icon
                name="ph:envelope"
                class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 w-5 h-5"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              كلمة المرور
            </label>
            <div class="relative">
              <input
                v-model="password"
                type="password"
                required
                :disabled="loading"
                placeholder="كلمة المرور"
                class="w-full border rounded-lg py-3 px-4 pr-10"
                dir="rtl"
              />
              <Icon
                name="ph:lock"
                class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 w-5 h-5"
              />
            </div>
          </div>

          <!-- Error message -->
          <div v-if="error" class="text-red-500 text-sm text-center">
            {{ error }}
          </div>
        </form>
      </div>

      <!-- Footer Section (Fixed) -->
      <div class="p-6 border-t">
        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-green-600 text-white rounded-lg py-3 px-4 hover:bg-green-700 disabled:opacity-50 font-medium mb-4"
        >
          <span v-if="loading">جاري التحميل...</span>
          <span v-else>إنشاء حساب</span>
        </button>

        <!-- Login Link -->
        <p class="text-center text-sm">
          <span class="text-gray-600">عضو جديد في بازار سوريا؟</span>
          <button
            @click="handleLoginClick"
            class="text-red-600 hover:text-red-700 font-medium mr-1"
          >
            قم بتسجيل الدخول الآن
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
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

.bg-gray-50 {
  background-color: #f9fafb;
}
</style>
