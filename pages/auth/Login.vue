and<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useServices } from '~/composables/useServices'
import { onMounted, onUnmounted } from 'vue'
import { PhWarning, PhCheckCircle } from '@phosphor-icons/vue'

const router = useRouter()
const { login } = useServices()
const isOpen = ref(false)
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const success = ref('')
const showNotification = ref(false)

// Update the watch to watch local refs instead of props
watch(
  () => [error.value, success.value],
  ([newError, newSuccess]) => {
    if (newError || newSuccess) {
      showNotification.value = true
      setTimeout(() => {
        showNotification.value = false
      }, 1500)
    }
  },
  { immediate: true }
)

const openModal = () => {
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
  // Reset form
  email.value = ''
  password.value = ''
  error.value = ''
}

const emit = defineEmits(['login-success'])

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const { data, error: loginError, message } = await login({
      email: email.value,
      password: password.value
    })
    
    if (loginError) {
      error.value = message || 'فشل تسجيل الدخول. يرجى التحقق من بياناتك.'
      return
    }

    success.value = 'تم تسجيل الدخول بنجاح'
    
    // Wait for 1.5 seconds to show success message
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    emit('login-success')
    closeModal()
    await router.push('/')
    window.location.reload();
  } catch (e) {
    error.value = 'حدث خطأ أثناء تسجيل الدخول'
  } finally {
    loading.value = false
  }
}

const handleGoogleLogin = async () => {
  // Implement Google login logic
}

const handleFacebookLogin = async () => {
  // Implement Facebook login logic
}

const handleRegisterClick = () => {
  closeModal()
  // Small delay to ensure smooth transition between modals
  setTimeout(() => {
    emit('register-success')
  }, 100)
}

// Add check for existing session
// onMounted(() => {
//   if (process.client && localStorage.getItem('session-token')) {
//     router.push('/account')
//   }
// })

// Add listener for opening login modal
onMounted(() => {
  window.addEventListener('open-login-modal', openModal)
})

onUnmounted(() => {
  window.removeEventListener('open-login-modal', openModal)
})

defineExpose({ openModal, closeModal })

import logo from '~/assets/logo.png'
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
      <!-- Close button -->
      <div class="flex justify-end mb-4">
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          <Icon name="material-symbols:close" class="w-6 h-6" />
        </button>
      </div>

      <!-- Logo -->
      <div class="flex justify-center mb-6">
        <img :src="logo" alt="Logo" class="h-12" />
      </div>

      <!-- Title -->
      <h2 class="text-2xl font-bold text-center mb-8">تسجيل الدخول لحسابك</h2>

      <!-- Error message -->
      <div v-if="error" class="text-red-500 text-sm text-center mb-4">
        {{ error }}
      </div>

      <!-- Login form -->
      <form @submit.prevent="handleLogin" class="space-y-4 mb-6">
        <div>
          <input
            v-model="email"
            type="email"
            required
            :disabled="loading"
            placeholder="البريد الإلكتروني"
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
          <span v-else>تسجيل الدخول</span>
        </button>
      </form>

      <!-- Social login buttons -->
      <div class="space-y-4">
        <button
          @click="handleGoogleLogin"
          class="w-full flex items-center justify-center gap-2 border rounded-lg py-3 px-4 hover:bg-gray-50"
        >
          <Icon name="logos:google-icon" class="w-6 h-6" />
          <span>تسجيل الدخول باستخدام جوجل</span>
        </button>

        <button
          @click="handleFacebookLogin"
          class="w-full flex items-center justify-center gap-2 border rounded-lg py-3 px-4 hover:bg-gray-50"
        >
          <Icon name="logos:facebook" class="w-6 h-6" />
          <span>تسجيل الدخول باستخدام فيسبوك</span>
        </button>
      </div>

      <!-- Sign up text -->
      <p class="text-center mt-6 text-sm">
        عضو جديد في يازار سوريا؟ 
        <button 
          @click="handleRegisterClick" 
          class="text-red-600 hover:text-red-700"
        >
          تسجيل حساب جديد
        </button>
      </p>
    </div>
  </div>

  <!-- Add this for popup messages -->
  <div 
    v-if="showNotification" 
    class="fixed top-4 right-4 p-4 rounded-lg shadow-lg max-w-md z-50"
    :class="[error ? 'bg-red-100' : 'bg-green-100']"
  >
    <div class="flex items-center">
      <div v-if="error">
        <PhWarning 
          class="w-6 h-6 mr-2 text-red-500"
        />
      </div>
      <div v-else>
        <PhCheckCircle 
          class="w-6 h-6 mr-2 text-green-500"
        />
      </div>
      <p :class="[error ? 'text-red-700' : 'text-green-700']">
        {{ error || success }}
      </p>
    </div>
  </div>
</template> 