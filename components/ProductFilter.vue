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
                      :checked="
                        selectedElectronicsCategories.includes(category)
                      "
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
                    @change="
                      handlePropertyChange(property, $event.target.value)
                    "
                  >
                    <option value="" selected class="text-gray-600">
                      اختر {{ property.property }}
                    </option>
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
            <template
              v-if="
                activeCategory !== 'all' &&
                categoryData?.category?.tradeMarks?.length > 0
              "
            >
              <FilterSection title="الماركة">
                <div class="grid grid-cols-2 gap-3">
                  <div
                    v-for="(tradeMark, index) in categoryData.category
                      .tradeMarks"
                    :key="index"
                    @click="handleTradeMarkChange(tradeMark)"
                    class="relative cursor-pointer rounded-lg border-2 transition-all duration-200"
                    :class="[
                      selectedTradeMarks.includes(tradeMark)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-200',
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
                      <span class="text-sm text-gray-700 text-center">{{
                        tradeMark
                      }}</span>
                      <!-- علامة الاختيار -->
                      <div
                        v-if="selectedTradeMarks.includes(tradeMark)"
                        class="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                      >
                        <Icon name="ph:check-bold" class="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </FilterSection>
            </template>

            <!-- إضافة قسم فلتر اللون -->
            <!-- <FilterSection title="اللون">
              <div class="grid grid-cols-5 gap-2">
                <button
                  v-for="color in availableColors"
                  :key="color.name"
                  @click="handleColorChange(color.name)"
                  class="relative p-1 rounded-lg focus:outline-none"
                >
                  <div
                    :class="[
                      'w-8 h-8 rounded-full',
                      color.class,
                      selectedColors.includes(color.name)
                        ? 'ring-2 ring-green-500 ring-offset-2'
                        : '',
                    ]"
                  >
                    <PhCheck
                      v-if="selectedColors.includes(color.name)"
                      class="w-4 h-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white"
                      :class="{ 'text-black': color.name === 'أبيض' }"
                    />
                  </div>
                  <span class="block text-xs text-center mt-1">{{
                    color.name
                  }}</span>
                </button>
              </div>
            </FilterSection> -->
          </div>

          <!-- Listings - Left Side -->
          <div class="lg:w-3/4">
            <div v-if="isLoading" class="text-center py-4">جاري التحميل...</div>
            <div v-else-if="error" class="text-red-500 text-center py-4">
              {{ error }}
            </div>
            <div v-else>
              <!-- Products Grid -->
              <div class="space-y-4">
                <ProductCard
                  v-for="item in paginatedData"
                  :key="item._id"
                  :product="item"
                  @click="handleProductClick"
                />
              </div>
              
              <!-- Load More Button -->
              <div v-if="hasMoreItems" class="text-center mt-6">
                <button
                  @click="loadMore"
                  class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  عرض المزيد
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- إضافة شريط إحصائيات الفلتر -->
    <div
      v-if="filterStats.activeFilters.length > 0"
      class="bg-gray-50 p-3 rounded-lg mb-4"
    >
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-600">
          <span
            >تم العثور على {{ filterStats.filtered }} من
            {{ filterStats.total }}</span
          >
          <span class="mx-2">|</span>
          <span
            >الفلاتر النشطة: {{ filterStats.activeFilters.join("، ") }}</span
          >
        </div>
        <button
          @click="resetAllFilters"
          class="text-sm text-red-600 hover:text-red-700"
        >
          إعادة تعيين الفلاتر
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from '#app';
import CategoryFilters from "./CarFilter/CategoryFilters.vue";
import FilterSection from "./CarFilter/FilterSection.vue";
import PriceRangeFilter from "./CarFilter/PriceRangeFilter.vue";
import { carBrands, filterOptions } from "@/data/mockData";
import ProductCard from "./ProductCard.vue";
// استيراد الصور من مجلد assets
import toyotaLogo from "~/assets/trademarks/toyota.png";
import hondaLogo from "~/assets/trademarks/honda.png";
import bmwLogo from "~/assets/trademarks/bmw.png";
import mercedesLogo from "~/assets/trademarks/mercedes.png";
import audiLogo from "~/assets/trademarks/audi.png";
import volkswagenLogo from "~/assets/trademarks/volkswagen.png";
import nissanLogo from "~/assets/trademarks/nissan.png";
import hyundaiLogo from "~/assets/trademarks/hyundai.png";
import kiaLogo from "~/assets/trademarks/kia.png";
import mazdaLogo from "~/assets/trademarks/mazda.png";

