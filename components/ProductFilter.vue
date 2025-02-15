<template>
  <div>
    <CategoryFilters
      :active-category="activeCategory"
      :active-subcategory="activeSubcategory"
      @update:category="activeCategory = $event"
      @update:subcategory="activeSubcategory = $event"
    />
    <div class="bg-gray-100" dir="rtl">
      <div class="container md:w-[90%] mx-auto px-4 py-6">
        <div class="flex flex-col lg:flex-row gap-6">
          <!-- Filters - Right Side -->
          <div class="lg:w-1/4">
            <FilterSection title="البحث">
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="البحث عن سيارة..."
                  class="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg text-right"
                  @input="handleSearch"
                />
                <Icon
                  name="ph:magnifying-glass"
                  class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                />
              </div>
            </FilterSection>

            <!-- <FilterSection
              v-if="tradeMarks.length > 0"
              :title="categoryData?.category?.name || 'الماركة'"
            >
              <div class="space-y-2">
                <label
                  v-for="brand in tradeMarks"
                  :key="brand"
                  class="flex items-center space-x-reverse space-x-2"
                >
                  <input
                    type="checkbox"
                    :checked="selectedBrands.includes(brand)"
                    @change="handleBrandChange(brand)"
                    class="rounded text-green-600"
                  />
                  <span>{{ brand }}</span>
                </label>
              </div>
            </FilterSection> -->

            <FilterSection title="نطاق السعر">
              <PriceRangeFilter v-model="priceRange" />
            </FilterSection>

            <!-- Category-specific filters -->
            <!-- <template>
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
            </template> -->

            <template v-if="activeCategory === 'jobs'">
              <FilterSection title="نوع الوظيفة">
                <div class="space-y-2">
                  <label
                    v-for="type in filterOptions.jobTypes"
                    :key="type"
                    class="flex items-center space-x-reverse space-x-2"
                  >
                    <input
                      type="checkbox"
                      :checked="selectedJobTypes.includes(type)"
                      @change="handleJobTypeChange(type)"
                      class="rounded text-green-600"
                    />
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
                    <input
                      type="checkbox"
                      :checked="selectedJobFields.includes(field)"
                      @change="handleJobFieldChange(field)"
                      class="rounded text-green-600"
                    />
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
                    <input
                      type="checkbox"
                      :checked="selectedElectronicsCategories.includes(category)"
                      @change="handleElectronicsCategoryChange(category)"
                      class="rounded text-green-600"
                    />
                    <span>{{ category }}</span>
                  </label>
                </div>
              </FilterSection>
            </template>

            <!-- إضافة الفلاتر الخاصة -->
            <template v-if="specialProperties.length > 0">
              <FilterSection 
                v-for="property in specialProperties" 
                :key="property.property"
                :title="property.property"
              >
                <!-- Dropdown Filter -->
                <div v-if="property.type === 'dropdown'" class="space-y-2">
                  <select
                    v-model="selectedProperties[property.property]"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg text-right"
                    @change="handlePropertyChange(property, $event.target.value)"
                  >
                    <option value="">اختر {{ property.property }}</option>
                    <option 
                      v-for="value in property.values" 
                      :key="value" 
                      :value="value"
                    >
                      {{ value }}
                    </option>
                  </select>
                </div>

                <!-- Radio Filter -->
                <div v-if="property.type === 'radio'" class="space-y-2">
                  <label
                    v-for="value in property.values"
                    :key="value"
                    class="flex items-center space-x-reverse space-x-2"
                  >
                    <input
                      type="radio"
                      :name="property.property"
                      :value="value"
                      v-model="selectedProperties[property.property]"
                      @change="handlePropertyChange(property, value)"
                      class="text-green-600"
                    />
                    <span>{{ value }}</span>
                  </label>
                </div>

                <!-- Text Filter -->
                <div v-if="property.type === 'text'" class="space-y-2">
                  <input
                    type="text"
                    v-model="selectedProperties[property.property]"
                    :placeholder="`ادخل ${property.property}`"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg text-right"
                    @input="handlePropertyChange(property, $event.target.value)"
                  />
                </div>
              </FilterSection>
            </template>

            <!-- قسم الماركات -->
            <template v-if="activeCategory !== 'all' && categoryData?.category?.tradeMarks?.length > 0">
              <FilterSection title="الماركة">
                <div class="grid grid-cols-2 gap-3">
                  <div
                    v-for="(tradeMark, index) in categoryData.category.tradeMarks"
                    :key="index"
                    @click="handleTradeMarkChange(tradeMark)"
                    class="relative cursor-pointer rounded-lg border-2 transition-all duration-200"
                    :class="[
                      selectedTradeMarks.includes(tradeMark)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-200'
                    ]"
                  >
                    <div class="p-3 flex flex-col items-center space-y-2">
                      <!-- صورة الماركة -->
                      <img 
                        :src="getTradeMarkImage(tradeMark)"
                        :alt="tradeMark"
                        class="w-12 h-12 object-contain"
                        @error="handleImageError"
                      />
                      <!-- اسم الماركة -->
                      <span class="text-sm text-gray-700 text-center">{{ tradeMark }}</span>
                      <!-- علامة الاختيار -->
                      <div 
                        v-if="selectedTradeMarks.includes(tradeMark)"
                        class="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                      >
                        <Icon 
                          name="ph:check-bold" 
                          class="w-3 h-3 text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </FilterSection>
            </template>
          </div>

          <!-- Listings - Left Side -->
          <div class="lg:w-3/4">
            <div v-if="isLoading" class="text-center py-4">
              جاري التحميل...
            </div>
            <div v-else-if="error" class="text-red-500 text-center py-4">
              {{ error }}
            </div>
            <div v-else class="space-y-4">
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
import { ref, computed, watch, onMounted } from "vue";
import CategoryFilters from "./CarFilter/CategoryFilters.vue";
import FilterSection from "./CarFilter/FilterSection.vue";
import PriceRangeFilter from "./CarFilter/PriceRangeFilter.vue";
import {
  carBrands,
  filterOptions,
} from "@/data/mockData";
import ProductCard from "./ProductCard.vue";
// استيراد الصور من مجلد assets
import toyotaLogo from '~/assets/trademarks/toyota.png';
import hondaLogo from '~/assets/trademarks/honda.png';
import bmwLogo from '~/assets/trademarks/bmw.png';
import mercedesLogo from '~/assets/trademarks/mercedes.png';
import audiLogo from '~/assets/trademarks/audi.png';
import volkswagenLogo from '~/assets/trademarks/volkswagen.png';
import nissanLogo from '~/assets/trademarks/nissan.png';
import hyundaiLogo from '~/assets/trademarks/hyundai.png';
import kiaLogo from '~/assets/trademarks/kia.png';
import mazdaLogo from '~/assets/trademarks/mazda.png';

