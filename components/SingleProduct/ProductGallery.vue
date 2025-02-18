<template>
  <div class="relative">
    <div class="grid grid-cols-5 gap-2 p-4">
      <!-- Main large image -->
      <div class="col-span-4">
        <img
          :src="currentImage ? currentImage : mainImage"
          :alt="title"
          class="w-full h-[400px] object-cover rounded-lg cursor-pointer"
          @click="handleMainImageClick"
        />
      </div>
      <!-- Thumbnail images -->
      <div class="flex flex-col gap-4">
        <div
          v-for="(img, index) in gallery"
          :key="index"
          class="cursor-pointer border-2 border-gray-200 rounded-lg overflow-hidden"
          @click="handleChangeImage(img)"
        >
          <img :src="img" :alt="title" class="w-full h-20 object-cover" />
        </div>
      </div>
    </div>

    <!-- Image Preview Modal -->
    <div
      v-if="showPreview"
      class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center"
    >
      <div class="relative max-w-4xl mx-auto">
        <!-- Close Button -->
        <button
          @click="closePreview"
          class="absolute top-4 right-4 text-white text-4xl"
        >
          ×
        </button>

        <!-- Navigation Buttons -->
        <button
          @click="prevImage"
          class="absolute -left-20 top-1/2 text-white text-[60px] bg-black rounded-full flex items-center justify-center h-[60px] w-[60px] pb-2 hover:bg-gray-800 transition-colors duration-300"
        >
          ›
        </button>
        <button
          @click="nextImage"
          class="absolute -right-20 top-1/2 text-white text-[60px] bg-black rounded-full flex items-center justify-center h-[60px] w-[60px] pb-2 hover:bg-gray-800 transition-colors duration-300"
        >
          ‹
        </button>

        <!-- Preview Image -->
        <img
          :src="previewImage"
          :alt="title"
          class="max-h-[90vh] max-w-full object-contain"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  mainImage: String,
  gallery: Array,
  title: String,
});

// Use ref instead of computed since we need to modify it
const currentImage = ref(props.mainImage);
const galleryImages = ref(props.gallery);
const productTitle = ref(props.title);

const showPreview = ref(false);
const previewImage = ref("");
const currentIndex = ref(0);

const openPreview = (img) => {
  previewImage.value = img;
  showPreview.value = true;
  currentIndex.value = galleryImages.value.indexOf(img);
};

const closePreview = () => {
  showPreview.value = false;
};

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % galleryImages.value.length;
  previewImage.value = galleryImages.value[currentIndex.value];
};

const prevImage = () => {
  currentIndex.value =
    currentIndex.value - 1 < 0
      ? galleryImages.value.length - 1
      : currentIndex.value - 1;
  previewImage.value = galleryImages.value[currentIndex.value];
};

// تحديث دالة handleChangeImage لتغيير الصورة الرئيسية فقط
const handleChangeImage = (img) => {
  currentImage.value = img;
};

// تحديث دالة handleMainImageClick لفتح المعاينة فقط
const handleMainImageClick = () => {
  const imageToShow = currentImage.value || props.mainImage;
  openPreview(imageToShow);
};

// تعريف معالج الأحداث كدالة منفصلة
const handleKeydown = (e) => {
  if (!showPreview.value) return;

  if (e.key === "ArrowRight") nextImage();
  if (e.key === "ArrowLeft") prevImage();
  if (e.key === "Escape") closePreview();
};

// إضافة استماع لأحداث لوحة المفاتيح
onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

// إزالة الاستماع عند تدمير المكون
onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>
