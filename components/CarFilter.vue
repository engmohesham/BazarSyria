<template>
  <div>
    <CategoryFilters
      :active-category="activeCategory"
      @category-change="handleCategoryChange"
    />
    <div class="bg-gray-100" dir="rtl">
      <div class="container mx-auto px-4 py-6">
        <div class="flex flex-col lg:flex-row gap-6">
          <!-- Filters - Right Side -->
          <div class="lg:w-1/4">
            <FilterSection title="البحث" v-if="activeCategory === 'cars'">
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
              v-if="activeCategory === 'cars'"
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
            <template v-if="activeCategory === 'mobile'">
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
              <div
                v-for="item in currentData"
                :key="item.id"
                class="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div class="flex flex-col md:flex-row">
                  <div class="md:w-1/3 relative">
                    <img
                      :src="item.image"
                      :alt="item.title"
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
                        {{ item.price }}
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
                    <h4 class="text-xl font-semibold mb-3">{{ item.title }}</h4>
                    <div class="space-y-3 text-sm text-gray-600">
                      <div class="flex items-center gap-2">
                        <span class="font-medium">{{ item.details }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <Icon name="ph:map-pin" class="w-4 h-4" />
                        <span>{{ item.location }}</span>
                      </div>
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <Icon name="ph:clock" class="w-4 h-4" />
                          <span>{{ item.timeAgo }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                          <Icon name="ph:user" class="w-4 h-4" />
                          <span>عضو {{ item.user }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import CategoryFilters from "./CarFilter/CategoryFilters.vue";
import FilterSection from "./CarFilter/FilterSection.vue";
import PriceRangeFilter from "./CarFilter/PriceRangeFilter.vue";
import {
  carMockData,
  realEstateMockData,
  mobileMockData,
  jobsMockData,
  electronicsMockData,
  carBrands,
  filterOptions,
} from "@/data/mockData";

interface Category {
  id: string;
  name: string;
  href: string;
  isActive: boolean;
}

const activeCategory = ref("cars");
const priceRange = ref({ min: "", max: "" });
const currentData = ref(carMockData);

const handleCategoryChange = (category: Category) => {
  activeCategory.value = category.id;
  switch (category.id) {
    case "cars":
      currentData.value = carMockData;
      break;
    case "real-estate":
      currentData.value = realEstateMockData;
      break;
    case "mobile":
      currentData.value = mobileMockData;
      break;
    case "jobs":
      currentData.value = jobsMockData;
      break;
    case "electronics":
      currentData.value = electronicsMockData;
      break;
    default:
      currentData.value = [];
  }
};
</script>
