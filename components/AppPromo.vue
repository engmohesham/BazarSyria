<template>
  <div class="bg-[#0C9547] text-white py-12">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row items-center justify-between gap-8" dir="rtl">
        <div class="md:w-1/2 space-y-4">
          <div class="flex items-center gap-2">
            <h2 class="text-3xl md:text-4xl font-bold">تطبيقنا قريبًا بين إيديك!</h2>
            <Icon name="emojione:rocket" class="w-8 h-8" />
          </div>
          <p class="text-lg md:text-xl opacity-90">
            قريباً رح تنزل تطبيقنا اللي بيخليك تبيع وتشتري المستعمل بكل سهولة وراحة
          </p>
          <p class="text-lg opacity-80">
            تابعونا واستنوا المفاجآت، لأنو التجربة معنا رح تكون غير
          </p>
        </div>
        <div class="md:w-1/2 flex justify-center">
          <div class="relative w-64 h-[450px]">
            <img
              :src="phone"
              alt="Mobile App Preview"
              class="w-full h-full object-cover rounded-[40px]"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import phone from '~/assets/phone.png'
</script>