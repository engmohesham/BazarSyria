<template>
  <footer class="bg-white border-t border-gray-100" dir="rtl">
    <div class="container md:w-[90%] mx-auto px-4 pt-16">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Logo and Description - Right Side -->
        <div class="md:col-span-3 flex flex-col justify-start items-start gap-4">
          <div class="flex flex-col items-start">
            <img :src="logo" alt="يلا سوريا" class="h-24 w-auto" />
            <p class="text-gray-600 text-sm leading-relaxed text-right w-2/3">
              منصة بازار سوريا لبيع جميع الخدمات المستعملة بسهولة من خلال موقعنا
              من اي مكان و في اي وقت ممكن .
            </p>
          </div>
        </div>

        <!-- Services - Middle -->
        <div class="flex flex-col items-start justify-start">
          <ul class="space-y-2">
            <h1 class="text-gray-600 text-xl font-extrabold mb-2">الخدمات</h1>
            <li v-for="service in services" :key="service">
              <a
                href="#"
                class="text-gray-600 hover:text-green-600 transition-colors text-sm"
              >
                {{ service }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Email - Left Side -->
        <!-- <div class="flex md:flex-wrap lg:flex-nowrap flex-row gap-2 justify-start items-center">
          <a
            v-for="icon in socialIcons"
            :key="icon"
            href="#"
            class="group p-3 hover:scale-110 hover:bg-green-600 text-gray-600 hover:text-white transition-all ease-linear duration-100 flex items-center justify-center rounded-full"
          >
            <Icon
              :name="icon"
              class="w-5 h-5 group-hover:scale-125 transition-all ease-linear duration-150"
            />
          </a>
        </div> -->
      </div>
    </div>
    <div
      class="flex flex-row gap-4 justify-center items-center mt-8 bg-black text-white text-center"
    >
      <p class="text-sm leading-relaxed text-right">جميع الحقوق محفوظة</p>
      <p class="text-sm leading-relaxed text-right">2025</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import logo from "~/assets/logo.png";

const services = [
  "بيع السيارات",
  "بيع الاجهزة الالكتروني",
  "ادوات المنازل",
  "مستلزمات شخصية",
  "خدمات اخري",
];

const socialIcons = [
  "ph:linkedin-logo-bold",
  "ph:instagram-logo-bold",
  "ph:facebook-logo-bold",
  "ph:dribbble-logo-bold",
  "ph:behance-logo-bold",
];
</script>
