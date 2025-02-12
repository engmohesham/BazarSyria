<template>
  <div class="bg-gray-100" dir="rtl">
    <div class="container w-[90%] mx-auto px-4 py-6">
      <HeadNav
        :mainNav="productData.categoryId"
        :subNav="productData.subCategoryId"
        :current="productData.name"
      />
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="md:col-span-2">
          <div
            v-if="productData"
            class="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <!-- Image Gallery Component -->
            <ProductGallery
              :mainImage="productData.image"
              :gallery="productData.gallery"
              :title="productData.name"
            />

            <!-- Product Header Component -->
            <ProductHeader
              :title="productData.name"
              :price="productData.price"
              :location="productData.location"
              :timeAgo="productData.timeAgo"
            />

            <!-- Product Specifications Component -->
            <!-- <ProductSpecifications :specifications="specifications" /> -->
            <!-- المواصفات البارزة -->
            <div class="border-t border-b py-6 m-6">
              <h3 class="text-lg font-semibold mb-4">المواصفات البارزة</h3>
              <div class="grid grid-cols-2 md:grid-cols-6 gap-4 w-full">
                <div
                  v-for="spec in specifications"
                  :key="spec.label"
                  class="flex flex-col items-center text-center"
                >
                  <Icon :name="spec.icon" class="w-8 h-8 text-green-600 mb-2" />
                  <span class="text-sm text-gray-600">{{ spec.label }}</span>
                  <span class="font-medium">{{ spec.value }}</span>
                </div>
              </div>
            </div>

            <!-- التفاصيل -->
            <div class="m-6">
              <h3 class="text-lg font-semibold mb-4">التفاصيل</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div class="flex justify-between py-2 border-b">
                  <span class="text-gray-600">العلامة التجارية</span>
                  <span>مرسيدس</span>
                </div>
                <div class="flex justify-between py-2 border-b">
                  <span class="text-gray-600">موديل</span>
                  <span>اي 200</span>
                </div>
                <div class="flex justify-between py-2 border-b">
                  <span class="text-gray-600">هيكل السيارة</span>
                  <span>سيدان</span>
                </div>
                <div class="flex justify-between py-2 border-b">
                  <span class="text-gray-600">الطاقة (قوة حصان)</span>
                  <span>190</span>
                </div>
                <div class="flex justify-between py-2 border-b">
                  <span class="text-gray-600">تكييف</span>
                  <span>تكييف هواء أوتوماتيكي 4 أقسام</span>
                </div>
                <div class="flex justify-between py-2 border-b">
                  <span class="text-gray-600">اللون</span>
                  <span>أبيض</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Left Sidebar -->
        <div class="md:col-span-1 relative">
          <UserProfile />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import UserProfile from "@/components/SingleProduct/UserProfile.vue";
import ProductGallery from "@/components/SingleProduct/ProductGallery.vue";
import ProductHeader from "@/components/SingleProduct/ProductHeader.vue";
import ProductSpecifications from "@/components/SingleProduct/ProductSpecifications.vue";
import ContactButtons from "@/components/SingleProduct/ContactButtons.vue";
import { useRoute } from 'vue-router'

const route = useRoute();
const { getAdById } = useServices();

// Fetch product data using the new API endpoint
const { data: adData } = await getAdById(route.params.id);

console.log(adData.advertisement);
// Transform API data into component format
const productData = computed(() => {
  if (!adData.advertisement) return null;
  return {
    name: adData.advertisement.title,
    price: adData.advertisement.price,
    location: adData.advertisement.location,
    timeAgo: adData.advertisement.createdAt, // You might want to format this
    description: adData.advertisement.description,
    image: adData.advertisement.mainImage,
    gallery: adData.advertisement.images || [],
    categoryId: adData.advertisement.category,
    subCategoryId: adData.advertisement.subcategory
  };
});

// Transform specifications based on API data
const specifications = computed(() => [
  {
    icon: "ph:car",
    label: "الموديل",
    value: adData.value?.model || "",
  },
  {
    icon: "ph:gauge",
    label: "عداد",
    value: adData.value?.mileage || "0",
  },
  {
    icon: "ph:calendar",
    label: "سنة",
    value: adData.value?.year || "",
  },
  {
    icon: "ph:gas-pump",
    label: "نوع الوقود",
    value: adData.value?.fuelType || "",
  },
  {
    icon: "ph:gear",
    label: "ناقل الحركة",
    value: adData.value?.transmission || "",
  },
  {
    icon: "ph:user",
    label: "الحالة",
    value: adData.value?.condition || "",
  },
]);
</script>
