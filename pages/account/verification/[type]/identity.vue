<script setup>
const route = useRoute();
const verificationType = route.params.type;
const router = useRouter();
const { updateIdentity } = useServices();

// التحقق من نوع التوثيق وتوجيه المستخدم إذا كان الرابط غير صحيح
if (!["business", "personal"].includes(verificationType)) {
  router.push("/account/settings");
}

// نموذج البيانات حسب نوع التوثيق
const formData = ref(
  verificationType === "business"
    ? {
        companyName: "",
        companyType: "",
        commercialRegistry: "",
        taxNumber: "",
        address: "",
        phone: "",
        email: "",
        website: "",
        documents: [],
      }
    : {
        firstName: "",
        lastName: "",
        birthDate: "",
        idNumber: "",
        phone: "",
        email: "",
        address: "",
        documents: [],
      }
);

const error = ref("");
const success = ref("");

// العناوين والأيقونات حسب نوع التوثيق
const pageDetails = computed(() => ({
  title: verificationType === "business" ? "توثيق المؤسسة" : "توثيق الهوية",
  icon: verificationType === "business" ? "ph:buildings" : "ph:user-circle",
  description:
    verificationType === "business"
      ? "للاستمرار في استخدام منصة بازار سوريا يتوجب عليك توثيق هوية مؤسستك"
      : "للاستمرار في استخدام منصة بازار سوريا يتوجب عليك توثيق هويتك الشخصية",
}));

// إضافة متغيرات للكاميرا والصورة
const showCamera = ref(false);
const capturedImage = ref(null);
const videoRef = ref(null);
const stream = ref(null);

// إضافة متغير للتحميل
const isLoading = ref(false);
const isCameraReady = ref(false);

// تحديث متغيرات الصور
const frontCardImage = ref(null);
const backCardImage = ref(null);
const selfieImage = ref(null);

// تحديث عدد الخطوات (4 خطوات)
const currentStep = ref(1);

