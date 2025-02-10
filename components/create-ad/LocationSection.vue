<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <!-- Location Required Message -->
    <div v-if="!hasLocation" class="mb-6 text-center">
      <p class="text-red-600 mb-4">يجب تحديد موقعك أولاً</p>
      <button 
        type="button"
        @click="getLocation"
        class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        :disabled="isLoading"
      >
        <Icon v-if="!isLoading" name="ph:map-pin" class="w-5 h-5" />
        <Icon v-else name="ph:spinner" class="w-5 h-5 animate-spin" />
        {{ isLoading ? 'جاري تحديد موقعك...' : 'تحديد موقعك على الخريطة' }}
      </button>
    </div>

    <!-- City and Region Selection (Only visible after location is set) -->
    <div v-if="hasLocation" class="space-y-4">
      <!-- Map Update Button -->
      <button 
        type="button"
        @click="getLocation"
        class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors mb-6"
      >
        <Icon name="ph:map-pin" class="w-5 h-5" />
        تحديث الموقع
      </button>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          المدينة *
        </label>
        <select 
          v-model="selectedCity"
          class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
          required
        >
          <option value="" disabled>اختر المدينة</option>
          <option v-for="city in cityList" :key="city" :value="city">
            {{ city }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          المنطقة *
        </label>
        <select 
          v-model="modelValue.region"
          class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
          required
          :disabled="!selectedCity"
        >
          <option value="" disabled>اختر المنطقة</option>
          <option v-for="region in regionsList" :key="region" :value="region">
            {{ region }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          وصف العنوان *
        </label>
        <input 
          v-model="modelValue.addressDetails"
          type="text"
          class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
          placeholder="وصف العنوان بالتفاصيل..."
          required
        />
      </div>
    </div>

    <!-- Location Map Modal -->
    <ClientOnly>
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
          <h3 class="text-lg font-medium mb-4">تحديد الموقع</h3>
          
          <!-- Map Container -->
          <div class="h-96 mb-4">
            <l-map
              v-model:zoom="zoom"
              :center="mapCenter"
              @click="handleMapClick"
            >
              <l-tile-layer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <l-marker
                v-if="tempLocation.lat && tempLocation.long"
                :lat-lng="[tempLocation.lat, tempLocation.long]"
              />
            </l-map>
          </div>

          <!-- Loading State -->
          <div v-if="isLoadingAddress" class="flex items-center justify-center py-4">
            <Icon name="ph:spinner" class="w-6 h-6 animate-spin text-green-600" />
            <span class="mr-2">جاري تحميل تفاصيل العنوان...</span>
          </div>

          <!-- Address Details -->
          <div v-else-if="tempLocation.address" class="mb-4">
            <p class="text-gray-600 mb-4">
              <strong>العنوان المحدد:</strong>
              <br>
              {{ tempLocation.address }}
            </p>
          </div>

          <div class="flex gap-4 justify-end">
            <button 
              @click="confirmLocation"
              class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              تأكيد
            </button>
            <button 
              @click="cancelLocation"
              class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
    default: () => ({
      lat: '',
      long: '',
      city: '',
      region: '',
      addressDetails: ''
    })
  }
})

const emit = defineEmits(['update:modelValue'])

const isLoading = ref(false)
const isLoadingAddress = ref(false)
const showModal = ref(false)
const zoom = ref(13)
const mapCenter = ref([33.5138, 36.2765]) // دمشق كمركز افتراضي
const tempLocation = ref({ 
  lat: '', 
  long: '', 
  address: '' 
})

// Update the cities data with Arabic names
const citiesData = {
  "دمشق": [
    "الميدان", "المزة", "أبو رمانة", "الشعلان", "المالكي",
    "ركن الدين", "برزة", "كفرسوسة", "باب توما", "باب شرقي",
    "القابون", "دمر", "قدسيا", "الزبلطاني"
  ],
  "ريف دمشق": [
    "التل", "قدسيا", "الزبداني", "داريا", "معضمية الشام",
    "دوما", "حرستا", "عربين", "زملكا", "عين ترما",
    "كفربطنا", "سقبا", "جسرين", "جرمانا", "النبك",
    "يبرود", "القطيفة", "دير عطية", "الكسوة", "صحنايا"
  ],
  "حلب": [
    "الجميلية", "السليمانية", "الشهباء", "الأعظمية", "الميدان",
    "السكري", "الفرقان", "الحمدانية", "الشيخ مقصود", "بستان القصر"
  ],
  "حمص": [
    "الوعر", "الإنشاءات", "الخالدية", "عكرمة", "باب السباع",
    "القصور", "الحميدية", "كرم الشامي", "باب هود", "جب الجندلي"
  ],
  "اللاذقية": [
    "الأشرفية", "الصليبة", "العوينة", "القلعة", "المشروع السابع",
    "الرمل الشمالي", "الرمل الجنوبي", "ضاحية تشرين", "الزراعة", "الشيخ ضاهر"
  ],
  "طرطوس": [
    "المشبكة", "الرمل", "المينا", "الغمقة", "القصور",
    "الحميدية", "المشروع السادس", "الرابية", "الكرنك", "البحصة"
  ]
};

