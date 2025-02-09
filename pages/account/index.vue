<script setup>
const router = useRouter()
const { logout } = useServices()

definePageMeta({
  middleware: "auth",
});

const handleLogout = async () => {
  await logout()
  router.push('/')
}
</script>

<template>
  <div class="p-8">
    <div class="max-w-4xl mx-auto">
      <!-- رأس الصفحة -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold">مرحباً بك في حسابك</h1>
        <button 
          @click="handleLogout"
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          تسجيل الخروج
        </button>
      </div>

      <!-- روابط سريعة -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <NuxtLink 
          to="/account/profile"
          class="flex items-center gap-4 p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <Icon name="ph:user-circle" class="w-8 h-8 text-green-600" />
          <div>
            <h3 class="font-medium">الملف الشخصي</h3>
            <p class="text-sm text-gray-500">عرض وتعديل معلوماتك الشخصية</p>
          </div>
        </NuxtLink>

        <NuxtLink 
          to="/create-ad"
          class="flex items-center gap-4 p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <Icon name="ph:plus-circle" class="w-8 h-8 text-green-600" />
          <div>
            <h3 class="font-medium">إضافة إعلان</h3>
            <p class="text-sm text-gray-500">نشر إعلان جديد</p>
          </div>
        </NuxtLink>

        <NuxtLink 
          to="/account/profile/my-ads"
          class="flex items-center gap-4 p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <Icon name="ph:list" class="w-8 h-8 text-green-600" />
          <div>
            <h3 class="font-medium">إعلاناتي</h3>
            <p class="text-sm text-gray-500">إدارة إعلاناتك النشطة</p>
          </div>
        </NuxtLink>

        <NuxtLink 
          to="/account/chat"
          class="flex items-center gap-4 p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <Icon name="ph:chat-circle-dots" class="w-8 h-8 text-green-600" />
          <div>
            <h3 class="font-medium">المحادثات</h3>
            <p class="text-sm text-gray-500">المحادثات الموجودة</p>
          </div>
        </NuxtLink>

        <NuxtLink 
          to="/account/settings"
          class="flex items-center gap-4 p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <Icon name="ph:gear" class="w-8 h-8 text-green-600" />
          <div>
            <h3 class="font-medium">الإعدادات العامة</h3>
            <p class="text-sm text-gray-500">تعديل إعدادات الحساب</p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
