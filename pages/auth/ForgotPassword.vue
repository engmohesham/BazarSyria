<script setup>
import { ref } from 'vue'
import { useServices } from '~/composables/useServices'
import { PhWarning, PhCheckCircle } from '@phosphor-icons/vue'

const { forgetPassword, verifyForgetPasswordCode } = useServices()
const isOpen = ref(false)
const email = ref('')
const verificationCode = ref(['', '', '', ''])
const loading = ref(false)
const error = ref('')
const success = ref('')
const step = ref('email') // 'email', 'verification', 'password'
const newPassword = ref('')
const confirmPassword = ref('')

const openModal = () => {
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
  resetForm()
}

const resetForm = () => {
  email.value = ''
  verificationCode.value = ['', '', '', '']
  error.value = ''
  success.value = ''
  step.value = 'email'
  newPassword.value = ''
  confirmPassword.value = ''
}

const handleForgetPassword = async () => {
  if (!email.value) {
    error.value = 'الرجاء إدخال البريد الإلكتروني'
    return
  }

  loading.value = true
  try {
    const { error: apiError, message } = await forgetPassword({ 
      email: email.value 
    })
    
    if (apiError) {
      error.value = message || 'حدث خطأ أثناء إرسال رمز التحقق'
      return
    }

    success.value = message || 'تم إرسال رمز التحقق إلى بريدك الإلكتروني'
    step.value = 'verification'
  } catch (e) {
    error.value = 'حدث خطأ أثناء إرسال رمز التحقق'
  } finally {
    loading.value = false
  }
}

const handleCodeInput = (index, event) => {
  const value = event.target.value.replace(/[^0-9]/g, '') // يسمح فقط بالأرقام
  verificationCode.value[index] = value

  // التنقل للأمام عند الكتابة
  if (value && index < 3) {
    const inputs = document.querySelectorAll('.code-input')
    inputs[index + 1].focus()
  }
}

const handleCodeKeydown = (index, event) => {
  // التنقل للخلف عند الحذف
  if (event.key === 'Backspace') {
    if (!verificationCode.value[index] && index > 0) {
      const inputs = document.querySelectorAll('.code-input')
      verificationCode.value[index - 1] = ''
      inputs[index - 1].focus()
    } else {
      verificationCode.value[index] = ''
    }
  }
  // التنقل لليمين
  else if (event.key === 'ArrowRight' && index < 3) {
    const inputs = document.querySelectorAll('.code-input')
    inputs[index + 1].focus()
  }
  // التنقل لليسار
  else if (event.key === 'ArrowLeft' && index > 0) {
    const inputs = document.querySelectorAll('.code-input')
    inputs[index - 1].focus()
  }
}

const handleCodePaste = (event) => {
  event.preventDefault()
  const pastedData = event.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 4)
  
  if (pastedData) {
    const digits = pastedData.split('')
    digits.forEach((digit, index) => {
      if (index < 4) {
        verificationCode.value[index] = digit
      }
    })
    
    // التركيز على آخر خانة بعد اللصق
    if (digits.length === 4) {
      const inputs = document.querySelectorAll('.code-input')
      inputs[3].focus()
    }
  }
}

const handleVerifyCode = async () => {
  const code = verificationCode.value.join('')
  if (code.length !== 4) {
    error.value = 'الرجاء إدخال رمز التحقق كاملاً'
    return
  }

  loading.value = true
  try {
    const { error: apiError, message } = await verifyForgetPasswordCode({
      email: email.value,
      code: code
    })
    
    if (apiError) {
      error.value = message
      return
    }

    success.value = 'تم التحقق من الرمز بنجاح'
    step.value = 'password'
  } catch (e) {
    error.value = 'حدث خطأ أثناء التحقق من الرمز'
  } finally {
    loading.value = false
  }
}

const handleResetPassword = async () => {
  if (!newPassword.value) {
    error.value = 'الرجاء إدخال كلمة المرور الجديدة'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = 'كلمتا المرور غير متطابقتين'
    return
  }

  loading.value = true
  try {
    const { error: apiError, message } = await verifyForgetPasswordCode({
      email: email.value,
      code: verificationCode.value.join(''),
      password: newPassword.value,
      confirmPassword: confirmPassword.value
    })
    
    if (apiError) {
      error.value = message
      return
    }

    success.value = message || 'تم تغيير كلمة المرور بنجاح'
    setTimeout(() => {
      closeModal()
    }, 1500)
  } catch (e) {
    error.value = 'حدث خطأ أثناء تغيير كلمة المرور'
  } finally {
    loading.value = false
  }
}