// Selected city for managing regions
const selectedCity = ref('')

// Computed properties for cities and regions lists
const cityList = computed(() => Object.keys(citiesData))

const regionsList = computed(() => {
  return selectedCity.value ? citiesData[selectedCity.value] : []
})

// Watch for city changes
watch(selectedCity, (newCity) => {
  emit('update:modelValue', {
    ...props.modelValue,
    city: newCity,
    region: '',
  })
})

onMounted(() => {
  // Initialize map center
  mapCenter.value = [props.modelValue.lat, props.modelValue.long]
})

// دالة معالجة النقر على الخريطة
const handleMapClick = async (event) => {
  const { lat, lng } = event.latlng
  isLoadingAddress.value = true
  
  tempLocation.value = {
    lat: lat,
    long: lng,
    address: ''
  }

  try {
    const addressData = await getAddressFromCoords(lat, lng)
    tempLocation.value.address = addressData.fullAddress
  } catch (error) {
    console.error('Error getting address:', error)
    tempLocation.value.address = 'عنوان غير معروف'
  }

  isLoadingAddress.value = false
}

// دالة الحصول على العنوان من الإحداثيات
const getAddressFromCoords = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`
    )
    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error)
    }

    return {
      fullAddress: data.display_name,
      components: data.address
    }
  } catch (error) {
    console.error('Error fetching address:', error)
    throw error
  }
}

// Add new ref for tracking if location is set
const hasLocation = ref(false)

// Add city coordinates mapping
const cityCoordinates = {
  "دمشق": { lat: 33.5138, lng: 36.2765 },
  "ريف دمشق": { lat: 33.5138, lng: 36.2765 },
  "حلب": { lat: 36.2021, lng: 37.1343 },
  "حمص": { lat: 34.7324, lng: 36.7137 },
  "اللاذقية": { lat: 35.5317, lng: 35.7915 },
  "طرطوس": { lat: 34.8889, lng: 35.8866 }
}

// Function to find nearest city based on coordinates
const findNearestCity = (lat, lng) => {
  let nearestCity = null;
  let shortestDistance = Infinity;

  Object.entries(cityCoordinates).forEach(([city, coords]) => {
    const distance = calculateDistance(lat, lng, coords.lat, coords.lng);
    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearestCity = city;
    }
  });

  return nearestCity;
}

// Calculate distance between two points using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Update getLocation function
const getLocation = () => {
  if (!navigator.geolocation) {
    alert('متصفحك لا يدعم تحديد الموقع');
    return;
  }

  isLoading.value = true;
  showModal.value = true;

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      mapCenter.value = [latitude, longitude];
      
      tempLocation.value = {
        lat: latitude,
        long: longitude,
        address: ''
      };

      try {
        const addressData = await getAddressFromCoords(latitude, longitude);
        tempLocation.value.address = addressData.fullAddress;
        
        // Find and set nearest city
        const nearestCity = findNearestCity(latitude, longitude);
        if (nearestCity) {
          selectedCity.value = nearestCity;
        }

        hasLocation.value = true;
      } catch (error) {
        console.error('Error getting address:', error);
        tempLocation.value.address = 'عنوان غير معروف';
      }

      isLoading.value = false;
    },
    (error) => {
      isLoading.value = false;
      console.error('Geolocation error:', error);
      alert('حدث خطأ في تحديد موقعك. يرجى المحاولة مرة أخرى.');
    },
    { enableHighAccuracy: true }
  );
}

// Update confirmLocation function
const confirmLocation = () => {
  emit('update:modelValue', {
    ...props.modelValue,
    lat: tempLocation.value.lat.toString(),
    long: tempLocation.value.long.toString(),
    city: selectedCity.value,
    addressDetails: tempLocation.value.address
  });
  showModal.value = false;
}

const cancelLocation = () => {
  tempLocation.value = { lat: '', long: '', address: '' }
  showModal.value = false
}
</script>

<style>
@import 'leaflet/dist/leaflet.css';
</style> 