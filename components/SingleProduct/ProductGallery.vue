<template>
  <div class="relative">
    <div class="grid grid-cols-5 gap-2 p-4">
      <!-- Main large image -->
      <div class="col-span-4">
        <img
          :src="currentImage ? currentImage : mainImage"
          :alt="title"
          class="w-full h-[400px] object-cover rounded-lg"
        />
      </div>
      <!-- Thumbnail images -->
      <div class="flex flex-col gap-4">
        <div
          v-for="(img, index) in gallery"
          :key="index"
          class="cursor-pointer border-2 border-gray-200 rounded-lg overflow-hidden"
          v-on:click="
            {
              handleChangeImage(img);
            }
          "
        >
          <img :src="img" :alt="title" class="w-full h-20 object-cover" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  mainImage: String,
  gallery: Array,
  title: String,
});

// Use ref instead of computed since we need to modify it
const currentImage = ref(props.mainImage);
const galleryImages = ref(props.gallery);
const productTitle = ref(props.title);

const handleChangeImage = (img) => {
  currentImage.value = img;
};
</script>
