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
            <ProductSpecifications :specifications="specifications" />
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
import car1 from "~/assets/cars/car.jpg";
import car2 from "~/assets/cars/car2.jpg";
import car3 from "~/assets/cars/car3.jpg";

const route = useRoute();
const { data: product } = await useFetch(
  `https://bazar-syria.vercel.app/products/${route.params.id}`
);
// const productData = product._value.product;

// Example specifications - adjust based on your API data
const specifications = computed(() => [
  {
    icon: "ph:car",
    label: "الموديل",
    value: productData.description || "",
  },
  {
    icon: "ph:gauge",
    label: "عداد",
    value: "90000",
  },
  {
    icon: "ph:calendar",
    label: "سنة",
    value: "2023",
  },
  {
    icon: "ph:gas-pump",
    label: "نوع الوقود",
    value: "بنزين",
  },
  {
    icon: "ph:gear",
    label: "ناقل الحركة",
    value: "اوتوماتيك",
  },
  {
    icon: "ph:user",
    label: "مستعمل",
    value: "مستعمل",
  },
]);

const productData = {
  name: "Test Product",
  price: "15,000,000 ل.س",
  location: "دمشق",
  timeAgo: "3 أيام",
  description: "وصف تجريبي للمنتج",
  // Update these paths according to your assets directory structure
  image: car1,
  gallery: [car1, car2, car3],
};
</script>
