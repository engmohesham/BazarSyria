<template>
  <div class="relative h-[300px] sm:h-[400px] md:h-[500px] mb-10">
    <!-- Slider Container -->
    <div v-if="slides.length" class="relative h-full overflow-hidden">
      <!-- Slides -->
      <div 
        v-for="(slide, index) in slides" 
        :key="slide._id"
        class="absolute inset-0 transition-opacity duration-500"
        :class="{ 'opacity-0': currentSlide !== index }"
      >
        <div class="absolute inset-0 flex flex-col md:flex-row">
          <!-- Content Section -->
          <div class="w-full md:w-1/2 h-2/3 md:h-full bg-green-600 flex items-center justify-center pb-5 pt-2">
            <div class="text-center text-white p-4">
              <h2 class="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-2 md:mb-4">
                {{ slide.discount }}%
              </h2>
              <h3 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 md:mb-2">
                {{ slide.title }}
              </h3>
              <p class="text-xl sm:text-2xl md:text-3xl">
                {{ slide.description }}
              </p>
              <div class="mt-4 md:mt-8 text-xs sm:text-sm">
                {{ slide.website }}
              </div>
            </div>
          </div>
          <!-- Image Section -->
          <div class="w-full md:w-1/2 h-1/2 md:h-full">
            <img 
              :src="slide.image" 
              :alt="slide.title"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <!-- Navigation Arrows -->
      <button 
        @click="prevSlide"
        class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors z-10"
      >
        <PhCaretLeft class="w-6 h-6 text-green-600" weight="bold" />
      </button>
      
      <button 
        @click="nextSlide"
        class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors z-10"
      >
        <PhCaretRight class="w-6 h-6 text-green-600" weight="bold" />
      </button>

      <!-- Dots Navigation -->
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        <button
          v-for="(_, index) in slides"
          :key="index"
          @click="currentSlide = index"
          class="w-3 h-3 rounded-full transition-colors"
          :class="currentSlide === index ? 'bg-white' : 'bg-white/60 hover:bg-white'"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-else-if="isLoading" class="h-full flex items-center justify-center bg-gray-100">
      <p class="text-gray-500">جاري التحميل...</p>
    </div>

    <!-- Fallback Content when no data -->
    <div v-else class="h-full">
      <div class="absolute inset-0 flex flex-col md:flex-row">
        <!-- Fallback Content Section -->
        <div class="w-full md:w-1/2 h-2/3 md:h-full bg-green-600 flex items-center justify-center pb-5 pt-2">
          <div class="text-center text-white p-4">
            <h2 class="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-2 md:mb-4">
              50%
            </h2>
            <h3 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 md:mb-2">
              عروض حصرية
            </h3>
            <p class="text-xl sm:text-2xl md:text-3xl">
              احصل على أفضل العروض والخصومات
            </p>
            <div class="mt-4 md:mt-8 text-xs sm:text-sm">
              www.example.com
            </div>
          </div>
        </div>
        <!-- Fallback Image Section -->
        <div class="w-full md:w-1/2 h-1/2 md:h-full">
          <img 
            src="~/assets/cars/car.jpg" 
            alt="عروض حصرية"
            class="w-full h-full object-cover"
            onerror="this.src='https://via.placeholder.com/800x600?text=عروض+حصرية'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useServices } from '~/composables/useServices';
import { PhCaretLeft, PhCaretRight } from '@phosphor-icons/vue';
import car from '~/assets/cars/car.jpg';
import car2 from '~/assets/cars/car2.jpg';

const { getSlides } = useServices();
const slides = ref([]);
const currentSlide = ref(0);
const isLoading = ref(true);
const autoplayInterval = ref(null);

// Fetch slides from API
const fetchSlides = async () => {
  try {
    isLoading.value = true;
    const { data, error } = await getSlides();
    
    if (error) {
      console.error('Error fetching slides:', error);
      slides.value = getFallbackSlides(); // إضافة محتوى احتياطي
      return;
    }

    if (!data || data.length === 0) {
      slides.value = getFallbackSlides(); // إضافة محتوى احتياطي
      return;
    }

    slides.value = data;
  } catch (err) {
    console.error('Error fetching slides:', err);
    slides.value = getFallbackSlides(); // إضافة محتوى احتياطي
  } finally {
    isLoading.value = false;
  }
};

// دالة للحصول على المحتوى الاحتياطي
const getFallbackSlides = () => {
  return [
    {
      _id: 'fallback-1',
      title: 'عروض حصرية',
      description: 'احصل على أفضل العروض والخصومات',
      discount: 50,
      website: 'www.example.com',
      image: car
    },
    {
      _id: 'fallback-2',
      title: 'تخفيضات كبرى',
      description: 'وفر أكثر مع عروضنا المميزة',
      discount: 70,
      website: 'www.example.com',
      image: car2
    }
  ];
};

// Navigation methods
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length;
  resetAutoplay();
};

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? slides.value.length - 1 : currentSlide.value - 1;
  resetAutoplay();
};

// Autoplay functionality
const startAutoplay = () => {
  autoplayInterval.value = setInterval(() => {
    nextSlide();
  }, 5000); // تغيير الشريحة كل 5 ثواني
};

const resetAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value);
    startAutoplay();
  }
};

// Lifecycle hooks
onMounted(async () => {
  await fetchSlides();
  if (slides.value.length) {
    startAutoplay();
  }
});

onBeforeUnmount(() => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value);
  }
});
</script>

<style scoped>
.transition-opacity {
  transition: opacity 0.5s ease-in-out;
}

/* تحسين مظهر الأزرار عند التحويم */
button:hover {
  transform: scale(1.05);
}

button:active {
  transform: scale(0.95);
}

/* تأثيرات انتقالية سلسة */
.transition-colors {
  transition: all 0.3s ease-in-out;
}

/* إضافة تأثيرات للمحتوى الاحتياطي */
.fallback-content {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* تحسين مظهر الصور الاحتياطية */
img[src*="placeholder.com"] {
  filter: brightness(0.95);
  background-color: #f3f4f6;
}
</style>
