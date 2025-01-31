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
          <!-- Login/Profile Section -->
          <template v-if="!isLoggedIn">
            <div class="relative">
              <button 
                @click="toggleDropdown"
                class="flex items-center gap-2 hover:text-green-600 transition-colors"
              >
                <Icon name="ph:user" class="w-5 h-5" />
                <Icon name="ph:caret-down" class="w-4 h-4" />
              </button>
              <!-- Dropdown menu -->
              <div 
                v-show="isDropdownOpen"
                class="absolute top-full right-0 mt-2 z-50 w-48 bg-white rounded-md shadow-lg py-1"
              >
                <button
                  @click="handleLoginClick"
                  class="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  تسجيل الدخول
                </button>
                <button
                  @click="handleRegisterClick"
                  class="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  حساب جديد
                </button>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="relative dropdown-container">
              <button 
                @click.stop="toggleProfileDropdown"
                class="flex items-center gap-2 hover:text-green-600 transition-colors"
              >
                <img
                  src="https://via.placeholder.com/32"
                  alt="User"
                  class="w-8 h-8 rounded-full border-2 border-gray-100"
                />
                <Icon name="ph:caret-down" class="w-4 h-4" />
              </button>
              <!-- Profile Dropdown Menu -->
              <div 
                v-show="isProfileDropdownOpen"
                class="absolute top-full right-0 mt-2 z-50 w-64 bg-white rounded-md shadow-lg py-2"
              >
                <!-- User Info -->
                <div class="px-4 py-2 border-b border-gray-100">
                  <div class="flex items-center gap-3 mb-2">
                    <img
                      src="https://via.placeholder.com/32"
                      alt="User"
                      class="w-10 h-10 rounded-full border-2 border-gray-100"
                    />
                    <div class="text-right">
                      <p class="font-medium">محمد العامري</p>
                      <p class="text-sm text-gray-500">أهلاً بك</p>
                    </div>
                  </div>
                </div>

                <!-- Menu Items -->
                <div class="py-1" dir="ltr">
                  <NuxtLink
                    to="/profile/wallet"
                    class="flex items-center justify-end gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <span>المحفظة</span>
                    <Icon name="ph:wallet" class="w-5 h-5" />
                  </NuxtLink>

                  <NuxtLink
                    to="/profile/ads"
                    class="flex items-center justify-end gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <span>اعلاناتي</span>
                    <Icon name="ph:megaphone" class="w-5 h-5" />
                  </NuxtLink>

                  <NuxtLink
                    to="/profile/following"
                    class="flex items-center justify-end gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <span>المتابعين</span>
                    <Icon name="ph:users" class="w-5 h-5" />
                  </NuxtLink>

                  <NuxtLink
                    to="/profile/favorites"
                    class="flex items-center justify-end gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <span>المفضلة</span>
                    <Icon name="ph:heart" class="w-5 h-5" />
                  </NuxtLink>

                  <NuxtLink
                    to="/profile/invoices"
                    class="flex items-center justify-end gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <span>الفواتير</span>
                    <Icon name="ph:receipt" class="w-5 h-5" />
                  </NuxtLink>

                  <NuxtLink
                    to="/profile/settings"
                    class="flex items-center justify-end gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <span>الاعدادات</span>
                    <Icon name="ph:gear" class="w-5 h-5" />
                  </NuxtLink>

                  <button
                    @click="handleLogout"
                    class="w-full flex items-center justify-end gap-3 px-4 py-2 text-red-600 hover:bg-gray-50 border-t border-gray-100"
                  >
                    <span>تسجيل الخروج</span>
                    <Icon name="ph:sign-out" class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </template>
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
          class="absolute top-[20px] left-0 mx-5 pb-10 right-0 bg-white border-t border-gray-100 shadow-lg z-50 max-h-[calc(100vh-61px)] overflow-y-auto p-6"
        >
          <!-- Header -->
          <div class="flex items-center justify-between gap-4 mb-6">
            <h1 class="text-xl font-bold">القائمة</h1>
            <div
              class="mr-auto text-gray-600 border p-2 flex justify-center items-center rounded-full w-fit h-fit cursor-pointer hover:bg-red-600 hover:text-white hover:scale-105 ease-linear duration-150"
              v-on:click="toggleMobileMenu"
            >
              <Icon name="ph:x" size="25" />
            </div>
          </div>

          <!-- Search and Add Button -->
          <div class="space-y-4 mb-6">
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
          </div>

          <!-- User Section -->
          <template v-if="isLoggedIn">
            <!-- User Info -->
            <div class="flex items-center gap-3 px-4 mb-6 border-b border-gray-100 pb-4">
              <div class="text-right flex-1">
                <p class="font-medium text-lg">محمد العامري</p>
                <p class="text-sm text-gray-500">أهلاً بك</p>
              </div>
              <img
                src="https://via.placeholder.com/32"
                alt="User"
                class="w-12 h-12 rounded-full border-2 border-gray-100"
              />
            </div>

            <!-- Menu Grid -->
            <div class="grid grid-cols-2 gap-4 mb-6">
              <NuxtLink
                v-for="(item, index) in menuItems"
                :key="index"
                :to="item.to"
                class="flex items-center gap-3 py-3 px-4 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50"
              >
                <Icon :name="item.icon" class="w-5 h-5" />
                <span>{{ item.text }}</span>
              </NuxtLink>
            </div>

            <!-- Notifications and Messages -->
            <div class="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
              <NuxtLink to="/notifications" class="flex items-center justify-center gap-2">
                <div class="relative">
                  <Icon name="ph:bell" class="w-6 h-6 text-gray-600" />
                  <span class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </div>
                <span class="text-sm text-gray-600">الإشعارات</span>
              </NuxtLink>

              <NuxtLink to="/messages" class="flex items-center justify-center gap-2">
                <div class="relative">
                  <Icon name="ph:chat-circle" class="w-6 h-6 text-gray-600" />
                  <span class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </div>
                <span class="text-sm text-gray-600">الرسائل</span>
              </NuxtLink>
            </div>

            <!-- Add Logout Button -->
            <button
              @click="handleLogout"
              class="col-span-2 flex items-center gap-3 py-3 px-4 text-red-600 hover:text-red-700 rounded-lg hover:bg-red-50 border border-red-100"
            >
              <Icon name="ph:sign-out" class="w-5 h-5" />
              <span>تسجيل الخروج</span>
            </button>
          </template>

          <!-- Login/Register Section -->
          <template v-else>
            <div class="grid grid-cols-2 gap-4">
              <button 
                @click="handleLoginClick"
                class="flex flex-col items-center py-3 px-4 rounded-lg hover:bg-gray-50 group"
              >
                <Icon
                  name="ph:sign-in"
                  class="w-6 h-6 text-gray-500 group-hover:text-green-600 mb-1"
                />
                <span class="text-sm text-gray-500 group-hover:text-green-600"
                  >تسجيل الدخول</span
                >
              </button>
              <button 
                @click="handleRegisterClick"
                class="flex flex-col items-center py-3 px-4 rounded-lg hover:bg-gray-50 group"
              >
                <Icon
                  name="ph:user-plus"
                  class="w-6 h-6 text-gray-500 group-hover:text-green-600 mb-1"
                />
                <span class="text-sm text-gray-500 group-hover:text-green-600"
                  >حساب جديد</span
                >
              </button>
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import logo from "~/assets/logo.png";
import { useRouter } from "vue-router";