// تحديث دالة فتح الكاميرا
const openCamera = async () => {
  isLoading.value = true;
  try {
    // محاولة الوصول إلى الكاميرا الخلفية أولاً
    const constraints = {
      video: {
        facingMode: 'environment',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    };

    stream.value = await navigator.mediaDevices.getUserMedia(constraints);
    
    if (videoRef.value) {
      videoRef.value.srcObject = stream.value;
      videoRef.value.onloadedmetadata = () => {
        videoRef.value.play();
      };
      
      // التحقق من جاهزية الكاميرا
      videoRef.value.onloadeddata = () => {
        console.log('الكاميرا جاهزة للاستخدام');
        isCameraReady.value = true;
        isLoading.value = false;
      };
    }
    showCamera.value = true;
  } catch (err) {
    console.error('Error accessing camera:', err);
    // إذا فشل الوصول إلى الكاميرا الخلفية، جرب الكاميرا الأمامية
    try {
      stream.value = await navigator.mediaDevices.getUserMedia({
        video: true
      });
      if (videoRef.value) {
        videoRef.value.srcObject = stream.value;
        videoRef.value.onloadedmetadata = () => {
          videoRef.value.play();
        };
        
        // التحقق من جاهزية الكاميرا
        videoRef.value.onloadeddata = () => {
          console.log('الكاميرا جاهزة للاستخدام');
          isCameraReady.value = true;
          isLoading.value = false;
        };
      }
      showCamera.value = true;
    } catch (frontErr) {
      error.value = 'فشل في الوصول إلى الكاميرا';
      isLoading.value = false;
    }
  }
};

// تحديث دالة التقاط الصورة
const captureImage = () => {
  try {
    const video = videoRef.value;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    // تخزين الصورة في المتغير المناسب حسب الخطوة
    if (currentStep.value === 2) {
      frontCardImage.value = imageData;
    } else if (currentStep.value === 3) {
      backCardImage.value = imageData;
    } else if (currentStep.value === 4) {
      selfieImage.value = imageData;
    }
    
    closeCamera();
  } catch (err) {
    console.error('Error capturing image:', err);
    error.value = 'فشل في التقاط الصورة';
  }
};

// تحديث دالة إغلاق الكاميرا
const closeCamera = () => {
  isCameraReady.value = false;
  try {
    if (stream.value) {
      const tracks = stream.value.getTracks();
      tracks.forEach(track => track.stop());
      stream.value = null;
    }
    if (videoRef.value) {
      videoRef.value.srcObject = null;
    }
    showCamera.value = false;
  } catch (err) {
    console.error('Error closing camera:', err);
  }
};

// تحديث دالة التقاط الصورة
const retakePhoto = () => {
  if (currentStep.value === 2) {
    frontCardImage.value = null;
  } else if (currentStep.value === 3) {
    backCardImage.value = null;
  } else if (currentStep.value === 4) {
    selfieImage.value = null;
  }
  openCamera();
};

// دالة للانتقال للخطوة التالية
const goToNextStep = () => {
  if (currentStep.value === 1) {
    // التحقق من البيانات الشخصية
    const requiredFields = [
      'firstName',
      'lastName',
      'birthDate',
      'idNumber',
      'phone',
      'email',
      'address'
    ];
    
    const missingFields = requiredFields.filter(field => !formData.value[field]);
    
    if (missingFields.length > 0) {
      error.value = 'يرجى تعبئة جميع الحقول المطلوبة';
      return;
    }
  } else if (currentStep.value === 2 && !frontCardImage.value) {
    error.value = 'يرجى التقاط صورة الوجه الأمامي للبطاقة';
    return;
  } else if (currentStep.value === 3 && !backCardImage.value) {
    error.value = 'يرجى التقاط صورة الوجه الخلفي للبطاقة';
    return;
  }
  
  error.value = '';
  currentStep.value++;
};

// دالة للعودة للخطوة السابقة
const goToPreviousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

// تعديل handleSubmit
const handleSubmit = async () => {
  if (!frontCardImage.value || !backCardImage.value || !selfieImage.value) {
    error.value = 'يرجى إكمال جميع الصور المطلوبة';
    return;
  }

  try {
    const submitData = {
      type: verificationType,
      ...formData.value,
      frontCardImage: frontCardImage.value,
      backCardImage: backCardImage.value,
      selfieImage: selfieImage.value
    };

    const { error: apiError } = await updateIdentity(submitData);
    if (apiError) throw apiError;

    success.value = "تم إرسال طلب التوثيق بنجاح";
    setTimeout(() => {
      router.push("/account/settings");
    }, 2000);
  } catch (err) {
    error.value = "فشل في إرسال طلب التوثيق";
    console.error("Error updating identity:", err);
  }
};

// قائمة أنواع الشركات
const companyTypes = [
  "شركة فردية",
  "شركة تضامن",
  "شركة توصية بسيطة",
  "شركة مساهمة",
  "شركة ذات مسؤولية محدودة",
  "أخرى",
];

// تعريف دالة getStepTitle
const getStepTitle = () => {
  switch (currentStep.value) {
    case 1:
      return 'البيانات الشخصية';
    case 2:
      return 'التقاط صورة الوجه الأمامي للبطاقة';
    case 3:
      return 'التقاط صورة الوجه الخلفي للبطاقة';
    case 4:
      return 'التقاط الصورة الشخصية';
    default:
      return '';
  }
};

// تعريف دالة getCurrentImage
const getCurrentImage = () => {
  switch (currentStep.value) {
    case 2:
      return frontCardImage.value;
    case 3:
      return backCardImage.value;
    case 4:
      return selfieImage.value;
    default:
      return null;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 py-8" dir="rtl">
    <div class="container mx-auto px-4">
      <div class="max-w-2xl mx-auto">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold">{{ pageDetails.title }}</h1>
          <button
            @click="router.back()"
            class="text-gray-600 hover:text-gray-800"
          >
            <Icon name="ph:arrow-left" class="w-6 h-6" />
          </button>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <p class="text-gray-600 mb-6">
            {{ pageDetails.description }}
          </p>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- نموذج الشركات -->
            <template v-if="verificationType === 'business'">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    اسم المؤسسة *
                  </label>
                  <input
                    v-model="formData.companyName"
                    type="text"
                    required
                    class="w-full border rounded-lg py-2 px-3"
                    placeholder="اسم المؤسسة الرسمي"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    نوع المؤسسة *
                  </label>
                  <select
                    v-model="formData.companyType"
                    required
                    class="w-full border rounded-lg py-2 px-3"
                  >
                    <option value="" disabled>اختر نوع المؤسسة</option>
                    <option
                      v-for="type in companyTypes"
                      :key="type"
                      :value="type"
                    >
                      {{ type }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- معلومات السجل التجاري والضريبي -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    رقم السجل التجاري *
                  </label>
                  <input
                    v-model="formData.commercialRegistry"
                    type="text"
                    required
                    class="w-full border rounded-lg py-2 px-3"
                    placeholder="رقم السجل التجاري"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    الرقم الضريبي
                  </label>
                  <input
                    v-model="formData.taxNumber"
                    type="text"
                    class="w-full border rounded-lg py-2 px-3"
                    placeholder="الرقم الضريبي إن وجد"
                  />
                </div>
              </div>

              <!-- العنوان والموقع الإلكتروني -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    عنوان المؤسسة *
                  </label>
                  <input
                    v-model="formData.address"
                    type="text"
                    required
                    class="w-full border rounded-lg py-2 px-3"
                    placeholder="العنوان التفصيلي للمؤسسة"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    الموقع الإلكتروني
                  </label>
                  <input
                    v-model="formData.website"
                    type="url"
                    class="w-full border rounded-lg py-2 px-3"
                    placeholder="رابط الموقع الإلكتروني إن وجد"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  المستندات المطلوبة *
                </label>
                <div
                  class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
                >
                  <Icon
                    name="ph:upload-simple"
                    class="w-8 h-8 text-gray-400 mx-auto mb-2"
                  />
                  <p class="text-sm text-gray-500 mb-2">
                    قم بتحميل صور واضحة للمستندات التالية:
                  </p>
                  <ul class="text-sm text-gray-500 mb-4 list-disc list-inside">
                    <li>السجل التجاري</li>
                    <li>البطاقة الضريبية</li>
                    <li>عقد التأسيس</li>
                  </ul>
                  <button
                    type="button"
                    class="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200"
                    @click="$refs.fileInput.click()"
                  >
                    اختيار الملفات
                  </button>
                </div>
              </div>
            </template>

            <!-- نموذج الأفراد -->
            <template v-else>
              <!-- مؤشر الخطوات -->
              <div class="mb-8">
                <div class="flex items-center justify-center">
                  <div class="flex items-center">
                    <!-- خطوة 1: البيانات الشخصية -->
                    <div class="flex items-center relative">
                      <div :class="[
                        'rounded-full h-12 w-12 flex items-center justify-center',
                        currentStep === 1 ? 'bg-green-600 text-white' : 'bg-green-100 text-green-600'
                      ]">
                        1
                      </div>
                      <div class="absolute -bottom-6 w-32 text-center text-sm">
                        البيانات الشخصية
                      </div>
                    </div>

                    <div class="h-1 w-12 mx-2 bg-gray-200">
                      <div :class="[
                        'h-full bg-green-600 transition-all duration-500',
                        currentStep > 1 ? 'w-full' : 'w-0'
                      ]"></div>
                    </div>

                    <!-- خطوة 2: الوجه الأمامي -->
                    <div class="flex items-center relative">
                      <div :class="[
                        'rounded-full h-12 w-12 flex items-center justify-center',
                        currentStep === 2 ? 'bg-green-600 text-white' : currentStep > 2 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                      ]">
                        2
                      </div>
                      <div class="absolute -bottom-6 w-32 text-center text-sm">
                        الوجه الأمامي
                      </div>
                    </div>

                    <div class="h-1 w-12 mx-2 bg-gray-200">
                      <div :class="[
                        'h-full bg-green-600 transition-all duration-500',
                        currentStep > 2 ? 'w-full' : 'w-0'
                      ]"></div>
                    </div>

                    <!-- خطوة 3: الوجه الخلفي -->
                    <div class="flex items-center relative">
                      <div :class="[
                        'rounded-full h-12 w-12 flex items-center justify-center',
                        currentStep === 3 ? 'bg-green-600 text-white' : currentStep > 3 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                      ]">
                        3
                      </div>
                      <div class="absolute -bottom-6 w-32 text-center text-sm">
                        الوجه الخلفي
                      </div>
                    </div>

                    <div class="h-1 w-12 mx-2 bg-gray-200">
                      <div :class="[
                        'h-full bg-green-600 transition-all duration-500',
                        currentStep > 3 ? 'w-full' : 'w-0'
                      ]"></div>
                    </div>

                    <!-- خطوة 4: صورة شخصية -->
                    <div class="flex items-center relative">
                      <div :class="[
                        'rounded-full h-12 w-12 flex items-center justify-center',
                        currentStep === 4 ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'
                      ]">
                        4
                      </div>
                      <div class="absolute -bottom-6 w-32 text-center text-sm">
                        صورة شخصية
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- محتوى الخطوات -->
              <div v-if="currentStep === 1">
                <!-- خطوة 1: البيانات الشخصية -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      الاسم الأول *
                    </label>
                    <input
                      v-model="formData.firstName"
                      type="text"
                      required
                      class="w-full border rounded-lg py-2 px-3"
                      placeholder="الاسم الأول"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      اسم العائلة *
                    </label>
                    <input
                      v-model="formData.lastName"
                      type="text"
                      required
                      class="w-full border rounded-lg py-2 px-3"
                      placeholder="اسم العائلة"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      تاريخ الميلاد *
                    </label>
                    <input
                      v-model="formData.birthDate"
                      type="date"
                      required
                      class="w-full border rounded-lg py-2 px-3"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      رقم الهوية *
                    </label>
                    <input
                      v-model="formData.idNumber"
                      type="text"
                      required
                      class="w-full border rounded-lg py-2 px-3"
                      placeholder="رقم الهوية الوطنية"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      رقم الهاتف *
                    </label>
                    <input
                      v-model="formData.phone"
                      type="tel"
                      required
                      class="w-full border rounded-lg py-2 px-3"
                      placeholder="رقم الهاتف"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      البريد الإلكتروني *
                    </label>
                    <input
                      v-model="formData.email"
                      type="email"
                      required
                      class="w-full border rounded-lg py-2 px-3"
                      placeholder="البريد الإلكتروني"
                    />
                  </div>

                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      العنوان *
                    </label>
                    <input
                      v-model="formData.address"
                      type="text"
                      required
                      class="w-full border rounded-lg py-2 px-3"
                      placeholder="العنوان التفصيلي"
                    />
                  </div>
                </div>
              </div>

              <div v-else-if="currentStep > 1" class="space-y-4">
                <h3 class="text-lg font-medium text-center mb-4">
                  {{ getStepTitle() }}
                </h3>

                <div v-if="showCamera" class="relative bg-black rounded-lg overflow-hidden">
                  <!-- شاشة التحميل -->
                  <div v-if="isLoading && !isCameraReady" 
                       class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                    <div class="text-center">
                      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                      <p class="text-white mt-2">جاري تهيئة الكاميرا...</p>
                    </div>
                  </div>

                  <video
                    ref="videoRef"
                    autoplay
                    playsinline
                    class="w-full h-[400px] object-cover mx-auto"
                    :style="{ transform: 'scaleX(-1)' }"
                  ></video>
                  
                  <div class="absolute inset-0 border-2 border-white border-opacity-50 m-8"></div>
                  
                  <div class="absolute top-4 left-0 right-0 text-center">
                    <p class="text-white bg-black bg-opacity-50 p-2 mx-4 rounded">
                      ضع البطاقة داخل الإطار والتقط الصورة
                    </p>
                  </div>
                  
                  <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                    <button
                      type="button"
                      @click="captureImage"
                      :disabled="!isCameraReady"
                      class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Icon name="ph:camera" class="w-5 h-5" />
                      التقاط الصورة
                    </button>
                    <button
                      type="button"
                      @click="closeCamera"
                      class="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                      <Icon name="ph:x" class="w-5 h-5" />
                      إلغاء
                    </button>
                  </div>
                </div>

                <div v-else-if="getCurrentImage()" class="space-y-4">
                  <div class="border-2 border-gray-200 rounded-lg p-4 bg-white">
                    <img 
                      :src="getCurrentImage()" 
                      class="w-full h-[400px] object-contain mx-auto"
                      :alt="getStepTitle()"
                    />
                  </div>
                  <div class="flex justify-center gap-4">
                    <button
                      type="button"
                      @click="retakePhoto"
                      class="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                      <Icon name="ph:camera" class="w-5 h-5" />
                      إعادة التقاط الصورة
                    </button>
                  </div>
                </div>

                <div v-else class="text-center">
                  <button
                    type="button"
                    @click="openCamera"
                    :disabled="isLoading"
                    class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto"
                  >
                    <Icon name="ph:camera" class="w-5 h-5" />
                    {{ isLoading ? 'جاري فتح الكاميرا...' : 'التقاط الصورة' }}
                  </button>
                </div>
              </div>

              <!-- أزرار التنقل -->
              <div class="flex justify-between mt-6">
                <button
                  v-if="currentStep > 1"
                  type="button"
                  @click="goToPreviousStep"
                  class="bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  السابق
                </button>
                <button
                  v-if="currentStep < 4"
                  type="button"
                  @click="goToNextStep"
                  class="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
                >
                  التالي
                </button>
                <button
                  v-else
                  type="submit"
                  :disabled="!selfieImage"
                  class="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
                >
                  إرسال
                </button>
              </div>
            </template>
          </form>

          <!-- رسائل الخطأ والنجاح -->
          <div v-if="error" class="text-red-500 text-sm text-center mt-4">
            {{ error }}
          </div>
          <div v-if="success" class="text-green-500 text-sm text-center mt-4">
            {{ success }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.camera-frame {
  aspect-ratio: 16/9;
}

img {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}
</style>
