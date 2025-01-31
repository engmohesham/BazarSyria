<script setup>
const router = useRouter()
const isOpen = ref(false)
const fullName = ref('')
const phone = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const selectedType = ref('شخص') // or 'تجاري'

const openModal = () => {
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
  // Reset form
  fullName.value = ''
  phone.value = ''
  email.value = ''
  password.value = ''
  error.value = ''
}

const emit = defineEmits(['register-success'])

const handleRegister = async () => {
  loading.value = true
  error.value = ''

  try {
    const { data, error: apiError } = await useFetch('https://taste-back.cowdly.com/api/users/register/', {
      method: 'POST',
      body: {
        fullName: fullName.value,
        phone: phone.value,
        email: email.value,
        password: password.value,
        type: selectedType.value,
      },
    })

    if (apiError.value) {
      error.value = 'فشل التسجيل. يرجى المحاولة مرة أخرى.'
      return
    }

    emit('register-success')
    closeModal()
  } catch (e) {
    error.value = 'حدث خطأ أثناء التسجيل'
  } finally {
    loading.value = false
  }
}

const handleLoginClick = () => {
  closeModal()
  // Small delay to ensure smooth transition between modals
  setTimeout(() => {
    emit('register-success')
  }, 100)
}

defineExpose({ openModal, closeModal })

import logo from '~/assets/logo.png'
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
      <!-- Close button -->
      <div class="flex justify-end mb-4">
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          <Icon name="ph:x" class="w-6 h-6" />
        </button>
      </div>

      <!-- Logo -->
      <div class="flex justify-center mb-6">
        <img :src="logo" alt="Logo" class="h-12" />
      </div>

      <!-- Title -->
      <h2 class="text-2xl font-bold text-center mb-8">إنشاء حساب جديد</h2>

      <!-- Account Type Selection -->
      <div class="flex justify-center gap-4 mb-8">
        <button 
          @click="selectedType = 'تجاري'"
          :class="[
            'flex flex-col items-center p-4 rounded-lg border-2 transition-colors',
            selectedType === 'تجاري' ? 'border-green-500' : 'border-gray-200'
          ]"
        >
          <Icon name="ph:buildings" class="w-8 h-8 mb-2" />
          <span>تجاري</span>
        </button>
        <button 
          @click="selectedType = 'شخص'"
          :class="[
            'flex flex-col items-center p-4 rounded-lg border-2 transition-colors',
            selectedType === 'شخص' ? 'border-green-500' : 'border-gray-200'
          ]"
        >
          <Icon name="ph:user" class="w-8 h-8 mb-2" />
          <span>شخص</span>
        </button>
      </div>

      <!-- Error message -->
      <div v-if="error" class="text-red-500 text-sm text-center mb-4">
        {{ error }}
      </div>

      <!-- Registration form -->
      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <input
            v-model="fullName"
            type="text"
            required
            :disabled="loading"
            placeholder="الاسم الكامل"
            class="w-full border rounded-lg py-3 px-4"
          />
        </div>

        <div>
          <input
            v-model="phone"
            type="tel"
            required
            :disabled="loading"
            placeholder="رقم التلفون"
            class="w-full border rounded-lg py-3 px-4"
          />
        </div>

        <div>
          <input
            v-model="email"
            type="email"
            required
            :disabled="loading"
            placeholder="البريد الالكتروني"
            class="w-full border rounded-lg py-3 px-4"
          />
        </div>

        <div>
          <input
            v-model="password"
            type="password"
            required
            :disabled="loading"
            placeholder="كلمة المرور"
            class="w-full border rounded-lg py-3 px-4"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-green-600 text-white rounded-lg py-3 px-4 hover:bg-green-700 disabled:opacity-50"
        >
          <span v-if="loading">جاري التحميل...</span>
          <span v-else>إنشاء حساب</span>
        </button>
      </form>

      <!-- Login link -->
      <p class="text-center mt-6 text-sm">
        لديك حساب بالفعل؟
        <button 
          @click="handleLoginClick" 
          class="text-red-600 hover:text-red-700"
        >
          تسجيل الدخول
        </button>
      </p>
    </div>
  </div>
</template> 