const resendCode = () => {
  handleForgetPassword()
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
          <Icon name="material-symbols:close" class="w-6 h-6" />
        </button>
      </div>

      <!-- Logo -->
      <div class="flex justify-center mb-6">
        <img :src="logo" alt="Logo" class="h-12" />
      </div>

      <!-- Title -->
      <h2 class="text-2xl font-bold text-center mb-8">
        {{ 
          step === 'email' ? 'نسيت كلمة المرور' : 
          step === 'verification' ? 'تحقق من الرمز' :
          'تعيين كلمة المرور الجديدة'
        }}
      </h2>

      <!-- Error/Success message -->
      <div 
        v-if="error || success" 
        class="mb-4 p-4 rounded-lg"
        :class="[error ? 'bg-red-100' : 'bg-green-100']"
      >
        <div class="flex items-center">
          <component 
            :is="error ? PhWarning : PhCheckCircle"
            :size="24"
            :class="[error ? 'text-red-500' : 'text-green-500']"
            class="mr-2"
          />
          <p :class="[error ? 'text-red-700' : 'text-green-700']">
            {{ error || success }}
          </p>
        </div>
      </div>

      <!-- Email Form -->
      <form v-if="step === 'email'" @submit.prevent="handleForgetPassword" class="space-y-4">
        <div>
          <input
            v-model="email"
            type="email"
            required
            :disabled="loading"
            placeholder="البريد الإلكتروني"
            class="w-full border rounded-lg py-3 px-4 text-right"
            dir="rtl"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-green-600 text-white rounded-lg py-3 px-4 hover:bg-green-700 disabled:opacity-50"
        >
          <span v-if="loading">جاري الإرسال...</span>
          <span v-else>إرسال رمز التحقق</span>
        </button>
      </form>

      <!-- Verification Code Form -->
      <div v-else-if="step === 'verification'" class="space-y-6">
        <p class="text-center text-gray-600 text-sm">
          يرجى إدخال الرمز الذي تم إرساله إلى البريد
          <br>
          {{ email }}
        </p>

        <div class="flex justify-center gap-4" dir="ltr">
          <input
            v-for="index in 4"
            :key="index"
            v-model="verificationCode[index - 1]"
            type="text"
            inputmode="numeric"
            maxlength="1"
            class="code-input w-12 h-12 border rounded-lg text-center text-xl focus:border-green-500 focus:ring-1 focus:ring-green-500"
            @input="handleCodeInput(index - 1, $event)"
            @keydown="handleCodeKeydown(index - 1, $event)"
            @paste="handleCodePaste"
          />
        </div>

        <button
          @click="handleVerifyCode"
          :disabled="loading || verificationCode.some(v => !v)"
          class="w-full bg-green-600 text-white rounded-lg py-3 px-4 hover:bg-green-700 disabled:opacity-50"
        >
          <span v-if="loading">جاري التحقق...</span>
          <span v-else>تحقق من الرمز</span>
        </button>

        <p class="text-center text-sm">
          لم تستلم الرمز؟
          <button 
            @click="resendCode"
            class="text-green-600 hover:text-green-700"
          >
            إعادة إرسال رمز
          </button>
        </p>
      </div>

      <!-- Password Reset Form -->
      <form v-else-if="step === 'password'" @submit.prevent="handleResetPassword" class="space-y-4">
        <div>
          <input
            v-model="newPassword"
            type="password"
            required
            :disabled="loading"
            placeholder="كلمة المرور الجديدة"
            class="w-full border rounded-lg py-3 px-4 text-right"
            dir="rtl"
          />
        </div>

        <div>
          <input
            v-model="confirmPassword"
            type="password"
            required
            :disabled="loading"
            placeholder="تأكيد كلمة المرور الجديدة"
            class="w-full border rounded-lg py-3 px-4 text-right"
            dir="rtl"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-green-600 text-white rounded-lg py-3 px-4 hover:bg-green-700 disabled:opacity-50"
        >
          <span v-if="loading">جاري الحفظ...</span>
          <span v-else>تغيير كلمة المرور</span>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.dir-rtl {
  direction: rtl;
}

/* منع السهم في input type number */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}

/* تحسين مظهر التركيز */
input:focus {
  outline: none;
}
</style> 