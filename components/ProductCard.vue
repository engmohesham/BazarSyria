<template>
  <NuxtLink :to="`/products/${product._id}`" class="block">
    <div
      class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      <div class="flex flex-col md:flex-row">
        <div class="md:w-1/3 relative">
          <img
            :src="product.gallery?.[0] || 'https://via.placeholder.com/300'"
            :alt="product.advTitle"
            class="w-full h-48 md:h-full object-cover"
          />
          <button
            class="absolute top-3 right-3 p-2 flex justify-center items-center rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
          >
            <PhHeart class="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div class="md:w-2/3 p-4">
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-2xl font-bold text-green-600">
              {{ product.price }} ل.س
            </h3>
            <div class="flex gap-2">
              <button
                class="px-3 py-1.5 text-xs font-medium bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
              >
                ابلاغ
              </button>
            </div>
          </div>
          <h4 class="text-xl font-semibold mb-3">{{ product.advTitle }}</h4>
          <div class="space-y-3 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <span class="font-medium">{{ product.advDescription }}</span>
            </div>
            <div class="flex items-center gap-2">
              <PhMapPin class="w-4 h-4" />
              <span>{{ formatLocation(product.location) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <PhClock class="w-4 h-4" />
                <span>{{ formatDate(product.createdAt) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <PhUser class="w-4 h-4" />
                <span>عضو {{ product.creator }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
import { 
  PhHeart,
  PhMapPin,
  PhClock,
  PhUser
} from '@phosphor-icons/vue';

const props = defineProps({
  product: {
    type: Object,
    required: true,
    default: () => ({
      _id: '',
      advTitle: '',
      advDescription: '',
      category: '',
      contact: 'chat',
      createdAt: '',
      creator: '',
      gallery: [],
      location: {
        lat: '',
        long: ''
      },
      modifiedAt: '',
      price: 0,
      specialProperties: [],
      subCategory: '',
      __v: 0
    })
  }
});

// تنسيق التاريخ
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("ar-SA");
};

// تنسيق الموقع
const formatLocation = (location) => {
  if (!location) return '';
  return `${location.lat}, ${location.long}`;
};
</script>
