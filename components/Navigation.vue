<template>
  <nav class="border-t border-gray-100 relative" dir="rtl">
    <div class="container mx-auto">
      <!-- Desktop Navigation -->
      <div class="hidden md:block">
        <ul class="flex items-center justify-start space-x-reverse space-x-10 py-5">
          <li v-for="(item, index) in menuItems" :key="index">
            <NuxtLink
              :to="item.href"
              class="text-gray-700 hover:text-green-600 text-[13px] font-semibold transition-colors whitespace-nowrap block"
            >
              {{ item.name }}
            </NuxtLink>
          </li>
          <li class="relative">
            <button
              ref="moreButtonRef"
              @click="toggleMoreMenu"
              class="flex items-center text-gray-700 hover:text-green-600 text-[13px] font-semibold transition-colors"
            >
              المزيد
              <Icon name="ph:caret-down" class="w-4 h-4 mr-1" />
            </button>
            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <div v-if="isMoreMenuOpen" ref="moreMenuRef" class="absolute top-full right-0 bg-white border border-gray-100 rounded-lg shadow-lg py-2 min-w-[200px] z-50">
                <NuxtLink
                  v-for="(item, index) in moreItems"
                  :key="index"
                  :to="item.href"
                  class="block px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors"
                >
                  {{ item.name }}
                </NuxtLink>
              </div>
            </Transition>
          </li>
        </ul>
      </div>

      <!-- Mobile Navigation -->
      <div class="md:hidden">
        <button
          ref="mobileButtonRef"
          @click="toggleMobileMenu"
          class="flex items-center justify-between w-full py-3 px-4 text-gray-700 hover:text-green-600 transition-colors"
        >
          <div class="flex items-center">
            <span class="text-sm font-semibold ml-2">القائمة</span>
            <Icon :name="isMobileMenuOpen ? 'ph:x' : 'ph:list'" class="w-5 h-5" />
          </div>
        </button>
        
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform -translate-y-full opacity-0"
          enter-to-class="transform translate-y-0 opacity-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="transform translate-y-0 opacity-100"
          leave-to-class="transform -translate-y-full opacity-0"
        >
          <div v-if="isMobileMenuOpen" ref="mobileMenuRef" class="fixed left-0 right-0 top-[125px] bottom-0 bg-white border-t border-gray-100 shadow-lg z-50 overflow-y-auto">
            <div class="container mx-auto px-4 py-2">
              <ul class="space-y-2">
                <li v-for="(item, index) in menuItems" :key="index">
                  <NuxtLink
                    :to="item.href"
                    class="block py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-green-600 transition-colors text-right"
                  >
                    <span class="text-sm font-semibold">{{ item.name }}</span>
                  </NuxtLink>
                </li>
                <li class="border-t border-gray-100 pt-2">
                  <NuxtLink
                    v-for="(item, index) in moreItems"
                    :key="index"
                    :to="item.href"
                    class="block py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-green-600 transition-colors text-right"
                  >
                    <span class="text-sm font-semibold">{{ item.name }}</span>
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const menuItems = [
  { name: 'عربيات و قطع غيار', href: '#' },
  { name: 'العقارات', href: '#' },
  { name: 'موبايلات', href: '#' },
  { name: 'وظائف', href: '#' },
  { name: 'تصميم و برمجة', href: '#' },
  { name: 'أجهزة إلكترونية', href: '#' },
]

const moreItems = [
  { name: 'المزيد من الخدمات', href: '#' },
  { name: 'خدمة 1', href: '#' },
  { name: 'خدمة 2', href: '#' },
]

const isMoreMenuOpen = ref(false)
const isMobileMenuOpen = ref(false)
const moreMenuRef = ref<HTMLElement | null>(null)
const moreButtonRef = ref<HTMLElement | null>(null)
const mobileMenuRef = ref<HTMLElement | null>(null)
const mobileButtonRef = ref<HTMLElement | null>(null)

const toggleMoreMenu = () => {
  isMoreMenuOpen.value = !isMoreMenuOpen.value
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const handleClickOutside = (event: MouseEvent) => {
  // Handle more menu click outside
  if (
    moreMenuRef.value &&
    moreButtonRef.value &&
    !moreMenuRef.value.contains(event.target as Node) &&
    !moreButtonRef.value.contains(event.target as Node)
  ) {
    isMoreMenuOpen.value = false
  }

  // Handle mobile menu click outside
  if (
    mobileMenuRef.value &&
    mobileButtonRef.value &&
    !mobileMenuRef.value.contains(event.target as Node) &&
    !mobileButtonRef.value.contains(event.target as Node)
  ) {
    isMobileMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>