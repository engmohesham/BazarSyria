<template>
  <div class="bg-gray-100" dir="rtl">
    <div v-if="isLoading" class="container w-[90%] mx-auto px-4 py-6">
      جاري التحميل...
    </div>
    
    <div v-else-if="error" class="container w-[90%] mx-auto px-4 py-6 text-red-500">
      {{ error }}
    </div>
    
    <div v-else-if="productData" class="container w-[90%] mx-auto px-4 py-6">
      <HeadNav
        :mainNav="productData.categoryId"
        :subNav="productData.subCategoryId"
        :current="'تعديل - ' + productData.name"
      />
      
      <form @submit.prevent="handleUpdateAd" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="md:col-span-2">
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <!-- Image Gallery Section -->
            <div class="p-6 border-b">
              <h3 class="text-lg font-semibold mb-4">الصور</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <!-- Existing Images -->
                <div
                  v-for="(image, index) in gallery"
                  :key="index"
                  class="relative group aspect-square"
                >
                  <img
                    :src="image.path || image.preview"
                    class="w-full h-full object-cover rounded-lg"
                    alt="صورة المنتج"
                  />
                  <button
                    @click="removeImage(index)"
                    class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    type="button"
                  >
                    <PhTrash class="w-4 h-4" />
                  </button>
                </div>
                
                <!-- Add Image Button -->
                <label
                  v-if="gallery.length < 8"
                  class="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-green-500 transition-colors"
                >
                  <input
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleImageAdd"
                    multiple
                  />
                  <PhPlus class="w-8 h-8 text-gray-400" />
                </label>
              </div>
            </div>

            <!-- Title Section -->
            <div class="p-6 border-b">
              <h3 class="text-lg font-semibold mb-4">عنوان الإعلان</h3>
              <input
                v-model="title"
                type="text"
                class="w-full p-3 border rounded-lg focus:outline-none focus:border-green-500"
                placeholder="عنوان الإعلان"
              />
            </div>

            <!-- Description Section -->
            <div class="p-6">
              <h3 class="text-lg font-semibold mb-4">وصف الإعلان</h3>
              <textarea
                v-model="description"
                rows="6"
                class="w-full p-3 border rounded-lg focus:outline-none focus:border-green-500"
                placeholder="اكتب وصفاً تفصيلياً للإعلان"
              ></textarea>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="mt-6">
            <button
              type="submit"
              class="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'جاري الحفظ...' : 'حفظ التعديلات' }}
            </button>
          </div>
        </div>

        <!-- Right Sidebar -->
        <div class="md:col-span-1">
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-lg font-semibold mb-4">معلومات الإعلان</h3>
            <div class="space-y-4">
              <div>
                <span class="text-gray-600">رقم الإعلان:</span>
                <span class="font-medium">{{ route.params.id }}</span>
              </div>
              <div>
                <span class="text-gray-600">تاريخ النشر:</span>
                <span class="font-medium">{{ new Date(productData.advertisement?.createdAt).toLocaleDateString('ar-SY', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric'
                }) }}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { PhTrash, PhPlus } from '@phosphor-icons/vue';
import { API_BASE_URL } from '~/utils/config';

const route = useRoute();
const router = useRouter();
const { getAdById, updateAd } = useServices();
const { showNotification } = useNotification();

// State
const adData = ref(null);
const isLoading = ref(true);
const error = ref(null);
const isSubmitting = ref(false);

// Form data
const title = ref('');
const description = ref('');
const gallery = ref([]);

// Fetch ad data
const fetchAdData = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    const { data, error: apiError } = await getAdById(route.params.id);
    if (apiError) throw apiError;
    
    if (data && data.advertisement) {
      adData.value = data;
      
      // تعديل طريقة معالجة الصور
      title.value = data.advertisement.advTitle || '';
      description.value = data.advertisement.advDescription || '';
      gallery.value = (data.advertisement.gallery || []).map(img => ({
        path: `${img}`,
        isNew: false
      }));
    }
    
  } catch (err) {
    error.value = 'حدث خطأ في تحميل بيانات الإعلان';
    console.error('Error fetching ad:', err);
  } finally {
    isLoading.value = false;
  }
};

// Load data on mount and route change
watchEffect(() => {
  if (process.client && route.params.id) {
    fetchAdData();
  }
});

// إضافة middleware للتأكد من تحميل البيانات
definePageMeta({
  middleware: 'auth',
  validate: async (route) => {
    if (!route.params.id) return false;
    return true;
  }
});

// Handle image upload
const handleImageAdd = (event) => {
  const files = Array.from(event.target.files);
  const validFiles = files.filter(file => file.type.startsWith('image/'));
  
  if (validFiles.length + gallery.value.length > 8) {
    showNotification('يمكنك رفع 8 صور كحد أقصى', 'error');
    return;
  }
  
  // إضافة الصور الجديدة مع الصور القديمة
  const newImages = validFiles.map(file => ({
    file,
    preview: URL.createObjectURL(file),
    isNew: true
  }));
  
  gallery.value = [...gallery.value, ...newImages];
};

// Remove image
const removeImage = (index) => {
  const image = gallery.value[index];
  if (image.isNew && image.preview) {
    URL.revokeObjectURL(image.preview);
  }
  gallery.value = gallery.value.filter((_, i) => i !== index);
};

// Handle form submission
const handleUpdateAd = async () => {
  if (isSubmitting.value) return;
  
  try {
    isSubmitting.value = true;
    
    const formData = new FormData();
    formData.append('advTitle', title.value);
    formData.append('advDescription', description.value);

    // إرسال الصور الجديدة فقط مع بدء الترقيم من 1
    gallery.value
      .filter(img => img.isNew)
      .forEach((img, index) => {
        formData.append(`gallery[${index + 1}]`, img.file);
      });

    const { error: updateError } = await updateAd(route.params.id, formData);
    
    if (updateError) throw updateError;

    showNotification('تم تحديث الإعلان بنجاح', 'success');
    router.push(`/products/${route.params.id}`);
    
  } catch (err) {
    console.error('Error updating ad:', err);
    showNotification('حدث خطأ أثناء تحديث الإعلان', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

// Computed
const productData = computed(() => {
  if (!adData.value?.advertisement) return null;
  
  const ad = adData.value.advertisement;
  return {
    name: ad.advTitle || '',
    categoryId: ad.category || null,
    subCategoryId: ad.subCategory || null,
    advertisement: ad
  };
});

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('ar-SY', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });
};
</script>
