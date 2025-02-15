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
            <PhMagnifyingGlass class="w-5 h-5 text-white" />
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
          v-if="isLoggedIn"
          @click="navigateTo('/create-ad')"
          class="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <PhPlus class="w-5 h-5" />
          <span class="text-sm font-medium">أضف إعلانك</span>
        </button>
        <button
          v-else="isLoggedIn"
          @click="emit('open-login')"
          class="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <PhPlus class="w-5 h-5" />
          <span class="text-sm font-medium">أضف إعلانك</span>
        </button>
        <div class="flex items-center gap-4">
          <!-- Login/Profile Section -->
          <template v-if="!isLoggedIn">
            <div class="relative">
              <button
                @click="toggleDropdown"
                class="flex items-center gap-2 hover:text-green-600 transition-colors"
              >
                <PhUser class="w-5 h-5" />
                <PhCaretDown class="w-4 h-4" />
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
                  :src="userAvatar"
                  alt="User"
                  class="w-8 h-8 rounded-full object-cover border border-gray-200"
                />
                <span class="text-gray-700">{{ userName }}</span>
                <PhCaretDown
                  class="w-4 h-4 text-gray-500"
                  :class="{ 'transform rotate-180': isProfileDropdownOpen }"
                />
              </button>
              <!-- Profile Dropdown Menu -->
              <div
                v-show="isProfileDropdownOpen"
                class="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
              >
                <!-- User Info -->
                <div
                  @click="navigateTo('/account')"
                  class="flex items-center justify-end gap-3 px-4 py-3 border-b border-gray-100 cursor-pointer"
                >
                  <div class="text-right">
                    <p class="font-medium">{{ userName }}</p>
                    <p class="text-sm text-gray-500">عرض الملف الشخصي</p>
                  </div>
                  <img
                    :src="userAvatar"
                    alt="User"
                    class="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                </div>

                <!-- Menu Items -->
                <div class="py-1" dir="rtl">
                  <!-- <NuxtLink
                    to="/account/profile/wallet"
                    class="flex items-center justify-end gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <span>المحفظة</span>
                    <PhWallet class="w-5 h-5" />
                  </NuxtLink> -->

                  <button
                    @click="navigateTo('/account/profile/my-ads')"
                    class="flex items-center justify-end gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <PhMegaphone class="w-5 h-5" />
                    <span>اعلاناتي</span>
                  </button>

                  <button
                    @click="navigateTo('/account/profile/following')"
                    class="flex items-center justify-end gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <PhUsers class="w-5 h-5" />
                    <span>المتابعين</span>
                  </button>

                  <!-- <NuxtLink
                    to="/account/profile/favorites"
                    class="flex items-center justify-end gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <span>المفضلة</span>
                    <PhHeart class="w-5 h-5" />
                  </NuxtLink> -->

                  <button
                    @click="navigateTo('/account/chat')"
                    class="flex items-center justify-end gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <PhChatCircle class="w-5 h-5" />
                    <span>المحادثات</span>
                  </button>

                  <button
                    to="/account/settings"
                    class="flex items-center justify-end gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <PhGear class="w-5 h-5" />
                    <span>الاعدادات</span>
                  </button>

                  <button
                    @click="handleLogout"
                    class="w-full flex items-center justify-start gap-3 px-4 py-2 text-red-600 hover:bg-gray-50 border-t border-gray-100"
                  >
                    <PhSignOut class="w-5 h-5" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              </div>
            </div>
          </template>
          <div class="flex items-center gap-4">
            <!-- <button
              class="flex p-1.5 rounded-full hover:bg-gray-100 transition-colors relative"
            >
              <PhBell class="w-5 h-5 text-gray-500" />
              <span
                class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"
              ></span>
            </button> -->
            <button
              @click="navigateTo('/account/chat')"
              class="flex p-1.5 rounded-full hover:bg-gray-100 transition-colors relative"
            >
              <PhChatCircle class="w-5 h-5 text-gray-500" />
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
        <PhList class="w-6 h-6 text-gray-600" />
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
        class="lg:hidden fixed mt-20 inset-0 bg-black bg-opacity-50 z-50"
      >
        <div
          class="absolute top-[20px] left-0 right-0 mx-5 pb-24 bg-white border-t border-gray-100 shadow-lg z-50 max-h-[calc(100vh-61px)] overflow-y-auto p-6"
        >
          <!-- Header -->
          <div class="flex items-center justify-between gap-4 mb-6">
            <h1 class="text-xl font-bold">القائمة</h1>
            <div
              class="mr-auto text-gray-600 border p-2 flex justify-center items-center rounded-full w-fit h-fit cursor-pointer hover:bg-red-600 hover:text-white hover:scale-105 ease-linear duration-150"
              v-on:click="toggleMobileMenu"
            >
              <PhX size="25" />
            </div>
          </div>

          <!-- Search and Add Button -->
          <div class="space-y-4 mb-6">
            <div class="relative flex items-center">
              <button
                class="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-full flex items-center justify-center bg-green-600 rounded-l-lg hover:bg-green-700 transition-colors"
              >
                <PhMagnifyingGlass class="w-5 h-5 text-white" />
              </button>
              <input
                type="text"
                placeholder="ابحث عن السيارات و الهواتف و أكثر ..."
                class="w-full pl-14 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors text-right"
                dir="rtl"
              />
            </div>

            <button
              v-if="isLoggedIn"
              @click="navigateTo('/create-ad')"
              class="w-full flex items-center justify-between px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <PhPlus class="w-5 h-5" />
              <span class="text-sm font-medium">+ أضف إعلانك</span>
            </button>
            <button
              v-else="isLoggedIn"
              @click="emit('open-login')"
              class="w-full flex items-center justify-between px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <PhPlus class="w-5 h-5" />
              <span class="text-sm font-medium">+ أضف إعلانك</span>
            </button>
          </div>

          <!-- User Section -->
          <template v-if="isLoggedIn">
            <!-- User Info -->
            <div
              class="flex items-center gap-3 px-4 mb-6 border-b border-gray-100 pb-4 cursor-pointer"
              @click="navigateTo('/account')"
            >
              <div class="text-right flex-1">
                <p class="font-medium text-lg">{{ userName }}</p>
                <p class="text-sm text-gray-500">أهلاً بك</p>
              </div>
              <img
                :src="userAvatar"
                alt="User"
                class="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
              />
            </div>

            <!-- Menu Grid -->
            <div class="grid grid-cols-2 gap-4 mb-6">
              <button
                v-for="(item, index) in menuItems"
                :key="index"
                @click="navigateTo(item.to)"
                class="flex items-center gap-3 py-3 px-4 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50"
              >
                <PhPlus class="w-5 h-5" />
                <span>{{ item.text }}</span>
              </button>
            </div>

            <!-- Notifications and Messages -->
            <div class="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
              <!-- <NuxtLink to="/notifications" class="flex items-center justify-center gap-2">
                <div class="relative">
                  <PhBell class="w-6 h-6 text-gray-600" />
                  <span class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </div>
                <span class="text-sm text-gray-600">الإشعارات</span>
              </NuxtLink> -->

              <button
                @click="navigateTo('/account/chat')"
                class="flex items-center justify-center gap-2"
              >
                <div class="relative">
                  <PhChatCircle class="w-6 h-6 text-gray-600" />
                  <span
                    class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
                  ></span>
                </div>
                <span class="text-sm text-gray-600">الرسائل</span>
              </button>

              <button
                @click="handleLogout"
                class="col-span-2 flex items-center gap-3 py-3 px-4 text-red-600 hover:text-red-700 rounded-lg hover:bg-red-50 border bord er-red-100"
              >
                <PhSignOut class="w-5 h-5" />
                <span>تسجيل الخروج</span>
              </button>
            </div>

            <!-- Add Logout Button -->
          </template>

          <!-- Login/Register Section -->
          <template v-else>
            <div class="grid grid-cols-2 gap-4">
              <button
                @click="handleLoginClick"
                class="flex flex-col items-center py-3 px-4 rounded-lg hover:bg-gray-50 group"
              >
                <PhSignIn class="w-6 h-6 text-gray-500 group-hover:text-green-600 mb-1" />
                <span class="text-sm text-gray-500 group-hover:text-green-600"
                  >تسجيل الدخول</span
                >
              </button>
              <button
                @click="handleRegisterClick"
                class="flex flex-col items-center py-3 px-4 rounded-lg hover:bg-gray-50 group"
              >
                <PhUserPlus class="w-6 h-6 text-gray-500 group-hover:text-green-600 mb-1" />
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
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import logo from "~/assets/logo.png";
import { useRouter } from "vue-router";
import user from "~/assets/user.png";
import { 
  PhMagnifyingGlass,
  PhPlus,
  PhUser,
  PhCaretDown,
  PhWallet,
  PhMegaphone,
  PhUsers,
  PhHeart,
  PhChatCircle,
  PhGear,
  PhSignOut,
  PhBell,
  PhList,
  PhX,
  PhSignIn,
  PhUserPlus
} from '@phosphor-icons/vue';
import { useServices } from "~/composables/useServices";
import { API_BASE_URL } from "~/utils/config";

