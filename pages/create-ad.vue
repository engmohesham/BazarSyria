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
            :selected-category="selectedCategory"
          />

          <SpecificationsSection
            v-model="formData"
            :conditions="conditions"
            :fuel-types="fuelTypes"
            :transmissions="transmissions"
            :selected-category="selectedCategory"
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
import { onMounted, ref, watch, computed } from 'vue'
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
  specialProperties: [],
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
  contactMethod: 'both'
})

const categories = ref([])
const subCategories = ref([])
const brands = ref([])
const cities = ref([])
const regions = ref([])
const conditions = ref([])
const fuelTypes = ref([])
const transmissions = ref([])
const allSubCategories = ref([])

// Add computed for selected category
const selectedCategory = computed(() => {
  return categories.value.find(cat => cat._id === formData.value.category) || null;
})

// Fetch initial data
onMounted(async () => {
  try {
    // Fetch categories
    const { data: categoriesData } = await getCategories()
    categories.value = categoriesData

    // // Fetch brands
    // const { data: brandsData } = await getBrands()
    // brands.value = brandsData

    // // Fetch cities
    // const { data: citiesData } = await getCities()
    // cities.value = citiesData

    // // Fetch specifications
    // const { data: conditionsData } = await getConditions()
    // conditions.value = conditionsData

    // const { data: fuelTypesData } = await getFuelTypes()
    // fuelTypes.value = fuelTypesData

    // const { data: transmissionsData } = await getTransmissions()
    // transmissions.value = transmissionsData
  } catch (error) {
    console.error('Error fetching initial data:', error)
  }
})

// تعديل watch للفئة لتعبئة جميع البيانات المطلوبة
watch(() => formData.value.category, async (newCategoryId) => {
  if (newCategoryId) {
    try {
      // Fetch subcategories
      const { data } = await getSubCategories(newCategoryId)
      allSubCategories.value = data
      
      // Find selected category
      const selectedCategory = categories.value.find(cat => cat._id === newCategoryId)
      if (selectedCategory) {
        // Reset subcategory when category changes
        formData.value.subCategory = ''

        // تعبئة العلامات التجارية
        if (selectedCategory.tradeMarks) {
          brands.value = selectedCategory.tradeMarks.map(brand => ({
            _id: brand,
            name: brand
          }))
        }

        // تعبئة الخصائص الخاصة والقوائم المنسدلة
        if (selectedCategory.specialProperties) {
          // تعبئة أنواع الوقود
          const fuelTypeProp = selectedCategory.specialProperties.find(prop => prop.property === "Fuel Type")
          if (fuelTypeProp) {
            fuelTypes.value = fuelTypeProp.values.map(value => ({
              _id: value,
              name: value
            }))
          }

          // تعبئة أنواع ناقل الحركة
          const transmissionProp = selectedCategory.specialProperties.find(prop => prop.property === "Transmission")
          if (transmissionProp) {
            transmissions.value = transmissionProp.values.map(value => ({
              _id: value,
              name: value
            }))
          }

          // تعبئة حالة السيارة
          const conditionProp = selectedCategory.specialProperties.find(prop => prop.property === "Condition")
          if (conditionProp) {
            conditions.value = conditionProp.values.map(value => ({
              _id: value,
              name: value
            }))
          }

          // تعبئة الخصائص الخاصة في النموذج
          formData.value.specialProperties = selectedCategory.specialProperties.map(prop => ({
            property: prop.property,
            type: prop.type,
            value: ''
          }))
        }
      }
    } catch (error) {
      console.error('Error fetching category data:', error)
    }
  } else {
    // Reset when no category is selected
    allSubCategories.value = []
    formData.value.subCategory = ''
    brands.value = []
    fuelTypes.value = []
    transmissions.value = []
    conditions.value = []
    formData.value.specialProperties = []
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

// دالة مساعدة لتحويل Base64 إلى ملف
const base64ToFile = async (base64String, filename) => {
  const response = await fetch(base64String)
  const blob = await response.blob()
  return new File([blob], filename, { type: blob.type })
}

const handleSubmit = async () => {
  try {
    // التحقق من البيانات المطلوبة للموقع
    if (!formData.value.location.city || 
        !formData.value.location.region || 
        !formData.value.location.addressDetails ||
        !formData.value.location.lat ||
        !formData.value.location.long) {
      alert('الرجاء تعبئة جميع حقول الموقع')
      return
    }

    // إنشاء كائن FormData جديد
    const formDataToSend = new FormData()

    // إضافة البيانات الأساسية
    formDataToSend.append('category', formData.value.category)
    formDataToSend.append('subCategory', formData.value.subCategory)
    formDataToSend.append('advTitle', formData.value.advTitle)
    formDataToSend.append('advDescription', formData.value.advDescription)
    formDataToSend.append('price', formData.value.price)
    formDataToSend.append('contact', formData.value.contactMethod)
    formDataToSend.append('brand', formData.value.brand)

    // إضافة بيانات الموقع بشكل صحيح
    formDataToSend.append('location[long]', formData.value.location.long)
    formDataToSend.append('location[lat]', formData.value.location.lat)
    formDataToSend.append('location[city]', formData.value.location.city)
    formDataToSend.append('location[region]', formData.value.location.region)
    formDataToSend.append('location[addressDetails]', formData.value.location.addressDetails)

    // إضافة الخصائص الخاصة
    formData.value.specialProperties.forEach((prop, index) => {
      formDataToSend.append(`specialProperties[${index}][property]`, prop.property)
      formDataToSend.append(`specialProperties[${index}][value]`, prop.value)
    })

    // إضافة الصور
    if (formData.value.gallery && formData.value.gallery.length > 0) {
      for (let i = 0; i < formData.value.gallery.length; i++) {
        const image = formData.value.gallery[i]
        if (image instanceof File) {
          formDataToSend.append('gallery', image)
        } else if (typeof image === 'string' && image.startsWith('data:image')) {
          const imageFile = await base64ToFile(image, `image-${i}.jpg`)
          formDataToSend.append('gallery', imageFile)
        }
      }
    }

    // طباعة البيانات للتحقق
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0] + ': ' + pair[1])
    }

    const { error: createError } = await createAd(formDataToSend)
    
    if (createError) {
      throw new Error('Failed to create advertisement')
    }

    navigateTo('/account/my-ads')
  } catch (error) {
    console.error('Error creating advertisement:', error)
    alert('حدث خطأ أثناء نشر الإعلان. الرجاء المحاولة مرة أخرى.')
  }
}

definePageMeta({
  middleware: "auth"
})

// Redirect to home if not authenticated
// onMounted(() => {
//   const token = localStorage.getItem('session-token')
//   if (!token) {
//     router.push('/')
//   }
// })
</script>

<style scoped>
/* Add any additional styling if needed */
</style> 