<template>
  <NuxtLink :to="`/products/${product._id}`" class="block">
    <div
      class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      <div class="flex flex-col md:flex-row">
        <div class="md:w-1/3 relative">
          <img
            :src="product.image"
            :alt="product.name"
            class="w-full h-48 md:h-full object-cover"
          />
          <button
            class="absolute top-3 right-3 p-2 flex justify-center items-center rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
          >
            <Icon name="ph:heart" class="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div class="md:w-2/3 p-4">
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-2xl font-bold text-green-600">
              {{ product.price }}
            </h3>
            <div class="flex gap-2">
              <button
                class="px-3 py-1.5 text-xs font-medium bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
              >
                المحادثة
              </button>
              <button
                class="px-3 py-1.5 text-xs font-medium bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
              >
                مخالفة
              </button>
            </div>
          </div>
          <h4 class="text-xl font-semibold mb-3">{{ product.name }}</h4>
          <div class="space-y-3 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <span class="font-medium">{{ product.details }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="ph:map-pin" class="w-4 h-4" />
              <span>{{ product.location }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Icon name="ph:clock" class="w-4 h-4" />
                <span>{{ formatDate(product.createdAt) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="ph:user" class="w-4 h-4" />
                <span>عضو {{ product.user }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
interface Product {
  _id: string;
  categoryId: string;
  createdAt: string;
  description: string;
  modifiedAt: string;
  name: string;
  subCategoryId: string;
  __v: number;
}

const props = defineProps<{
  product: Product;
}>();

// Format date for display
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("ar-SA");
};
</script>
