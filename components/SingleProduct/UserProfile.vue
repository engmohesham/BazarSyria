<template>
  <div class="flex flex-col gap-4 bg-white rounded-lg shadow-lg overflow-hidden px-3">
    <!-- User Info with Profile Link -->
    <NuxtLink 
      v-if="userData && !isCurrentUser"
      :to="`/account/profile/${userData._id}`"
      class="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
    >
      <div class="relative">
        <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
          <img
            :src="userData.avatar || 'https://via.placeholder.com/150'"
            :alt="userData.name"
            class="w-full h-full rounded-full object-cover"
          />
        </div>
        <div
          v-if="userData?.identificationVerified"
          class="absolute -top-1 -right-1 bg-white p-1 rounded-full shadow-sm"
          title="حساب موثق"
        >
          <PhSealCheck class="w-4 h-4 text-blue-500" weight="fill" />
        </div>
        <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
      </div>
      <div class="flex-1">
        <h3 class="font-semibold">{{ userData.name }}</h3>
        <p class="text-sm text-gray-500">عضو منذ {{ formatJoinDate(userData.createdAt) }}</p>
      </div>
      <!-- Arrow Icon -->
      <PhCaretLeft class="w-5 h-5 text-gray-400" v-if="!isCurrentUser" />
    </NuxtLink>

    <button 
      v-else
      class="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
    >
      <div class="relative">
        <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
          <img
            :src="userData?.avatar || 'https://via.placeholder.com/150'"
            :alt="userData?.name"
            class="w-full h-full rounded-full object-cover"
          />
        </div>
        <div
          v-if="userData?.identificationVerified"
          class="absolute -top-1 -right-1 bg-white p-1 rounded-full shadow-sm"
          title="حساب موثق"
        >
          <PhSealCheck class="w-4 h-4 text-blue-500" weight="fill" />
        </div>
        <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
      </div>
      <div class="flex-1">
        <h3 class="font-semibold">{{ userData?.name }}</h3>
        <p class="text-sm text-gray-500">عضو منذ {{ formatJoinDate(userData?.createdAt) }}</p>
      </div>
      <!-- Arrow Icon -->
      <!-- <PhCaretLeft class="w-5 h-5 text-gray-400" /> -->
    </button>

    <!-- Only show these sections if not current user -->
    <template v-if="!isCurrentUser">
      <!-- Follow Button -->
      <div v-if="shouldShowButtons" class="flex justify-center">
        <button
          @click.prevent="handleFollow"
          class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors w-full flex items-center justify-center gap-2"
        >
          <PhUserPlus v-if="!isFollowing" class="w-5 h-5" />
          <PhUserMinus v-else class="w-5 h-5" />
          {{ isFollowing ? 'إلغاء المتابعة' : 'متابعة' }}
        </button>
      </div>

      <!-- Action Buttons -->
      <div v-if="shouldShowButtons" class="flex flex-col gap-2">
        <button
          @click="startChat"
          class="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          <PhChatCircle class="w-5 h-5" />
          محادثة
        </button>
        <button
          v-if="userData?.phone"
          @click="makeCall"
          class="w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
        >
          <PhPhone class="w-5 h-5" />
          مكالمة
        </button>
        <button
          v-if="userData?.phone"
          @click="openWhatsapp"
          class="w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
        >
          <PhWhatsappLogo class="w-5 h-5" />
          واتساب
        </button>
      </div>
    </template>

    <!-- Safety Notice -->
    <div class="bg-gray-50 p-4 rounded-lg text-sm">
      <h4 class="font-semibold mb-2">سياسات حمايتنا</h4>
      <ul class="text-gray-600 space-y-2">
        <li class="flex items-start gap-2">
          <PhInfo class="w-5 h-5 mt-0.5 text-gray-400" />
          <span>تأكد من فحص المنتج قبل شراء أي شيء.</span>
        </li>
        <li class="flex items-start gap-2">
          <PhWarning class="w-5 h-5 mt-0.5 text-gray-400" />
          <span>لا تدفع أي مبلغ قبل معاينة المنتج شخصياً.</span>
        </li>
        <li class="flex items-start gap-2">
          <PhShieldCheck class="w-5 h-5 mt-0.5 text-gray-400" />
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
import { ref, computed, onMounted, watch } from 'vue';
import { useServices } from '~/composables/useServices';
import car from '~/assets/cars/car.jpg'
import { 
  PhCaretLeft,
  PhUserPlus,
  PhUserMinus,
  PhChatCircle,
  PhPhone,
  PhWhatsappLogo,
  PhInfo,
  PhWarning,
  PhShieldCheck,
  PhSealCheck
} from '@phosphor-icons/vue';