const props = defineProps({
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["open-login", "open-register"]);

const isMobileMenuOpen = ref(false);
const menuRef = ref(null);
const buttonRef = ref(null);
const isDropdownOpen = ref(false);
const dropdownRef = ref(null);
const router = useRouter();
const isProfileDropdownOpen = ref(false);
const { getProfile } = useServices();
const profileData = ref(null);

// Fetch profile data
const fetchProfileData = async () => {
  try {
    const { data, error } = await getProfile();
    if (error) {
      console.error("Error fetching profile:", error);
      return;
    }
    profileData.value = data;
  } catch (err) {
    console.error("Error in fetchProfileData:", err);
  }
};

// Add computed properties for user data
const userName = computed(() => {
  return profileData.value?.user?.name || 'المستخدم';
});

const userAvatar = computed(() => {
  if (profileData.value?.user?.avatar) {
    return `${profileData.value.user.avatar}`;
  }
  return user; // default avatar
});

// Fetch profile on mount
onMounted(() => {
  fetchProfileData();
});

// Listen for profile updates
onMounted(() => {
  window.addEventListener('profile-updated', fetchProfileData);
});

onUnmounted(() => {
  window.removeEventListener('profile-updated', fetchProfileData);
});

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const closeDropdown = () => {
  isDropdownOpen.value = false;
};

const handleLoginClick = () => {
  emit("open-login");
  closeDropdown();
};

const handleRegisterClick = () => {
  emit("open-register");
  closeDropdown();
};

// Handle click outside for dropdown
onMounted(() => {
  document.addEventListener("click", (event) => {
    const dropdown = document.querySelector(".relative"); // Adjust selector as needed
    if (dropdown && !dropdown.contains(event.target)) {
      closeDropdown();
    }
  });

  window.addEventListener("open-login-modal", () => {
    emit("open-login");
  });
});

onUnmounted(() => {
  document.removeEventListener("click", closeDropdown);
  window.removeEventListener("open-login-modal", () => {
    emit("open-login");
  });
});

// Mobile menu handlers
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  // console.log(isMobileMenuOpen.value);
};

