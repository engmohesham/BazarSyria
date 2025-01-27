<script setup lang="ts">
const router = useRouter()

definePageMeta({
  middleware: "auth",
});

const handleLogout = () => {
  if (process.client) {
    localStorage.removeItem('session-token')
    router.push('/login')
  }
}
</script>

<template>
  <div class="p-8">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Welcome to your account</h1>
      <button 
        @click="handleLogout"
        class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  </div>
</template>
