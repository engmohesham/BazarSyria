<template>
  <div
    class="flex sticky lg:top-[155px] md:top-[127px] top-[110px] z-40 flex-col gap-4"
  >
    <!-- User Info -->
    <div class="flex items-center gap-3">
      <div class="relative">
        <div
          class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center"
        >
          <img
            src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fstock.adobe.com%2Faz%2Fimages%2Fnon-rubber-stamp%2F67591673&psig=AOvVaw3pV8avN6u7LbVWGaEdzYNl&ust=1738204736757000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCOC-0a_zmYsDFQAAAAAdAAAAABAE"
            alt="User Avatar"
            class="w-full h-full rounded-full object-cover"
          />
        </div>
        <div
          class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
        ></div>
      </div>
      <div>
        <h3 class="font-semibold">عمر بن خطاب</h3>
        <p class="text-sm text-gray-500">عضو منذ 2019</p>
      </div>
      <button class="bg-green-500 text-white px-2 py-1 rounded-md">
        متابعة
      </button>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col gap-2">
      <button
        class="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <Icon name="ph:phone" class="inline-block ml-2" />
        محادثة
      </button>
      <button
        class="w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      >
        <Icon name="ph:percent" class="inline-block ml-2" />
        مكالمة
      </button>
      <button
        class="w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
      >
        <Icon name="ph:whatsapp-logo" class="inline-block ml-2" />
        واتساب
      </button>
    </div>

    <!-- Safety Notice -->
    <div class="bg-gray-50 p-4 rounded-lg text-sm">
      <h4 class="font-semibold mb-2">سياسات حمايتنا</h4>
      <ul class="text-gray-600 space-y-2">
        <li class="flex items-start gap-2">
          <Icon name="ph:info" class="w-5 h-5 mt-0.5 text-gray-400" />
          <span>تأكد من فحص السيارة قبل شراء أي شيء.</span>
        </li>
        <li class="flex items-start gap-2">
          <Icon name="ph:warning" class="w-5 h-5 mt-0.5 text-gray-400" />
          <span>لا تدفع أي مبلغ قبل معاينة السيارة شخصياً.</span>
        </li>
        <li class="flex items-start gap-2">
          <Icon name="ph:shield" class="w-5 h-5 mt-0.5 text-gray-400" />
          <span>نوصي بالتواصل مع البائع من خلال تطبيقنا.</span>
        </li>
      </ul>
    </div>
    <!-- Advertisement Banner -->
    <div class="p-4">
      <img
        :src="car"
        alt="Advertisement"
        class="w-full rounded-lg"
      />
    </div>
  </div>
</template>

<script setup>
import car from '~/assets/cars/car.jpg'

</script>