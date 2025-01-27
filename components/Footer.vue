<template>
  <footer class="bg-white border-t border-gray-100" dir="rtl">
    <div class="container mx-auto px-4 py-16">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
        <!-- Logo and Description - Right Side -->
        <div class="md:col-span-5 flex flex-col items-start">
          <img :src="logo" alt="يلا سوريا" class="h-16 w-auto mb-4" />
          <p class="text-gray-600 text-sm leading-relaxed text-right">
            منصة بازار سوريا لبيع جميع الخدمات المستعملة بسهولة من خلال موقعنا من اي مكان و في اي وقت ممكن.
          </p>
        </div>

        <!-- Services - Middle -->
        <div class="md:col-span-4">
          <ul class="space-y-2">
            <li v-for="service in services" :key="service">
              <a href="#" class="text-gray-600 hover:text-green-600 transition-colors text-sm">
                {{ service }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Social Links - Left Side -->
        <div class="md:col-span-3 flex items-center gap-4 justify-end">
          <a
            v-for="icon in socialIcons"
            :key="icon"
            href="#"
            class="p-3 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <Icon 
              :name="icon"
              class="w-5 h-5 text-gray-600 hover:text-green-600 transition-colors"
            />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import logo from '~/assets/logo.png'

const services = [
  'بيع السيارات',
  'بيع الاجهزة الالكتروني',
  'ادوات المنازل',
  'مستلزمات شخصية',
  'خدمات اخري',
]

const socialIcons = [
  'ph:envelope-simple',
  'ph:instagram-logo',
  'ph:facebook-logo',
  'ph:dribbble-logo',
  'ph:behance-logo'
]
</script> 