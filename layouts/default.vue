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

const loginModal = ref(null)
const registerModal = ref(null)
const isLoggedIn = ref(false)

// Check initial login state
onMounted(() => {
  isLoggedIn.value = !!localStorage.getItem('session-token')
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
</script>