const { getProfile, getUserById, followUser, unfollowUser, createChatRoom } = useServices();

const props = defineProps({
  creatorId: {
    type: String,
    required: true
  },
  advertisementData: {
    type: Object,
    required: true
  },
  isCurrentUser: {
    type: Boolean,
    default: false
  }
});

const userData = ref(null);
const currentUser = ref(null);
const isLoading = ref(true);
const isFollowing = ref(false);

// Format join date
const formatJoinDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('ar-SY', {
    year: 'numeric'
  });
};

// Fetch user data
const fetchUserData = async () => {
  isLoading.value = true;
  try {
    // Get current user profile
    const { data: profileData } = await getProfile();
    currentUser.value = profileData.user;
    // console.log('Current User:', currentUser.value._id);

    // Get creator profile
    const { data: creatorData } = await getUserById(props.creatorId);
    // console.log(creatorData);
    userData.value = creatorData.user;
    // console.log(userData.value);

    // Check if current user is following the creator
    isFollowing.value = currentUser.value?.following?.includes(props.creatorId);
  } catch (error) {
    console.error('Error fetching user data:', error);
  } finally {
    isLoading.value = false;
  }
};

// Update handleFollow to prevent navigation when clicking follow button
const handleFollow = async (event) => {
  event.preventDefault(); // Prevent navigation when clicking the follow button
  if (!currentUser.value) {
    return navigateTo('/auth/login');
  }
  
  try {
    if (isFollowing.value) {
      await unfollowUser(props.creatorId);
      isFollowing.value = false;
    } else {
      await followUser(props.creatorId);
      isFollowing.value = true;
    }
  } catch (error) {
    console.error('Error updating follow status:', error);
  }
};

// Handle chat
const startChat = async () => {
  if (!currentUser.value) {
    return navigateTo('/auth/login');
  }

  try {
    // تجهيز البيانات للإرسال
    const payload = {
      users: [currentUser.value._id, props.creatorId]
    };
    
    // محاولة إنشاء محادثة جديدة
    const { data, error } = await createChatRoom(payload);
    
    // في جميع الحالات، نقوم بالانتقال إلى صفحة المحادثات مع معرف المستخدم
    await navigateTo(`/account/chat?userId=${props.creatorId}`);
    
  } catch (error) {
    console.error('Error in chat creation:', error);
    // حتى في حالة الخطأ، نحاول الانتقال إلى المحادثة
    await navigateTo(`/account/chat?userId=${props.creatorId}`);
  }
};

// Check if the profile is the current user's profile
const isCurrentUser = computed(() => {
  return currentUser.value?._id === props.creatorId;
});

// Computed property to determine if buttons should be shown
const shouldShowButtons = computed(() => {
  return currentUser.value?._id && !props.isCurrentUser;
});

// Handle phone call
const makeCall = () => {
  if (!userData.value?.phone) return;
  window.location.href = `tel:${userData.value.phone}`;
};

// Handle WhatsApp
const openWhatsapp = () => {
  if (!props.advertisementData.whatsappNumber) return;
  const phoneNumber = props.advertisementData.whatsappNumber.replace(/\D/g, ''); // Remove non-digits
  window.open(`https://wa.me/${phoneNumber}`, '_blank');
};

// Watch for creatorId changes
watch(() => props.creatorId, () => {
  if (props.creatorId) {
    fetchUserData();
  }
}, { immediate: true });

// يمكنك الآن استخدام props.advertisementData للوصول إلى بيانات الإعلان
const adTitle = computed(() => props.advertisementData.advTitle);
const adPrice = computed(() => props.advertisementData.price);
const adLocation = computed(() => props.advertisementData.location);
const adCreatedAt = computed(() => props.advertisementData.createdAt);
</script>

<style scoped>
/* Remove the sticky class from here since it's now in the parent */
.user-profile {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}

/* Add smooth transition for hover effects */
.hover\:bg-gray-50 {
  transition: background-color 0.2s ease-in-out;
}

/* Ensure content stays within bounds */
.overflow-hidden {
  overflow: hidden;
}
</style>