const activeCategory = ref("all");
const activeSubcategory = ref("");
const priceRange = ref({ min: "", max: "" });
const products = ref(null);
const error = ref(null);
const isLoading = ref(false);

// إضافة المتغيرات الجديدة
const searchQuery = ref("");
const selectedBrands = ref([]);
const selectedConditions = ref([]);
const selectedJobTypes = ref([]);
const selectedJobFields = ref([]);
const selectedElectronicsCategories = ref([]);

// تعديل المتغيرات للماركات
const categoryData = ref(null)
const specialProperties = ref([])
const tradeMarks = computed(() => {
  if (activeCategory.value === 'all') return []
  return categoryData.value?.category?.tradeMarks || []
})

// إضافة متغيرات للفلترة حسب الخصائص الخاصة
const selectedProperties = ref({});

// إضافة متغير للماركات المحددة
const selectedTradeMarks = ref([]);

// كائن يحتوي على الصور المحلية للماركات
const tradeMarkImages = {
  'Toyota': toyotaLogo,
  'Honda': hondaLogo,
  'BMW': bmwLogo,
  'Mercedes': mercedesLogo,
  'Audi': audiLogo,
  'Volkswagen': volkswagenLogo,
  'Nissan': nissanLogo,
  'Hyundai': hyundaiLogo,
  'Kia': kiaLogo,
  'Mazda': mazdaLogo
};

// تعديل دالة جلب المنتجات لتشمل بيانات القسم والماركات
const fetchProducts = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    let response;
    if (activeCategory.value === "all") {
      response = await fetch("https://pzsyria.com/api/advertisement/all");
    } else {
      let url = `https://pzsyria.com/api/advertisement/certain/categories?category=${activeCategory.value}`;
      if (activeSubcategory.value) {
        url += `&subcategory=${activeSubcategory.value}`;
      }
      response = await fetch(url);
    }
    
    const data = await response.json();
    products.value = data;

    // جلب بيانات القسم والماركات
    if (activeCategory.value !== 'all') {
      const categoryResponse = await fetch(`https://pzsyria.com/api/category/${activeCategory.value}`);
      categoryData.value = await categoryResponse.json();
      specialProperties.value = categoryData.value.category?.specialProperties || [];
    } else {
      categoryData.value = null;
      specialProperties.value = [];
    }
  } catch (err) {
    console.error("Failed to fetch products:", err);
    error.value = "فشل في تحميل المنتجات. يرجى المحاولة مرة أخرى.";
  } finally {
    isLoading.value = false;
  }
};

// تنفيذ الطلب عند تحميل المكون
onMounted(() => {
  fetchProducts();
});

// مراقبة التغييرات في التصنيف والتصنيف الفرعي
watch(
  [() => activeCategory.value, () => activeSubcategory.value],
  () => {
    fetchProducts();
  },
  { immediate: true }
);