const props = defineProps({
  isLoggedIn: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['open-login', 'open-register'])

const isMobileMenuOpen = ref(false)
const menuRef = ref(null)
const buttonRef = ref(null)
const isDropdownOpen = ref(false)
const dropdownRef = ref(null)
const router = useRouter()
const isProfileDropdownOpen = ref(false)

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const handleLoginClick = () => {
  emit('open-login')
  closeDropdown()
}

const handleRegisterClick = () => {
  emit('open-register')
  closeDropdown()
}

// Handle click outside for dropdown
onMounted(() => {
  document.addEventListener('click', (event) => {
    const dropdown = document.querySelector('.relative') // Adjust selector as needed
    if (dropdown && !dropdown.contains(event.target)) {
      closeDropdown()
    }
  })
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})

// Mobile menu handlers
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const handleClickOutside = (event) => {
  if (
    menuRef.value &&
    buttonRef.value &&
    !menuRef.value.contains(event.target) &&
    !buttonRef.value.contains(event.target)
  ) {
    isMobileMenuOpen.value = false
  }
}

const handleLogout = async () => {
  try {
    // Remove token from localStorage
    localStorage.removeItem('session-token')
    
    // Close any open menus
    isProfileDropdownOpen.value = false
    isMobileMenuOpen.value = false
    
    // Optional: Call logout API endpoint
    // await fetch('/api/auth/logout')
    
    // Redirect to home page
    router.push('/')
    
    // Reload page to reset state
    window.location.reload()
  } catch (error) {
    console.error('Error during logout:', error)
  }
}

const toggleProfileDropdown = () => {
  isProfileDropdownOpen.value = !isProfileDropdownOpen.value
}

// Handle click outside for profile dropdown
onMounted(() => {
  document.addEventListener('click', (event) => {
    const profileDropdown = document.querySelector('.dropdown-container')
    if (profileDropdown && !profileDropdown.contains(event.target)) {
      isProfileDropdownOpen.value = false
    }
  })
})

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener("mousedown", handleClickOutside)
})

// Add this to your setup:
const menuItems = [
  { to: '/profile/wallet', icon: 'ph:wallet', text: 'المحفظة' },
  { to: '/profile/ads', icon: 'ph:megaphone', text: 'اعلاناتي' },
  { to: '/profile/following', icon: 'ph:users', text: 'المتابعين' },
  { to: '/profile/favorites', icon: 'ph:heart', text: 'المفضلة' },
  { to: '/profile/invoices', icon: 'ph:receipt', text: 'الفواتير' },
  { to: '/profile/settings', icon: 'ph:gear', text: 'الاعدادات' },
  { to: '/contact', icon: 'ph:phone', text: 'اتصل بنا' }
]
</script>

<style scoped>
.dropdown-container {
  position: relative;
  display: inline-block;
}
</style>
