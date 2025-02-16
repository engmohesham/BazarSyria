<script setup>
import { ref, watch } from 'vue';
import { PhWarning, PhCheckCircle } from '@phosphor-icons/vue';

const showNotification = ref(false);
const message = ref('');
const type = ref('success'); // 'success' or 'error'

// استماع لأحداث الإشعارات
onMounted(() => {
  window.addEventListener('show-notification', handleNotification);
});

onUnmounted(() => {
  window.removeEventListener('show-notification', handleNotification);
});

const handleNotification = (event) => {
  message.value = event.detail.message;
  type.value = event.detail.type;
  showNotification.value = true;

  // إخفاء الإشعار بعد 1.5 ثانية
  setTimeout(() => {
    showNotification.value = false;
  }, 1500);
};
</script>

<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="showNotification" 
      class="fixed top-4 right-4 p-4 rounded-lg shadow-lg max-w-md z-50"
      :class="[type === 'error' ? 'bg-red-100' : 'bg-green-100']"
    >
      <div class="flex items-center">
        <div v-if="type === 'error'">
          <PhWarning 
            class="w-6 h-6 ml-2 text-red-500"
          />
        </div>
        <div v-else>
          <PhCheckCircle 
            class="w-6 h-6 ml-2 text-green-500"
          />
        </div>
        <p :class="[type === 'error' ? 'text-red-700' : 'text-green-700']">
          {{ message }}
        </p>
      </div>
    </div>
  </Transition>
</template> 