<template>
  <div>
    <CategoryFilters
      :active-category="activeCategory"
      @category-change="handleCategoryChange"
    />
    <div class="bg-gray-100" dir="rtl">
      <div class="container md:w-[90%] mx-auto px-4 py-6">
        <div class="flex flex-col lg:flex-row gap-6">
          <!-- Filters - Right Side -->
          <div class="lg:w-1/4">
            <FilterSection title="البحث">
              <div class="relative">
                <input
                  type="text"
                  placeholder="البحث عن سيارة..."
                  class="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg text-right"
                />
                <Icon
                  name="ph:magnifying-glass"
                  class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                />
              </div>
            </FilterSection>

            <FilterSection
              title="ماركة السيارة"
            >
              <div class="grid grid-cols-3 gap-4">
                <button
                  v-for="brand in carBrands"
                  :key="brand.name"
                  class="flex flex-col items-center justify-center p-2 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <img
                    :src="brand.logo"
                    :alt="brand.name"
                    class="w-12 h-12 object-contain"
                  />
                </button>
              </div>
            </FilterSection>

            <FilterSection title="نطاق السعر">
              <PriceRangeFilter v-model="priceRange" />
            </FilterSection>

            <!-- Category-specific filters -->
            <template>
              <FilterSection title="الماركة">
                <div class="space-y-2">
                  <label
                    v-for="brand in filterOptions.mobileBrands"
                    :key="brand"
                    class="flex items-center space-x-reverse space-x-2"
                  >
                    <input type="checkbox" class="rounded text-green-600" />
                    <span>{{ brand }}</span>
                  </label>
                </div>
              </FilterSection>
              <FilterSection title="الحالة">
                <div class="space-y-2">
                  <label
                    v-for="condition in filterOptions.mobileConditions"
                    :key="condition"
                    class="flex items-center space-x-reverse space-x-2"
                  >
                    <input
                      type="radio"
                      name="condition"
                      class="text-green-600"
                    />
                    <span>{{ condition }}</span>
                  </label>
                </div>
              </FilterSection>
            </template>

            <template v-if="activeCategory === 'jobs'">
              <FilterSection title="نوع الوظيفة">
                <div class="space-y-2">
                  <label
                    v-for="type in filterOptions.jobTypes"
                    :key="type"
                    class="flex items-center space-x-reverse space-x-2"
                  >
                    <input type="checkbox" class="rounded text-green-600" />
                    <span>{{ type }}</span>
                  </label>
                </div>
              </FilterSection>
              <FilterSection title="المجال">
                <div class="space-y-2">
                  <label
                    v-for="field in filterOptions.jobFields"
                    :key="field"
                    class="flex items-center space-x-reverse space-x-2"
                  >
                    <input type="checkbox" class="rounded text-green-600" />
                    <span>{{ field }}</span>
                  </label>
                </div>
              </FilterSection>
            </template>

            <template v-if="activeCategory === 'electronics'">
              <FilterSection title="الفئة">
                <div class="space-y-2">
                  <label
                    v-for="category in filterOptions.electronicsCategories"
                    :key="category"
                    class="flex items-center space-x-reverse space-x-2"
                  >
                    <input type="checkbox" class="rounded text-green-600" />
                    <span>{{ category }}</span>
                  </label>
                </div>
              </FilterSection>
            </template>
          </div>

          <!-- Listings - Left Side -->
          <div class="lg:w-3/4">
            <div class="space-y-4">
              <ProductCard
                v-for="item in currentData"
                :key="item._id"
                :product="item"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import CategoryFilters from "./CarFilter/CategoryFilters.vue";
import FilterSection from "./CarFilter/FilterSection.vue";
import PriceRangeFilter from "./CarFilter/PriceRangeFilter.vue";
import {
  carBrands,
  filterOptions,
} from "@/data/mockData";
import ProductCard from "./ProductCard.vue";

const activeCategory = ref("all");
const priceRange = ref({ min: "", max: "" });
const products = ref(null);
const error = ref(null);

// Fetch products from API with error handling
try {
  const { data, error: fetchError } = await useFetch(
    "https://bazar-syria.vercel.app/products/all"
  );
  
  if (fetchError.value) {
    throw new Error(fetchError.value);
  }
  
  products.value = data.value;
} catch (err) {
  console.error("Failed to fetch products:", err);
  error.value = "Failed to load products. Please try again later.";
}

// تحديث currentData لعرض جميع المنتجات أو تصفيتها حسب الفئة
const currentData = computed(() => {
  if (!products.value?.products) return [];
  
  if (activeCategory.value === 'all') {
    return products.value.products;
  }
  
  return products.value.products.filter(
    (product) => product.categoryId === activeCategory.value
  );
});

const handleCategoryChange = (category) => {
  activeCategory.value = category._id;
};
</script>
