<template>
  <div class="relative lg:w-[90%] mx-auto">
    <div class="flex items-center justify-between py-2.5">
      <!-- Logo -->
      <div class="flex items-center">
        <NuxtLink to="/" class="block">
          <img
            :src="logo"
            alt="بازار سوريا"
            class="h-16 lg:h-14 w-auto transition-all duration-200"
          />
        </NuxtLink>
      </div>

      <!-- Search Bar -->
      <div class="hidden lg:block flex-1 w-full max-w-3xl mx-4 lg:mx-8">
        <div class="relative flex items-center">
          <button
            class="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-full flex items-center justify-center bg-green-600 rounded-l-lg hover:bg-green-700 transition-colors"
          >
            <Icon name="ph:magnifying-glass" class="w-5 h-5 text-white" />
          </button>
          <input
            type="text"
            placeholder="ابحث عن السيارات و الهواتف و أكثر ..."
            class="w-full pl-14 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors text-right"
            dir="rtl"
          />
        </div>
      </div>

      <!-- Desktop Actions -->
      <div class="hidden lg:flex items-center gap-4">
        <button
          class="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <span class="text-sm font-medium">+ أضف إعلانك</span>
        </button>
        <div class="flex items-center gap-4">
          <div class="flex items-center cursor-pointer group">
            <img
              src="https://via.placeholder.com/32"
              alt="User"
              class="w-8 h-8 rounded-full border-2 border-gray-100 group-hover:border-green-500 transition-colors"
            />
            <Icon
              name="ph:caret-down"
              class="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors"
            />
          </div>
          <div class="flex items-center gap-4">
            <button
              class="flex p-1.5 rounded-full hover:bg-gray-100 transition-colors relative"
            >
              <Icon name="ph:bell" class="w-5 h-5 text-gray-500" />
              <span
                class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"
              ></span>
            </button>
            <button
              class="flex p-1.5 rounded-full hover:bg-gray-100 transition-colors relative"
            >
              <Icon name="ph:chat-circle" class="w-5 h-5 text-gray-500" />
              <span
                class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"
              ></span>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Button -->
      <button
        ref="buttonRef"
        class="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        @click="toggleMobileMenu"
      >
        <Icon
          :name="isMobileMenuOpen ? 'ph:x' : 'ph:list'"
          class="w-6 h-6 text-gray-600"
        />
      </button>
    </div>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-full opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-full opacity-0"
    >
      <div
        v-if="isMobileMenuOpen"
        ref="menuRef"
        class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
      >
        <div
          class="absolute top-[61px] left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50 max-h-[calc(100vh-61px)] overflow-y-auto p-6"
        >
          <div class="flex items-center justify-between gap-4">
            <h1 class="text-xl font-bold">القائمة</h1>
            <div
              class="mr-auto text-gray-600 border p-2 flex justify-center items-center rounded-full w-fit h-fit cursor-pointer hover:bg-red-600 hover:text-white hover:scale-105 ease-linear duration-150"
              v-on:click="toggleMobileMenu"
            >
              <Icon name="ph:x" size="25" />
            </div>
          </div>
          <div class="space-y-4 py-4">
            <!-- Mobile Search -->
            <div class="relative flex items-center">
              <button
                class="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-full flex items-center justify-center bg-green-600 rounded-l-lg hover:bg-green-700 transition-colors"
              >
                <Icon name="ph:magnifying-glass" class="w-5 h-5 text-white" />
              </button>
              <input
                type="text"
                placeholder="ابحث عن السيارات و الهواتف و أكثر ..."
                class="w-full pl-14 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors text-right"
                dir="rtl"
              />
            </div>

            <button
              class="w-full flex items-center justify-between px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Icon name="ph:caret-right" class="w-5 h-5" />
              <span class="text-sm font-medium">+ أضف إعلانك</span>
            </button>

            <div
              class="flex items-center justify-around py-4 border-t border-b border-gray-100"
            >
              <button class="flex flex-col items-center space-y-1 group">
                <div class="relative">
                  <Icon
                    name="ph:bell"
                    class="w-6 h-6 text-gray-500 group-hover:text-green-600"
                  />
                  <span
                    class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"
                  ></span>
                </div>
                <span class="text-xs text-gray-500 group-hover:text-green-600"
                  >الإشعارات</span
                >
                <Icon
                  name="ph:caret-right"
                  class="w-4 h-4 text-gray-400 group-hover:text-green-600"
                />
              </button>
              <button class="flex flex-col items-center space-y-1 group">
                <div class="relative">
                  <Icon
                    name="ph:chat-circle"
                    class="w-6 h-6 text-gray-500 group-hover:text-green-600"
                  />
                  <span
                    class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"
                  ></span>
                </div>
                <span class="text-xs text-gray-500 group-hover:text-green-600"
                  >الرسائل</span
                >
                <Icon
                  name="ph:caret-right"
                  class="w-4 h-4 text-gray-400 group-hover:text-green-600"
                />
              </button>
              <button class="flex flex-col items-center space-y-1 group">
                <img
                  src="https://via.placeholder.com/32"
                  alt="User"
                  class="w-8 h-8 rounded-full border-2 border-gray-100 group-hover:border-green-500"
                />
                <span class="text-xs text-gray-500 group-hover:text-green-600"
                  >حسابي</span
                >
                <Icon
                  name="ph:caret-right"
                  class="w-4 h-4 text-gray-400 group-hover:text-green-600"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import logo from "~/assets/logo.png";

const isMobileMenuOpen = ref(false);
const menuRef = ref<HTMLElement | null>(null);
const buttonRef = ref<HTMLElement | null>(null);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const handleClickOutside = (event: MouseEvent) => {
  if (
    menuRef.value &&
    buttonRef.value &&
    !menuRef.value.contains(event.target as Node) &&
    !buttonRef.value.contains(event.target as Node)
  ) {
    isMobileMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});
</script>
