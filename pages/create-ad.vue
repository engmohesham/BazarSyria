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

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-8">
          جاري التحميل...
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-8 text-red-600">
          {{ error }}
        </div>

        <!-- Main Form -->
        <template v-else>
          <HelpCard />
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
              v-model="formData.tradeMark"
              :trade-marks="tradeMarks"
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
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed, watchEffect } from 'vue'
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
  // getCities,
  getRegions,
  getConditions,
  getFuelTypes,
  getTransmissions
} = useServices()

const formData = ref({
  category: '',
  subCategory: '',
  tradeMark: '',
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
  contactMethod: 'both',
  phoneNumber: '',
  whatsappNumber: '',
})

const categories = ref([])
const subCategories = ref([])
const tradeMarks = ref([])
// const cities = ref([])
const regions = ref([])
const conditions = ref([])
const fuelTypes = ref([])
const transmissions = ref([])
const allSubCategories = ref([])
const isLoading = ref(true)
const error = ref(null)

// Add computed for selected category
const selectedCategory = computed(() => {
  return categories.value.find(cat => cat._id === formData.value.category) || null;
})

// Fetch initial data function
const fetchInitialData = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    // Fetch categories
    const { data: categoriesData, error: categoriesError } = await getCategories()
    if (categoriesError) throw new Error('فشل في تحميل الفئات')
    categories.value = categoriesData

    // Fetch cities
    // const { data: citiesData, error: citiesError } = await getCities()
    // if (citiesError) throw new Error('فشل في تحميل المدن')
    // cities.value = citiesData

  } catch (err) {
    console.error('Error fetching initial data:', err)
    error.value = err.message || 'حدث خطأ في تحميل البيانات'
  } finally {
    isLoading.value = false
  }
}

// استخدام watchEffect لمراقبة التغييرات والتحميل الأولي
watchEffect(() => {
  if (process.client) {
    fetchInitialData()
  }
})

// إعادة تحميل البيانات عند التحميل الأولي
onMounted(() => {
  if (process.client) {
    fetchInitialData()
  }
})

// تعديل watch للفئة
watch(() => formData.value.category, async (newCategoryId) => {
  if (newCategoryId) {
    try {
      const { data } = await getSubCategories(newCategoryId)
      allSubCategories.value = data
      
      const selectedCategory = categories.value.find(cat => cat._id === newCategoryId)
      if (selectedCategory) {
        // Reset tradeMark when category changes
        formData.value.tradeMark = ''

        // تعيين قائمة الماركات مباشرة من tradeMarks
        if (selectedCategory.tradeMarks) {
          tradeMarks.value = selectedCategory.tradeMarks
        }

        // تعيين الخصائص الخاصة بشكل صحيح
        if (selectedCategory.specialProperties) {
          formData.value.specialProperties = []  // إعادة تعيين المصفوفة
          selectedCategory.specialProperties.forEach(prop => {
            formData.value.specialProperties.push({
              property: prop.property,
              value: '',
              type: prop.type,
              values: prop.values
            })
          })
        }
      }
    } catch (error) {
      console.error('Error fetching category data:', error)
    }
  } else {
    allSubCategories.value = []
    formData.value.subCategory = ''
    tradeMarks.value = []
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
    formDataToSend.append('tradeMark', formData.value.tradeMark)
    
    // إضافة أرقام الاتصال
    if (['phone', 'both'].includes(formData.value.contactMethod)) {
      formDataToSend.append('phoneNumber', formData.value.phoneNumber)
    }
    if (['whatsapp', 'both'].includes(formData.value.contactMethod)) {
      formDataToSend.append('whatsappNumber', formData.value.whatsappNumber)
    }

    // إضافة بيانات الموقع بشكل صحيح
    formDataToSend.append('location[long]', formData.value.location.long)
    formDataToSend.append('location[lat]', formData.value.location.lat)
    formDataToSend.append('location[city]', formData.value.location.city)
    formDataToSend.append('location[region]', formData.value.location.region)
    formDataToSend.append('location[addressDetails]', formData.value.location.addressDetails)

    // إضافة الخصائص الخاصة
    if (formData.value.specialProperties && formData.value.specialProperties.length > 0) {
      formData.value.specialProperties.forEach((prop, index) => {
        if (prop.value) { // Only send properties that have values
          formDataToSend.append(`specialProperties[${index}][property]`, prop.property)
          formDataToSend.append(`specialProperties[${index}][value]`, prop.value)
        }
      })
    }

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
      // console.log(pair[0] + ': ' + pair[1])
    }

    const { error: createError } = await createAd(formDataToSend)
    
    if (createError) {
      throw new Error('Failed to create advertisement')
    }

    navigateTo('/account/profile/my-ads')
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