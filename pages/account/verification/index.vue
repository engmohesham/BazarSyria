<script setup>
definePageMeta({
  middleware: ["auth"]
});

const route = useRoute();
const router = useRouter();
const verificationType = computed(() => route.query.type || "personal");

// تفاصيل البطاقات
const cards = {
  business: {
    title: "توثيق الحساب للمؤسسات",
    icon: "ph:buildings",
    description:
      "للاستمرار في استخدام منصة بازار سوريا يتوجب عليك توثيق هوية مؤسستك",
    buttonText: "توثيق المؤسسة",
    steps: [
      "تعبئة معلومات المؤسسة",
      "إرفاق السجل التجاري",
      "إرفاق البطاقة الضريبية",
      "إرفاق عقد التأسيس",
    ],
  },
  personal: {
    title: "توثيق الحساب للأفراد",
    icon: "ph:user-circle",
    description:
      "للاستمرار في استخدام منصة بازار سوريا يتوجب عليك توثيق هويتك الشخصية",
    buttonText: "توثيق الهوية",
    steps: [
      "تعبئة المعلومات الشخصية",
      "إرفاق صورة الهوية الشخصية",
      "إرفاق صورة شخصية حديثة",
      "تأكيد رقم الهاتف",
    ],
  },
};

// الحصول على بيانات البطاقة الحالية
const currentCard = computed(() => cards[verificationType.value]);

// دالة تغيير نوع التوثيق
const changeVerificationType = (type) => {
  router.push(`/account/verification?type=${type}`);
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 py-8" dir="rtl">
    <div class="container mx-auto px-4">
      <div class="max-w-md mx-auto">
        <!-- رأس الصفحة -->
        <div class="flex items-center justify-between mb-6">
            <h1 class="text-2xl font-bold">{{ currentCard.title }}</h1>
            <NuxtLink
              to="/account/settings"
              class="text-gray-600 hover:text-gray-800"
            >
              <Icon name="ph:arrow-left" class="w-6 h-6" />
            </NuxtLink>
        </div>

        <!-- أزرار التبديل -->
        <div class="grid grid-cols-2 gap-4 mb-6">
          <button
            @click="changeVerificationType('personal')"
            :class="[
              'py-2 px-4 rounded-lg text-sm font-medium transition-colors',
              verificationType === 'personal'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            ]"
          >
            حساب شخصي
          </button>
          <button
            @click="changeVerificationType('business')"
            :class="[
              'py-2 px-4 rounded-lg text-sm font-medium transition-colors',
              verificationType === 'business'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            ]"
          >
            حساب مؤسسة
          </button>
        </div>

        <!-- بطاقة التوثيق -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-center mb-6">
            <div
              class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center"
            >
              <Icon :name="currentCard.icon" class="w-12 h-12 text-green-600" />
            </div>
          </div>

          <h2 class="text-xl font-semibold text-center mb-2">
            {{ currentCard.title }}
          </h2>
          <p class="text-gray-600 text-center text-sm mb-6">
            {{ currentCard.description }}
          </p>

          <!-- خطوات التوثيق -->
          <div class="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 class="font-medium text-sm mb-3">خطوات التوثيق:</h3>
            <ul class="space-y-2">
              <li
                v-for="(step, index) in currentCard.steps"
                :key="index"
                class="flex items-center text-sm text-gray-600"
              >
                <div
                  class="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs ml-2"
                >
                  {{ index + 1 }}
                </div>
                {{ step }}
              </li>
            </ul>
          </div>

          <NuxtLink
            :to="`/account/verification/${verificationType}/identity`"
            class="block w-full bg-green-600 text-white text-center py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            {{ currentCard.buttonText }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