// إضافة router و route
const router = useRouter();
const route = useRoute();

// تعديل تعريف المتغيرات لتأخذ القيم من URL أو التخزين المحلي
const activeCategory = ref(route.query.category || "all");
const activeSubcategory = ref(route.query.subcategory || "");
const searchQuery = ref(route.query.search || "");
const priceRange = ref({
  min: route.query.minPrice || "",
  max: route.query.maxPrice || ""
});
const products = ref(null);
const error = ref(null);
const isLoading = ref(false);

// إضافة المتغيرات الجديدة
const selectedBrands = ref([]);
const selectedConditions = ref([]);
const selectedJobTypes = ref([]);
const selectedJobFields = ref([]);
const selectedElectronicsCategories = ref([]);

// تعديل المتغيرات للماركات
const categoryData = ref(null);
const specialProperties = ref([]);
const tradeMarks = computed(() => {
  if (activeCategory.value === "all") return [];
  return categoryData.value?.category?.tradeMarks || [];
});

// إضافة متغيرات للفلترة حسب الخصائص الخاصة
const selectedProperties = ref({});

// إضافة متغير للماركات المحددة
const selectedTradeMarks = ref(
  route.query.tradeMarks ? route.query.tradeMarks.split(',') : []
);

// إضافة متغير للألوان المحددة
const selectedColors = ref(
  route.query.colors ? route.query.colors.split(',') : []
);

// كائن يحتوي على الصور المحلية للماركات
const tradeMarkImages = {
  Toyota: toyotaLogo,
  Honda: hondaLogo,
  BMW: bmwLogo,
  Mercedes: mercedesLogo,
  Audi: audiLogo,
  Volkswagen: volkswagenLogo,
  Nissan: nissanLogo,
  Hyundai: hyundaiLogo,
  Kia: kiaLogo,
  Mazda: mazdaLogo,
};

// إضافة مصفوفة الألوان المتاحة
const availableColors = [
  { name: "أبيض", class: "bg-white border-2 border-gray-200" },
  { name: "أسود", class: "bg-black" },
  { name: "رمادي", class: "bg-gray-500" },
  { name: "فضي", class: "bg-gray-300" },
  { name: "أحمر", class: "bg-red-500" },
  { name: "أزرق", class: "bg-blue-500" },
  { name: "أخضر", class: "bg-green-500" },
  { name: "بني", class: "bg-amber-800" },
  { name: "ذهبي", class: "bg-yellow-500" },
  { name: "برتقالي", class: "bg-orange-500" },
];

// إضافة متغير لحفظ موقع السكرول
const scrollPosition = ref(0);

// دالة لحفظ موقع السكرول قبل الانتقال
const saveScrollPosition = () => {
  scrollPosition.value = window.scrollY;
  sessionStorage.setItem('lastScrollPosition', scrollPosition.value.toString());
};

// دالة لاستعادة موقع السكرول
const restoreScrollPosition = () => {
  const savedPosition = sessionStorage.getItem('lastScrollPosition');
  if (savedPosition) {
    nextTick(() => {
      window.scrollTo({
        top: parseInt(savedPosition),
        behavior: 'smooth'
      });
      // مسح الموقع المحفوظ بعد استعادته
      sessionStorage.removeItem('lastScrollPosition');
    });
  }
};

// دالة لتحديث URL مع الفلاتر الحالية
const updateURLWithFilters = () => {
  const query = {
    ...route.query,
    category: activeCategory.value !== 'all' ? activeCategory.value : undefined,
    subcategory: activeSubcategory.value || undefined,
    search: searchQuery.value || undefined,
    minPrice: priceRange.value.min || undefined,
    maxPrice: priceRange.value.max || undefined,
    tradeMarks: selectedTradeMarks.value.length ? selectedTradeMarks.value.join(',') : undefined,
    colors: selectedColors.value.length ? selectedColors.value.join(',') : undefined,
    properties: Object.keys(selectedProperties.value).length ? 
      encodeURIComponent(JSON.stringify(selectedProperties.value)) : undefined
  };

  // تحديث URL بدون إعادة تحميل الصفحة
  router.push({ query });
};

