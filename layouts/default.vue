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
      v-if="showLoginModal"
      @close="closeLogin"
      @login-success="handleLoginSuccess"
      @register-success="openRegister"
    />
    <Register 
      v-if="showRegisterModal"
      @close="closeRegister"
      @register-success="openLogin"
    />
  </div>
</template>

<script setup>
import { provide } from 'vue'
import Login from '~/pages/auth/Login.vue'
import Register from '~/pages/auth/Register.vue'

const route = useRoute()
const router = useRouter()
const showLoginModal = ref(false)
const showRegisterModal = ref(false)
const isLoggedIn = ref(false)

// Provide these values to all child components
provide('isLoggedIn', isLoggedIn)
provide('showLoginModal', showLoginModal)
provide('showRegisterModal', showRegisterModal)

// Check initial login state and modal state
onMounted(() => {
  isLoggedIn.value = !!localStorage.getItem('session-token')
  
  // Show login modal if redirected from protected route
  if (route.query.showLogin === 'true') {
    showLoginModal.value = true
    // Remove query parameter without page reload
    router.replace({ query: {} })
  }
})

const openLogin = () => {
  showLoginModal.value = true
  showRegisterModal.value = false
}

const closeLogin = () => {
  showLoginModal.value = false
}

const openRegister = () => {
  showRegisterModal.value = true
  showLoginModal.value = false
}

const closeRegister = () => {
  showRegisterModal.value = false
}

const handleLoginSuccess = () => {
  isLoggedIn.value = true
  showLoginModal.value = false
  
  // If there was a previous route (stored in query), redirect there
  if (route.query.redirect) {
    router.push(route.query.redirect)
  }
}

// Watch for auth state changes
watch(() => isLoggedIn.value, (newValue) => {
  if (!newValue) {
    // Handle logout - could add additional cleanup here
    router.push('/')
  }
})

// Provide these methods to all child components
provide('openLogin', openLogin)
provide('closeLogin', closeLogin)
provide('openRegister', openRegister)
provide('closeRegister', closeRegister)
</script>
