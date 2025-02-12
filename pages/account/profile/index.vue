<script setup>
import user from "~/assets/user.png";
import defaultAvatar from "~/assets/user.png";
import defaultCover from "~/assets/cover.jpeg";

const router = useRouter();
const { getProfile, updateProfile } = useServices();

const {
  data: userData,
  error: profileError,
  refresh,
} = await useAsyncData(
  "profile",
  async () => {
    const token = localStorage.getItem("session-token");
    if (!token) {
      router.push("/");
      return null;
    }

    try {
      const { data, error } = await getProfile();

      if (error) {
        throw new Error("فشل في تحميل بيانات الملف الشخصي");
      }

      return {
        ads: [],
        avatar: data.user.avatar || null,
        coverImage: "",
        createdAt: data.user.createdAt,
        email: data.user.email || "",
        followers: data.user.followers || [],
        following: data.user.following || [],
        joinDate: data.user.createdAt,
        location: "",
        memberId: data.user.memberId || "",
        name: data.user.name || "",
        phone: data.user.phone || "",
        ratings: data.user.ratings || [],
        verified: data.user.idVerificationStatus || "deactivated",
        id: data.user._id || "",
        emailVerified: data.user.emailVerified || false,
        role: data.user.role || "user",
        identificationVerified: data.user.identificationVerified || false,
      };
    } catch (e) {
      console.error("خطأ في تحميل البيانات:", e);
      throw e;
    }
  },
  {
    server: false, // تنفيذ فقط على جانب العميل
    lazy: true, // تحميل البيانات عند الحاجة
  }
);

// Computed properties for images
const avatarImage = computed(() => {
  if (!userData.value?.avatar) return defaultAvatar;
  return `${API_BASE_URL}/${userData.value.avatar}`;
});

const coverImage = computed(() => {
  if (!userData.value?.coverImage) return defaultCover;
  return userData.value.coverImage;
});

const handleUpdateProfile = async (e) => {
  e.preventDefault();
  try {
    const { error, message } = await updateProfile({
      name: userData.value.name,
      email: userData.value.email,
      phone: userData.value.phone,
      location: userData.value.location,
      bio: userData.value.bio,
      role: userData.value.role,
      id: userData.value.id,
      // Only include files if they've been changed
      ...(userData.value.newAvatar && { avatar: userData.value.newAvatar }),
      ...(userData.value.newCoverImage && {
        coverImage: userData.value.newCoverImage,
      }),
    });

    if (error) {
      throw new Error(error);
    }

    // Show success message
    alert(message || "تم تحديث الملف الشخصي بنجاح");

    // Refresh the profile data
    await refresh();
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("حدث خطأ أثناء تحديث الملف الشخصي");
  }
};

// Add handlers for file uploads
const handleAvatarChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    userData.value.newAvatar = file;
    // Create preview URL
    userData.value.avatar = URL.createObjectURL(file);
  }
};

const handleCoverImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    userData.value.newCoverImage = file;
    // Create preview URL
    userData.value.coverImage = URL.createObjectURL(file);
  }
};

console.log(userData.value);
</script>

