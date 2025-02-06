<template>
  <div class="bg-gray-100 min-h-screen" dir="rtl">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-3xl mx-auto">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl">نشر اعلانك 📢</h1>
          <button @click="router.back()" class="text-gray-600">
            <Icon name="ph:arrow-right" class="w-6 h-6" />
          </button>
        </div>

        <!-- Help Card -->
        <HelpCard />

        <!-- Main Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <CategorySection
            v-model="formData"
            :categories="categories"
            :all-sub-categories="allSubCategories"
          />

          <ImageUploadSection
            v-model="formData.gallery"
          />

          <BrandSection
            v-model="formData.brand"
            :brands="brands"
          />

          <SpecificationsSection
            v-model="formData"
            :conditions="conditions"
            :fuel-types="fuelTypes"
            :transmissions="transmissions"
          />

          <AdDetailsSection
            v-model="formData"
          />

          <LocationSection
            v-model="formData.location"
            :cities="cities"
            :regions="regions"
          />

          <PriceSection
            v-model="formData"
          />

          <!-- Submit Button -->
          <button 
            type="submit"
            class="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            نشر اعلانك
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useServices } from '../composables/useServices'

// Import components
import HelpCard from '~/components/create-ad/HelpCard.vue'
import CategorySection from '~/components/create-ad/CategorySection.vue'
import ImageUploadSection from '~/components/create-ad/ImageUploadSection.vue'
import BrandSection from '~/components/create-ad/BrandSection.vue'
import SpecificationsSection from '~/components/create-ad/SpecificationsSection.vue'
import AdDetailsSection from '~/components/create-ad/AdDetailsSection.vue'
import LocationSection from '~/components/create-ad/LocationSection.vue'
import PriceSection from '~/components/create-ad/PriceSection.vue'

const router = useRouter()
const { 
  createAd, 
  getCategories, 
  getSubCategories,
  getBrands,
  getCities,
  getRegions,
  getConditions,
  getFuelTypes,
  getTransmissions
} = useServices()

const formData = ref({
  category: '',
  subCategory: '',
  brand: '',
  condition: '',
  fuelType: '',
  transmission: '',
  advTitle: '',
  advDescription: '',
  gallery: [],
  location: {
    long: '',
    lat: '',
    city: '',
    region: '',
    addressDetails: ''
  },
  price: '',
  phoneNumber: '',
  contactMethod: 'phone'
})

const categories = ref([])
const subCategories = ref([])
const brands = ref([])
const cities = ref([])
const regions = ref([])
const conditions = ref([])
const fuelTypes = ref([])
const transmissions = ref([])

// Fetch initial data
onMounted(async () => {
  try {
    // Fetch categories
    const { data: categoriesData } = await getCategories()
    categories.value = categoriesData

    // Fetch brands
    const { data: brandsData } = await getBrands()
    brands.value = brandsData

    // Fetch cities
    const { data: citiesData } = await getCities()
    cities.value = citiesData

    // Fetch specifications
    const { data: conditionsData } = await getConditions()
    conditions.value = conditionsData

    const { data: fuelTypesData } = await getFuelTypes()
    fuelTypes.value = fuelTypesData

    const { data: transmissionsData } = await getTransmissions()
    transmissions.value = transmissionsData
  } catch (error) {
    console.error('Error fetching initial data:', error)
  }
})

// Watch for category changes to fetch subcategories
watch(() => formData.value.category, async (newCategoryId) => {
  if (newCategoryId) {
    try {
      const { data } = await getSubCategories(newCategoryId)
      subCategories.value = data
    } catch (error) {
      console.error('Error fetching sub-categories:', error)
    }
  }
})

// Watch for city changes to fetch regions
watch(() => formData.value.location.city, async (newCityId) => {
  if (newCityId) {
    try {
      const { data } = await getRegions(newCityId)
      regions.value = data
    } catch (error) {
      console.error('Error fetching regions:', error)
    }
  }
})

const handleImageUpload = (event) => {
  const files = event.target.files
  if (files.length + formData.value.gallery.length > 5) {
    alert('يمكنك تحميل 5 صور كحد أقصى')
    return
  }
  
  Array.from(files).forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.value.gallery.push(e.target.result)
    }
    reader.readAsDataURL(file)
  })
}

const removeImage = (index) => {
  formData.value.gallery.splice(index, 1)
}

const handleSubmit = async () => {
  try {
    const { error: createError } = await createAd(formData.value)
    
    if (createError) {
      throw new Error('Failed to create advertisement')
    }

    navigateTo('/')
  } catch (error) {
    console.error('Error creating advertisement:', error)
  }
}

definePageMeta({
  middleware: "auth"
})

// Redirect to home if not authenticated
onMounted(() => {
  const token = localStorage.getItem('session-token')
  if (!token) {
    router.push('/')
  }
})
</script>

<style scoped>
/* Add any additional styling if needed */
</style> 