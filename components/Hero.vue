<template>
  <div class="relative h-[300px] sm:h-[400px] md:h-[500px] mb-10">
    <div class="absolute inset-0 flex flex-col md:flex-row">
      <div
        class="w-full md:w-1/2 h-2/3 md:h-full bg-green-600 flex items-center justify-center pb-5 pt-2"
      >
        <div class="text-center text-white p-4">
          <h2
            class="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-2 md:mb-4"
          >
            %50
          </h2>
          <h3 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 md:mb-2">
            خصومات
          </h3>
          <p class="text-xl sm:text-2xl md:text-3xl">
            بمناسبة اليوم الوطني السوري
          </p>
          <div class="mt-4 md:mt-8 text-xs sm:text-sm">
            www.reallygreatsite.com
          </div>
        </div>
      </div>
      <div class="w-full md:w-1/2 h-1/2 md:h-full">
        <!-- <NuxtImg
          :src="Car"
          alt="Hero"
          class="w-full h-full object-cover"
          format="jpg"
        /> -->
        <img :src="Car" class="w-full h-full object-cover" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Car from "~/assets/car.jpg";
</script>