<template>
  <div class="bg-gray-100 min-h-screen" dir="rtl">
    <div v-if="$fetchState?.pending" class="text-center py-8">
      جاري التحميل...
    </div>
    <div v-else-if="profileError" class="text-center py-8 text-red-600">
      {{ profileError }}
    </div>
    <div v-else-if="userData">
      <!-- رأس الصفحة مع العنوان -->
      <div class="bg-white p-4 border-b">
        <div class="flex items-center justify-between max-w-4xl mx-auto">
          <button
            @click="router.back()"
            class="text-gray-600 hover:text-gray-800"
          >
            <Icon name="ph:arrow-right-bold" class="w-6 h-6" />
          </button>
          <h1 class="text-xl font-bold">حسابي</h1>
          <div class="w-6"></div>
        </div>
      </div>

      <!-- صورة الغلاف والمعلومات الشخصية -->
      <div class="max-w-4xl mx-auto">
        <!-- صورة الغلاف -->
        <div class="relative h-64 rounded-b-lg">
          <img
            :src="coverImage"
            class="w-full h-full object-cover"
            alt="صورة الغلاف"
          />

          <!-- الصورة الشخصية والمعلومات -->
          <div
            class="absolute -bottom-16 right-1/2 translate-x-1/2 bg-white rounded-lg px-3 py-2 w-fit"
          >
            <div class="flex flex-col items-center">
              <!-- الصورة الشخصية -->
              <img
                :src="avatarImage"
                class="w-32 h-32 rounded-full border-4 border-white object-cover"
                alt="الصورة الشخصية"
              />

              <!-- اسم المستخدم والتقييم -->
              <div class="mt-4 text-center">
                <h2 class="text-xl font-bold">{{ userData.name }}</h2>
                <p class="text-gray-600 mt-1">
                  رقم العضوية {{ userData.memberId }}
                </p>
                <!-- نجوم التقييم -->
                <div class="flex justify-center mt-2">
                  <div class="flex items-center gap-1">
                    <Icon
                      v-for="i in 5"
                      :key="i"
                      :name="i <= 3 ? 'ph:star-fill' : 'ph:star'"
                      class="w-5 h-5"
                      :class="i <= 3 ? 'text-yellow-400' : 'text-gray-300'"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- مساحة إضافية للمحتوى تحت الصورة الشخصية -->
        <div class="mt-20 bg-white rounded-lg shadow-sm p-6">
          <!-- معلومات المستخدم الأساسية -->
          <div class="relative px-6 pb-6">
            <!-- اسم المستخدم والتقييم -->
            <div class="pt-20">
              <div class="flex items-center gap-2">
                <h1 class="text-xl font-bold">{{ userData.name }}</h1>
                <span v-if="userData.type" class="text-sm text-gray-500"
                  >({{ userData.type }})</span
                >
                <!-- عرض التقييمات -->
                <div
                  v-if="userData.ratings && userData.ratings.length > 0"
                  class="flex items-center"
                >
                  <Icon
                    v-for="i in 5"
                    :key="i"
                    :name="
                      i <= userData.ratings[0].rating
                        ? 'ph:star-fill'
                        : 'ph:star'
                    "
                    class="w-4 h-4"
                    :class="
                      i <= userData.ratings[0].rating
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    "
                  />
                </div>
              </div>
              <p v-if="userData.location" class="text-sm text-gray-500">
                {{ userData.location }}
              </p>
              <div class="mt-2 flex items-center gap-4">
                <NuxtLink
                  to="/account/profile/followers"
                  class="text-sm hover:text-green-600"
                >
                  المتابعون: {{ userData.followers.length }}
                </NuxtLink>
                <NuxtLink
                  to="/account/profile/following"
                  class="text-sm hover:text-green-600"
                >
                  يتابع: {{ userData.following.length }}
                </NuxtLink>
              </div>
            </div>

            <!-- معلومات الاتصال -->
            <div class="mt-6 space-y-4">
              <div v-if="userData.email">
                <label class="text-sm text-gray-500">البريد الإلكتروني</label>
                <p>{{ userData.email }}</p>
              </div>
              <div v-if="userData.phone">
                <label class="text-sm text-gray-500">رقم الهاتف</label>
                <p>{{ userData.phone }}</p>
              </div>
              <div>
                <label class="text-sm text-gray-500">رقم العضوية</label>
                <p>{{ userData.memberId }}</p>
              </div>
            </div>

            <!-- حالة التوثيق -->
            <div class="mt-4">
              <div class="flex items-center gap-2">
                <Icon
                  :name="
                    userData.verified === 'active'
                      ? 'ph:check-circle-fill'
                      : 'ph:x-circle'
                  "
                  class="w-5 h-5"
                  :class="
                    userData.verified === 'active'
                      ? 'text-green-500'
                      : userData.verified === 'pending'
                      ? 'text-yellow-500'
                      : 'text-red-500'
                  "
                />
                <span>{{
                  userData.verified === 'active' ? "حساب موثق" : userData.verified === 'pending' ? "الحساب تحت المراجعة" : "حساب غير موثق"
                }}</span>
              </div>
            </div>

            <!-- نموذج تحديث المعلومات -->
            <form class="mt-8 space-y-6">
              <!-- الاسم -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >الاسم</label
                >
                <input
                  type="text"
                  v-model="userData.name"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <!-- تاريخ الميلاد -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >تاريخ الميلاد</label
                >
                <div class="grid grid-cols-3 gap-4">
                  <select
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option>يوم</option>
                  </select>
                  <select
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option>شهر</option>
                  </select>
                  <select
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option>سنة</option>
                  </select>
                </div>
              </div>

              <!-- الجنس -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >الجنس</label
                >
                <select
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option>ذكر</option>
                  <option>أنثى</option>
                </select>
              </div>

              <!-- رقم الجوال -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >رقم الجوال</label
                >
                <div class="flex gap-2">
                  <select
                    class="w-24 px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option>+966</option>
                  </select>
                  <input
                    type="tel"
                    v-model="userData.phone"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <!-- البريد الإلكتروني -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >البريد الإلكتروني</label
                >
                <input
                  type="email"
                  v-model="userData.email"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  disabled
                />
              </div>

              <!-- نبذة عني -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >نبذة عني</label
                >
                <textarea
                  v-model="userData.bio"
                  rows="4"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                ></textarea>
              </div>

              <!-- Add file inputs for avatar and cover image -->
              <div class="relative">
                <input
                  type="file"
                  accept="image/*"
                  @change="handleAvatarChange"
                  class="hidden"
                  ref="avatarInput"
                />
                <button
                  @click="$refs.avatarInput.click()"
                  class="absolute bottom-0 right-0"
                >
                  <PhCamera :size="20" class="text-gray-600" />
                </button>
              </div>

              <div class="relative">
                <input
                  type="file"
                  accept="image/*"
                  @change="handleCoverImageChange"
                  class="hidden"
                  ref="coverInput"
                />
                <button
                  @click="$refs.coverInput.click()"
                  class="absolute top-4 right-4"
                >
                  <PhCamera :size="20" class="text-gray-600" />
                </button>
              </div>

              <!-- زر الحفظ -->
              <div>
                <button
                  @click="handleUpdateProfile"
                  class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                >
                  حفظ التغييرات
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 1024px;
  margin: 0 auto;
}

.profile-header {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.4),
    rgba(0, 0, 0, 0.6)
  );
}
</style>
