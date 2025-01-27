<script setup lang="ts">
const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    // Using Nuxt's useFetch
    const { data, error: apiError } = await useFetch('https://taste-back.cowdly.com/api/users/login/', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
      },
    })

    if (apiError.value) {
      error.value = 'Login failed. Please check your credentials.'
      return
    }

    // Assuming your API returns a token
    const token = data.value?.token
    if (token && process.client) {
      localStorage.setItem('session-token', token)
      // Using Nuxt router
      await router.push('/account')
    }
  } catch (e) {
    error.value = 'An error occurred during login'
  } finally {
    loading.value = false
  }
}

// If user is already logged in, redirect to account
onMounted(() => {
  if (process.client && localStorage.getItem('session-token')) {
    router.push('/account')
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
      <h2 class="text-center text-3xl font-bold">Sign in to your account</h2>
      
      <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
        <div v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </div>
        
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            :disabled="loading"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            :disabled="loading"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          <span v-if="loading">Loading...</span>
          <span v-else>Sign in</span>
        </button>
      </form>
    </div>
  </div>
</template>