// مراقبة التغييرات في الفلاتر وتحديث URL
watch([
  activeCategory,
  activeSubcategory,
  searchQuery,
  priceRange,
  selectedTradeMarks,
  selectedColors,
  selectedProperties
], () => {
  updateURLWithFilters();
}, { deep: true });

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
        url += `&subCategory=${activeSubcategory.value}`;
      }
      response = await fetch(url);
    }

    const data = await response.json();
    products.value = data;

    // جلب بيانات القسم والماركات
    if (activeCategory.value !== "all") {
      const categoryResponse = await fetch(
        `https://pzsyria.com/api/category/${activeCategory.value}`
      );
      categoryData.value = await categoryResponse.json();
      specialProperties.value =
        categoryData.value.category?.specialProperties || [];
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

// تعديل onMounted
onMounted(() => {
  // استعادة الفلاتر من URL
  const {
    category,
    subcategory,
    search,
    minPrice,
    maxPrice,
    tradeMarks,
    colors,
    properties
  } = route.query;

  if (category) activeCategory.value = category;
  if (subcategory) activeSubcategory.value = subcategory;
  if (search) searchQuery.value = search;
  if (minPrice || maxPrice) {
    priceRange.value = {
      min: minPrice || "",
      max: maxPrice || ""
    };
  }
  if (tradeMarks) selectedTradeMarks.value = tradeMarks.split(',');
  if (colors) selectedColors.value = colors.split(',');
  if (properties) {
    try {
      selectedProperties.value = JSON.parse(decodeURIComponent(properties));
    } catch (e) {
      console.error('Error parsing properties from URL:', e);
    }
  }

  // تحديث المنتجات واستعادة موقع السكرول
  fetchProducts().then(() => {
    restoreScrollPosition();
  });
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

  // تطبيق جميع الفلاتر بالتتابع
  const applyFilters = () => {
    // فلتر البحث
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filteredData = filteredData.filter(
        (item) =>
          item.advTitle?.toLowerCase().includes(query) ||
          item.advDescription?.toLowerCase().includes(query)
      );
    }

    // فلتر نطاق السعر
    if (priceRange.value.min || priceRange.value.max) {
      filteredData = filteredData.filter((item) => {
        const price = Number(item.price);
        const min = Number(priceRange.value.min) || 0;
        const max = Number(priceRange.value.max) || Infinity;
        return price >= min && price <= max;
      });
    }

    // فلتر الماركات
    if (selectedTradeMarks.value.length > 0) {
      filteredData = filteredData.filter((item) =>
        selectedTradeMarks.value.includes(item.tradeMark)
      );
    }

    // فلتر الألوان
    if (selectedColors.value.length > 0) {
      filteredData = filteredData.filter((item) => {
        const colorProperty = item.specialProperties?.find(
          (prop) =>
            prop.property.toLowerCase() === "اللون" ||
            prop.property.toLowerCase() === "color"
        );
        return (
          colorProperty && selectedColors.value.includes(colorProperty.value)
        );
      });
    }

    // فلتر الخصائص الخاصة
    Object.entries(selectedProperties.value).forEach(([key, value]) => {
      if (value) {
        filteredData = filteredData.filter((item) =>
          item.specialProperties?.some(
            (prop) =>
              prop.property === key &&
              prop.value?.toString().toLowerCase() ===
                value.toString().toLowerCase()
          )
        );
      }
    });

    // فلتر التصنيف
    if (activeCategory.value !== "all") {
      filteredData = filteredData.filter(
        (item) => item.category === activeCategory.value
      );

      if (activeSubcategory.value) {
        filteredData = filteredData.filter(
          (item) => item.subCategory === activeSubcategory.value
        );
      }
    }

    // فلتر نوع الوظيفة
    if (activeCategory.value === "jobs" && selectedJobTypes.value.length > 0) {
      filteredData = filteredData.filter((item) =>
        selectedJobTypes.value.includes(item.jobType)
      );
    }

    // فلتر مجال الوظيفة
    if (activeCategory.value === "jobs" && selectedJobFields.value.length > 0) {
      filteredData = filteredData.filter((item) =>
        selectedJobFields.value.includes(item.field)
      );
    }

    // فلتر فئة الإلكترونيات
    if (
      activeCategory.value === "electronics" &&
      selectedElectronicsCategories.value.length > 0
    ) {
      filteredData = filteredData.filter((item) =>
        selectedElectronicsCategories.value.includes(item.electronicsCategory)
      );
    }

    return filteredData;
  };

  // تطبيق جميع الفلاتر
  return applyFilters();
});

