<template>
  <div class="bg-gray-100 min-h-screen" dir="rtl">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-3xl mx-auto">
        <!-- Header with Back Button -->
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl">نشر اعلانك 📢</h1>
          <NuxtLink to="/" class="text-gray-600">
            <Icon name="ph:arrow-right" class="w-6 h-6" />
          </NuxtLink>
        </div>

        <!-- Help Card -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 class="font-bold mb-2">هل تحتاج إلى مساعدة؟</h2>
          <p class="text-gray-600 text-sm leading-relaxed">
            يرجى مراجعة التعليمات التالية قبل نشر إعلانك في موقع البيع
            تحقق من صحة التفاصيل والمعلومات قبل النشر
            تأكد من إضافة صور واضحة وحقيقية
            قم بإضافة معلومات دقيقة عن منتجك
          </p>
          <button class="text-green-600 font-medium mt-2">
            طلب مساعدة
          </button>
        </div>

        <!-- Main Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Category Selection -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                الفئة الرئيسية *
              </label>
              <select 
                v-model="formData.category"
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                required
              >
                <option value="" disabled selected>ادخل الفئة</option>
                <option v-for="category in categories" :key="category._id" :value="category._id">
                  {{ category.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                الفئة الفرعية *
              </label>
              <select 
                v-model="formData.subCategory"
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                required
              >
                <option value="" disabled selected>ادخل الفئة</option>
                <option v-for="subCat in subCategories" :key="subCat._id" :value="subCat._id">
                  {{ subCat.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Images Upload -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <label class="block text-sm font-medium text-gray-700 mb-4">
              تحميل الصور *
            </label>
            <div class="grid grid-cols-5 gap-4">
              <!-- Upload Button -->
              <button 
                type="button"
                @click="$refs.fileInput.click()"
                class="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 transition-colors"
              >
                <Icon name="ph:plus" class="w-6 h-6 text-green-600" />
              </button>
              
              <!-- Image Previews -->
              <div 
                v-for="(image, index) in formData.gallery" 
                :key="index"
                class="relative aspect-square"
              >
                <img 
                  :src="image" 
                  class="w-full h-full object-cover rounded-lg border border-gray-200" 
                />
                <button 
                  @click="removeImage(index)"
                  class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <Icon name="ph:x" class="w-4 h-4" />
                </button>
              </div>
            </div>
            <input 
              type="file"
              multiple
              accept="image/*"
              @change="handleImageUpload"
              class="hidden"
              ref="fileInput"
            />
          </div>

          <!-- Brand Selection -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              الماركة *
            </label>
            <select 
              v-model="formData.brand"
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
              required
            >
              <option value="" disabled selected>ادخل الفئة</option>
              <!-- Add your brand options here -->
            </select>
          </div>

          <!-- Additional Specifications -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-sm font-medium text-gray-700 mb-4">المواصفات الإضافية *</h2>
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-sm text-gray-600 mb-1">الحالة</label>
                <select 
                  v-model="formData.condition"
                  class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                >
                  <option value="" disabled selected>اختر</option>
                  <!-- Add condition options -->
                </select>
              </div>
              <div>
                <label class="block text-sm text-gray-600 mb-1">نوع الوقود</label>
                <select 
                  v-model="formData.fuelType"
                  class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                >
                  <option value="" disabled selected>اختر</option>
                  <!-- Add fuel type options -->
                </select>
              </div>
              <div>
                <label class="block text-sm text-gray-600 mb-1">ناقل الحركة</label>
                <select 
                  v-model="formData.transmission"
                  class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                >
                  <option value="" disabled selected>اختر</option>
                  <!-- Add transmission options -->
                </select>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-4 mt-4 text-center text-sm text-gray-500">
              <div>السنة</div>
              <div>كيلومترات</div>
              <div>الحادث</div>
            </div>
          </div>

          <!-- Ad Details -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  اسم الاعلان *
                </label>
                <input 
                  v-model="formData.advTitle"
                  type="text"
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="ادخل اسم الاعلان"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  الوصف *
                </label>
                <textarea 
                  v-model="formData.advDescription"
                  rows="4"
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="وصف الاعلان الذي تريد ..."
                  required
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Location Details -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <!-- Map Button -->
            <button 
              type="button"
              class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mb-6"
            >
              <Icon name="ph:map-pin" class="w-5 h-5" />
              اضافة العنوان على الخريطة
            </button>

            <!-- City and Region -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  المدينة *
                </label>
                <select 
                  v-model="formData.location.city"
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                  required
                >
                  <option value="" disabled selected>ادخل المدينة</option>
                  <!-- Add cities options -->
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  المنطقة *
                </label>
                <select 
                  v-model="formData.location.region"
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                  required
                >
                  <option value="" disabled selected>ادخل المنطقة</option>
                  <!-- Add regions options -->
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  وصف العنوان *
                </label>
                <input 
                  v-model="formData.location.addressDetails"
                  type="text"
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="وصف العنوان بالتفاصيل..."
                  required
                />
              </div>
            </div>
          </div>

          <!-- Price Details -->
          <div class="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                السعر (اختياري)
              </label>
              <input 
                v-model="formData.price"
                type="number"
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                placeholder="ادخل سعر المنتج"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                رقم الهاتف *
              </label>
              <input 
                v-model="formData.phoneNumber"
                type="tel"
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                placeholder="ادخل رقم الهاتف"
                required
              />
            </div>

            <!-- Contact Method -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                طريقة التواصل
              </label>
              <div class="flex gap-4">
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="formData.contactMethod"
                    value="phone"
                    class="ml-2"
                  />
                  <span>رقم الهاتف</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="formData.contactMethod"
                    value="chat"
                    class="ml-2"
                  />
                  <span>شات في سوريا</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="formData.contactMethod"
                    value="both"
                    class="ml-2"
                  />
                  <span>كلاهما</span>
                </label>
              </div>
            </div>
          </div>

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
    long: '-31.2357',
    lat: '-30.0444',
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

// Fetch categories
onMounted(async () => {
  try {
    const { data } = await useFetch('https://bazar-syria.vercel.app/category/all')
    categories.value = data.value.categories
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
})

// Fetch sub-categories when category changes
watch(() => formData.value.category, async (newCategoryId) => {
  if (newCategoryId) {
    try {
      const { data } = await useFetch(`https://bazar-syria.vercel.app/category/${newCategoryId}/subcategories`)
      subCategories.value = data.value.subCategories
    } catch (error) {
      console.error('Error fetching sub-categories:', error)
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
    const response = await fetch('https://bazar-syria.vercel.app/ads/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Add token if required
      },
      body: JSON.stringify(formData.value)
    })

    if (!response.ok) {
      throw new Error('Failed to create advertisement')
    }

    const result = await response.json()
    console.log('Advertisement created:', result)
    
    // Redirect to home page or ad details page
    navigateTo('/')
  } catch (error) {
    console.error('Error creating advertisement:', error)
    // Handle error (show error message to user)
  }
}
</script>

<style scoped>
/* Add any additional styling if needed */
</style> 