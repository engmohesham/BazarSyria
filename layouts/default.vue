<template>
  <div>
    <Header 
      @open-login="openLogin" 
      @open-register="openRegister"
      :isLoggedIn="isLoggedIn" 
    />
    <slot />
    <Footer />
    <Login 
      ref="loginModal" 
      @login-success="handleLoginSuccess"
      @register-success="openRegister"
    />
    <Register 
      ref="registerModal" 
      @register-success="openLogin"
    />
  </div>
</template>

<script setup>
import Login from '~/pages/auth/Login.vue'
import Register from '~/pages/auth/Register.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const loginModal = ref(null)
const registerModal = ref(null)
const isLoggedIn = ref(false)

// Check initial login state and set up invalid token listener
onMounted(() => {
  const checkLoginState = () => {
    isLoggedIn.value = !!localStorage.getItem('session-token')
  }
  
  // Initial check
  checkLoginState()
  
  const handleInvalidToken = () => {
    isLoggedIn.value = false
    localStorage.removeItem('session-token')
    router.push('/')
  }

  window.addEventListener('invalid-token', handleInvalidToken)
  
  // Clean up event listener
  onUnmounted(() => {
    window.removeEventListener('invalid-token', handleInvalidToken)
  })
})

const openLogin = () => {
  loginModal.value?.openModal()
}

const openRegister = () => {
  registerModal.value?.openModal()
}

const handleLoginSuccess = () => {
  isLoggedIn.value = true
}

const handleRegisterSuccess = () => {
  // Optionally handle registration success
  openLogin() // Open login modal after successful registration
}

definePageMeta({
  middleware: "auth",
});
</script>
