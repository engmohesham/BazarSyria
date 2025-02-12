<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 text-center">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          تأكيد البريد الإلكتروني
        </h2>
      </div>

      <div v-if="loading" class="text-gray-600">
        جاري التحقق من البريد الإلكتروني...
      </div>

      <div v-if="error" class="text-red-600 mb-4">
        {{ error }}
      </div>
      
      <div v-if="success" class="text-green-600 mb-4">
        {{ success }}
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const loginModal = ref(null);

const loading = ref(true);
const error = ref('');
const success = ref('');

// Auto verify on page load
onMounted(async () => {
  try {
    const token = route.params.id;
    const response = await $fetch('https://pzsyria.com/api/user/verify-account/' + token, {
      method: 'GET',
    });

    if (response.error) {
      error.value = response.message || 'فشل في تأكيد البريد الإلكتروني';
      return;
    }

    success.value = response.message || 'تم تأكيد البريد الإلكتروني بنجاح';
    
    // Redirect to home and open login modal after 2 seconds
    setTimeout(() => {
      router.push('/').then(() => {
        // Emit event to open login modal
        const event = new CustomEvent('open-login-modal');
        window.dispatchEvent(event);
      });
    }, 2000);

  } catch (e) {
    error.value = 'حدث خطأ أثناء تأكيد البريد الإلكتروني';
    console.error('Email verification error:', e);
  } finally {
    loading.value = false;
  }
});
</script>