// إضافة computed للإحصائيات
const filterStats = computed(() => {
  return {
    total: products.value?.advertisements?.length || 0,
    filtered: currentData.value.length,
    activeFilters: [
      selectedTradeMarks.value.length > 0 ? "الماركات" : null,
      selectedColors.value.length > 0 ? "الألوان" : null,
      Object.keys(selectedProperties.value).length > 0 ? "الخصائص" : null,
      priceRange.value.min || priceRange.value.max ? "السعر" : null,
      searchQuery.value ? "البحث" : null,
    ].filter(Boolean),
  };
});

// تعديل دالة لإعادة تعيين جميع الفلاتر
const resetAllFilters = () => {
  activeCategory.value = "all";
  activeSubcategory.value = "";
  selectedTradeMarks.value = [];
  selectedColors.value = [];
  selectedProperties.value = {};
  priceRange.value = { min: "", max: "" };
  searchQuery.value = "";
  selectedJobTypes.value = [];
  selectedJobFields.value = [];
  selectedElectronicsCategories.value = [];
  
  // مسح كل الفلاتر من URL
  router.push({ query: {} });
};

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
  selectedProperties.value[property.property] = value;
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

// إضافة دالة معالجة تغيير اللون
const handleColorChange = (color) => {
  const index = selectedColors.value.indexOf(color);
  if (index === -1) {
    selectedColors.value.push(color);
  } else {
    selectedColors.value.splice(index, 1);
  }
};

// دالة للحصول على صورة الماركة
const getTradeMarkImage = (tradeMark) => {
  const normalizedTradeMark = tradeMark.toLowerCase();
  // البحث عن الصورة في الكائن بغض النظر عن حالة الأحرف
  const imageKey = Object.keys(tradeMarkImages).find(
    (key) => key.toLowerCase() === normalizedTradeMark
  );
  return imageKey ? tradeMarkImages[imageKey] : defaultLogo;
};

// دالة معالجة خطأ تحميل الصورة
const handleImageError = (event) => {
  event.target.src = defaultLogo;
};

// تحديث watch
watch(
  [
    () => products.value,
    () => activeCategory.value,
    () => activeSubcategory.value,
    () => selectedTradeMarks.value,
    () => selectedProperties.value,
    () => selectedColors.value,
    () => priceRange.value,
  ],
  () => {
    console.log("Filters or data updated");
  },
  { deep: true }
);

// إضافة مراقب للتنقل
const handleBeforeRouteLeave = () => {
  if (route.path === '/') {
    saveScrollPosition();
  }
};

// تعديل ProductCard component لإضافة حدث النقر
const handleProductClick = () => {
  saveScrollPosition();
};

// Add these refs at the top of your script
const itemsPerPage = ref(6);
const currentPage = ref(1);

// Add this computed property
const paginatedData = computed(() => {
  const startIndex = 0;
  const endIndex = currentPage.value * itemsPerPage.value;
  return currentData.value.slice(startIndex, endIndex);
});

// Add this computed to check if there are more items to load
const hasMoreItems = computed(() => {
  return paginatedData.value.length < currentData.value.length;
});

// Add this method to load more items
const loadMore = () => {
  currentPage.value += 1;
};

// Add this to your watch effects or where you handle filter changes
watch([
  activeCategory,
  activeSubcategory,
  searchQuery,
  priceRange,
  selectedTradeMarks,
  selectedColors,
  selectedProperties
], () => {
  currentPage.value = 1; // Reset to first page when filters change
}, { deep: true });
</script>

<style scoped>
/* Add your component-specific styles here */
</style>