// تصفية المنتجات
const currentData = computed(() => {
  if (!products.value?.advertisements) return [];
  
  let filteredData = products.value.advertisements;

  // تطبيق البحث
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filteredData = filteredData.filter(item => 
      item.advTitle?.toLowerCase().includes(query) ||
      item.advDescription?.toLowerCase().includes(query)
    );
  }

  // تطبيق فلترة نطاق السعر
  if (priceRange.value.min || priceRange.value.max) {
    filteredData = filteredData.filter(item => {
      const price = Number(item.price);
      const min = Number(priceRange.value.min) || 0;
      const max = Number(priceRange.value.max) || Infinity;
      return price >= min && price <= max;
    });
  }

  // تطبيق فلترة الماركات
  if (selectedBrands.value.length > 0) {
    filteredData = filteredData.filter(item =>
      selectedBrands.value.includes(item.brand)
    );
  }

  // فلترة حسب التصنيف النشط
  if (activeCategory.value === 'jobs') {
    if (selectedJobTypes.value.length > 0) {
      filteredData = filteredData.filter(item =>
        selectedJobTypes.value.includes(item.jobType)
      );
    }
    if (selectedJobFields.value.length > 0) {
      filteredData = filteredData.filter(item =>
        selectedJobFields.value.includes(item.field)
      );
    }
  } else if (activeCategory.value === 'electronics') {
    if (selectedElectronicsCategories.value.length > 0) {
      filteredData = filteredData.filter(item =>
        selectedElectronicsCategories.value.includes(item.category)
      );
    }
  }

  // فلترة حسب الحالة
  if (selectedConditions.value.length > 0) {
    filteredData = filteredData.filter(item =>
      selectedConditions.value.includes(item.condition)
    );
  }

  // تطبيق الفلترة حسب الخصائص الخاصة
  Object.entries(selectedProperties.value).forEach(([key, value]) => {
    if (value) {
      filteredData = filteredData.filter(item => 
        item[key]?.toString().toLowerCase() === value.toString().toLowerCase()
      );
    }
  });

  // تطبيق فلترة الماركات
  if (selectedTradeMarks.value.length > 0) {
    filteredData = filteredData.filter(item =>
      selectedTradeMarks.value.includes(item.tradeMark)
    );
  }

  return filteredData;
});

// معالجة تغيير البحث
const handleSearch = (event) => {
  searchQuery.value = event.target.value;
};

// معالجة تغيير الماركات
const handleBrandChange = (brand) => {
  const index = selectedBrands.value.indexOf(brand);
  if (index === -1) {
    selectedBrands.value.push(brand);
  } else {
    selectedBrands.value.splice(index, 1);
  }
};

// معالجة تغيير الحالة
const handleConditionChange = (condition) => {
  selectedConditions.value = [condition]; // للراديو بتن نستخدم قيمة واحدة فقط
};

// معالجة تغيير نوع الوظيفة
const handleJobTypeChange = (type) => {
  const index = selectedJobTypes.value.indexOf(type);
  if (index === -1) {
    selectedJobTypes.value.push(type);
  } else {
    selectedJobTypes.value.splice(index, 1);
  }
};

// معالجة تغيير مجال الوظيفة
const handleJobFieldChange = (field) => {
  const index = selectedJobFields.value.indexOf(field);
  if (index === -1) {
    selectedJobFields.value.push(field);
  } else {
    selectedJobFields.value.splice(index, 1);
  }
};

// معالجة تغيير فئة الإلكترونيات
const handleElectronicsCategoryChange = (category) => {
  const index = selectedElectronicsCategories.value.indexOf(category);
  if (index === -1) {
    selectedElectronicsCategories.value.push(category);
  } else {
    selectedElectronicsCategories.value.splice(index, 1);
  }
};

// دالة معالجة تغيير قيم الخصائص الخاصة
const handlePropertyChange = (property, value) => {
  if (property.type === 'dropdown' || property.type === 'radio') {
    selectedProperties.value[property.property] = value;
  } else if (property.type === 'text') {
    selectedProperties.value[property.property] = value;
  }
};

// إضافة دالة معالجة تغيير الماركة
const handleTradeMarkChange = (tradeMark) => {
  const index = selectedTradeMarks.value.indexOf(tradeMark);
  if (index === -1) {
    selectedTradeMarks.value.push(tradeMark);
  } else {
    selectedTradeMarks.value.splice(index, 1);
  }
};

// إضافة watch للفئة النشطة
watch(() => activeCategory.value, () => {
  selectedTradeMarks.value = []; // إعادة تعيين الماركات المحددة عند تغيير الفئة
  fetchProducts();
});

// دالة للحصول على صورة الماركة
const getTradeMarkImage = (tradeMark) => {
  const normalizedTradeMark = tradeMark.toLowerCase();
  // البحث عن الصورة في الكائن بغض النظر عن حالة الأحرف
  const imageKey = Object.keys(tradeMarkImages).find(
    key => key.toLowerCase() === normalizedTradeMark
  );
  return imageKey ? tradeMarkImages[imageKey] : defaultLogo;
};

// دالة معالجة خطأ تحميل الصورة
const handleImageError = (event) => {
  event.target.src = defaultLogo;
};
</script>

<style scoped>
.space-x-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
  margin-right: calc(0.5rem * var(--tw-space-x-reverse));
  margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));
}

.trademark-card {
  transition: all 0.2s ease-in-out;
}

.trademark-card:hover {
  transform: translateY(-2px);
}

.trademark-card img {
  max-width: 100%;
  height: auto;
  object-fit: contain;
}
</style>