const handleClickOutside = (event) => {
  if (
    menuRef.value &&
    buttonRef.value &&
    !menuRef.value.contains(event.target) &&
    !buttonRef.value.contains(event.target)
  ) {
    isMobileMenuOpen.value = false;
  }
};

const handleLogout = async () => {
  try {
    // Remove token from localStorage
    localStorage.removeItem("session-token");
    
    // Dispatch invalid token event
    window.dispatchEvent(new CustomEvent('invalid-token'));

    // Close any open menus
    isProfileDropdownOpen.value = false;
    isMobileMenuOpen.value = false;

    // Redirect to home page
    router.push("/");
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

const toggleProfileDropdown = () => {
  isProfileDropdownOpen.value = !isProfileDropdownOpen.value;
};

// Handle click outside for profile dropdown
onMounted(() => {
  document.addEventListener("click", (event) => {
    const profileDropdown = document.querySelector(".dropdown-container");
    if (profileDropdown && !profileDropdown.contains(event.target)) {
      isProfileDropdownOpen.value = false;
    }
  });
});

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});

// Add this to your setup:
const menuItems = [
  { to: "/account/profile/wallet", icon: "ph:wallet", text: "المحفظة" },
  { to: "/account/profile/following", icon: "ph:users", text: "المتابَعين" },
  { to: "/account/profile/favorites", icon: "ph:heart", text: "المفضلة" },
  // { to: "/account/profile/invoices", icon: "ph:receipt", text: "الفواتير" },
  { to: "/account/settings", icon: "ph:gear", text: "الاعدادات" },
  // { to: "/contact", icon: "ph:phone", text: "اتصل بنا" },
  { to: "/account/profile/my-ads", icon: "ph:megaphone", text: "إعلاناتي" },
];

const navigateTo = (route) => {
  router.push(route);
  toggleMobileMenu();
};
</script>

<style scoped>
.dropdown-container {
  position: relative;
  display: inline-block;
}

.dropdown-container img {
  transition: all 0.2s ease-in-out;
}

.dropdown-container img:hover {
  transform: scale(1.05);
}
</style>
