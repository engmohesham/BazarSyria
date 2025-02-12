<script setup>
definePageMeta({
  middleware: ["auth"]
});

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

// Camera-related code - exactly like camera-test.vue
const canvas = ref(null);
const video = ref(null);
const ctx = ref(null);
const isStreaming = ref(false);

const constraints = ref({
  audio: false,
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: 'environment' // Try to use back camera first
  }
});

onMounted(async () => {
  if (video.value && canvas.value) {
    ctx.value = canvas.value.getContext("2d");
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints.value);
      SetStream(stream);
    } catch (err) {
      console.error('Failed to get camera:', err);
      // Fallback to any available camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: true
        });
        SetStream(stream);
      } catch (e) {
        console.error('Camera access failed:', e);
        error.value = 'فشل في الوصول إلى الكاميرا';
      }
    }
  }
});

function SetStream(stream) {
  video.value.srcObject = stream;
  video.value.play();
  
  video.value.onloadedmetadata = () => {
    isStreaming.value = true;
    Draw();
  };
}

function Draw() {
  if (isStreaming.value && ctx.value && video.value) {
    ctx.value.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height);
    requestAnimationFrame(Draw);
  }
}

// Cleanup on component unmount
onUnmounted(() => {
  if (video.value && video.value.srcObject) {
    const tracks = video.value.srcObject.getTracks();
    tracks.forEach(track => track.stop());
  }
  isStreaming.value = false;
});

// Add functions needed for identity verification
const handleCapture = (imageData) => {
  if (currentStep.value === 2) {
    frontCardImage.value = imageData;
  } else if (currentStep.value === 3) {
    backCardImage.value = imageData;
  } else if (currentStep.value === 4) {
    selfieImage.value = imageData;
  }
  showCamera.value = false;
};

const openCamera = () => {
  showCamera.value = true;
};

const closeCamera = () => {
  showCamera.value = false;
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

// Add this utility function at the top of the script
const compressImage = async (base64String, maxWidth = 800) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64String;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Calculate new dimensions maintaining aspect ratio
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = (maxWidth * height) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to compressed JPEG
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
      resolve(compressedBase64);
    };
  });
};

// Modified handleSubmit function
const handleSubmit = async () => {
  if (!frontCardImage.value || !backCardImage.value || !selfieImage.value) {
    error.value = 'يرجى إكمال جميع الصور المطلوبة';
    return;
  }

  try {
    isLoading.value = true;
    
    // Create FormData object
    const formDataToSend = new FormData();
    
    // Add text fields
    formDataToSend.append('userType', 'personal');
    formDataToSend.append('firstName', formData.value.firstName);
    formDataToSend.append('lastName', formData.value.lastName);
    formDataToSend.append('address', formData.value.address);
    formDataToSend.append('birthDate', formData.value.birthDate);
    formDataToSend.append('identity', formData.value.idNumber);

    // Compress images before converting to blobs
    const compressedFront = await compressImage(frontCardImage.value);
    const compressedBack = await compressImage(backCardImage.value);
    const compressedSelfie = await compressImage(selfieImage.value);

    // Convert compressed base64 to blobs
    const frontBlob = await fetch(compressedFront).then(r => r.blob());
    const backBlob = await fetch(compressedBack).then(r => r.blob());
    const selfieBlob = await fetch(compressedSelfie).then(r => r.blob());

    formDataToSend.append('identificationFront', frontBlob, 'front-card.jpg');
    formDataToSend.append('identificationBack', backBlob, 'back-card.jpg');
    formDataToSend.append('faceFrontSide', selfieBlob, 'face-front.jpg');

    const { error: apiError } = await updateIdentity(formDataToSend);
    if (apiError) throw apiError;

    success.value = "تم إرسال طلب التوثيق بنجاح";
    setTimeout(() => {
      router.push("/account/settings");
    }, 2000);
  } catch (err) {
    error.value = "فشل في إرسال طلب التوثيق";
    console.error("Error updating identity:", err);
  } finally {
    isLoading.value = false;
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

// Add a computed property to determine camera type
const cameraType = computed(() => {
  return currentStep.value === 4 ? 'selfie' : 'id';
});
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
                <div class="flex items-center justify-center gap-5 overflow-x-auto overflow-y-hidden h-[180px] w-full pr-36 md:pr-0">
                  <div class="flex items-center">
                    <!-- خطوة 1: البيانات الشخصية -->
                    <div class="flex items-center relative">
                      <div :class="[
                        'rounded-full h-12 w-12 flex items-center justify-center',
                        currentStep === 1 ? 'bg-green-600 text-white' : 'bg-green-100 text-green-600'
                      ]">
                        1
                      </div>
                      <div class="absolute -left-10 -bottom-8 w-32 text-center text-sm">
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
                      <div class="absolute -left-10 -bottom-8 w-32 text-center text-sm">
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
                      <div class="absolute -left-10 -bottom-8 w-32 text-center text-sm">
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
                      <div class="absolute -left-10 -bottom-8 w-32 text-center text-sm">
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
                <h3 class="text-lg font-medium text-center mb-4 overflow-x-auto w-full">
                  {{ getStepTitle() }}
                </h3>

                <div v-if="showCamera" class="relative">
                  <video 
                    ref="video" 
                    autoplay 
                    playsinline 
                    webkit-playsinline 
                    muted 
                    class="hidden"
                  ></video>

                  <canvas 
                    ref="canvas" 
                    width="1280" 
                    height="720" 
                    class="bg-black rounded-3xl max-w-full"
                  ></canvas>

                  <!-- Camera controls -->
                  <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                    <button
                      type="button"
                      @click="captureImage"
                      :disabled="!isStreaming"
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

    <!-- Camera UI -->
    <div v-if="showCamera" class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div class="w-full max-w-2xl">
        <CameraCapture 
          :type="cameraType"
          @capture="handleCapture" 
          @close="closeCamera" 
        />
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
