<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <!-- Title Section -->
    <div class="flex flex-col gap-6">
      <div class="flex justify-between items-start">
        <h1 class="text-2xl font-bold text-gray-900 leading-tight">
          {{ title }}
        </h1>
        <!-- Share Button -->

        <div class="flex items-center gap-5">
          <div class="flex flex-col items-end">
            <div class="text-3xl font-bold text-green-600">
              {{ price }}
              <span class="text-lg font-medium">ل.س</span>
            </div>
            <!-- <div class="text-xs text-gray-500 mt-1">السعر قابل للتفاوض</div> -->
          </div>
          <button
            @click="shareProduct"
            class="mr-auto flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
          >
            <div class="bg-green-50 p-2 rounded-full">
              <Icon name="ph:share" class="w-5 h-5" />
            </div>
            <span class="text-sm font-medium">مشاركة</span>
          </button>
        </div>
      </div>

      <!-- Location and Time Info -->
      <div class="flex flex-col items-start gap-6 text-gray-600 border-t pt-4">
        <div class="flex items-center gap-2">
          <div class="bg-gray-50 p-2 rounded-full">
            <Icon name="ph:map-pin" class="w-5 h-5 text-green-600" />
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500">الموقع</span>
            <span class="text-base">{{ formatLocation }}</span>
            <span class="text-sm text-gray-500 mt-1">{{
              locationDetails
            }}</span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <div class="bg-gray-50 p-2 rounded-full">
            <Icon name="ph:clock" class="w-5 h-5 text-green-600" />
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500">تاريخ النشر</span>
            <span class="text-base">{{ timeAgo }}</span>
          </div>
        </div>
      </div>

      <!-- Tags Section -->
      <div class="flex flex-wrap gap-2 mt-2">
        <span
          v-if="isNew"
          class="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium"
        >
          جديد
        </span>
        <span class="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-sm">
          رقم الإعلان: #{{ adNumber }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: String,
  price: String,
  location: {
    type: Object,
    default: () => ({
      city: "",
      region: "",
      addressDetails: "",
      lat: "",
      long: "",
    }),
  },
  timeAgo: String,
  isNew: {
    type: Boolean,
    default: false,
  },
  adNumber: {
    type: String,
    default: "123456",
  },
});

// تنسيق الموقع الرئيسي (المدينة والمنطقة)
const formatLocation = computed(() => {
  const city = props.location.city || "";
  const region = props.location.region || "";
  return [city, region].filter(Boolean).join("، ");
});

// تفاصيل العنوان
const locationDetails = computed(() => {
  return props.location.addressDetails || "";
});

const shareProduct = () => {
  if (navigator.share) {
    navigator
      .share({
        title: props.title,
        text: `${props.title} - ${props.price} ل.س`,
        url: window.location.href,
      })
      .catch(console.error);
  }
};
</script>

<style scoped>
.flex-col {
  transition: all 0.3s ease;
}

button:hover .bg-green-50 {
  background-color: rgb(22 163 74 / 0.2);
}
</style>
