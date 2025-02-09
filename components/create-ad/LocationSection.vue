<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <!-- Map Button -->
    <button 
      type="button"
      @click="getLocation"
      class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mb-6"
      :disabled="isLoading"
    >
      <Icon v-if="!isLoading" name="ph:map-pin" class="w-5 h-5" />
      <Icon v-else name="ph:spinner" class="w-5 h-5 animate-spin" />
      {{ isLoading ? 'جاري تحديد موقعك...' : 'اضافة العنوان على الخريطة' }}
    </button>

    <!-- City and Region -->
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          المدينة *
        </label>
        <select 
          v-model="selectedCity"
          class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
          required
        >
          <option value="" disabled selected>اختر المدينة</option>
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
          <option value="" disabled selected>اختر المنطقة</option>
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

// Cities and Regions data
const citiesData = {
  "Damascus": [
    "الميدان", "المزة", "أبو رمانة", "الشعلان", "المالكي",
    "ركن الدين", "برزة", "كفرسوسة", "باب توما", "باب شرقي",
    "القابون", "دمر", "قدسيا", "الزبلطاني"
  ],
  "Rif Dimashq": [
    "التل", "قدسيا", "الزبداني", "داريا", "معضمية الشام",
    "دوما", "حرستا", "عربين", "زملكا", "عين ترما",
    "كفربطنا", "سقبا", "جسرين", "جرمانا", "النبك",
    "يبرود", "القطيفة", "دير عطية", "الكسوة", "صحنايا"
  ],
  // ... add all other cities and their regions
}

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

// دالة الحصول على الموقع الحالي
const getLocation = () => {
  if (!navigator.geolocation) {
    alert('متصفحك لا يدعم تحديد الموقع')
    return
  }

  isLoading.value = true
  showModal.value = true

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords
      mapCenter.value = [latitude, longitude]
      
      tempLocation.value = {
        lat: latitude,
        long: longitude,
        address: ''
      }

      try {
        const addressData = await getAddressFromCoords(latitude, longitude)
        tempLocation.value.address = addressData.fullAddress
      } catch (error) {
        console.error('Error getting address:', error)
        tempLocation.value.address = 'عنوان غير معروف'
      }

      isLoading.value = false
    },
    (error) => {
      isLoading.value = false
      console.error('Geolocation error:', error)
      alert('حدث خطأ في تحديد موقعك. يرجى المحاولة مرة أخرى.')
    }
  )
}

const confirmLocation = () => {
  emit('update:modelValue', {
    ...props.modelValue,
    lat: tempLocation.value.lat.toString(),
    long: tempLocation.value.long.toString(),
    addressDetails: tempLocation.value.address
  })
  showModal.value = false
}

const cancelLocation = () => {
  tempLocation.value = { lat: '', long: '', address: '' }
  showModal.value = false
}
</script>

<style>
@import 'leaflet/dist/leaflet.css';
</style> 