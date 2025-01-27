<template>
  <div class="bg-gray-50 border-b border-gray-100 sticky lg:top-[135px] md:top-[127px] top-[110px] z-40">
    <div class="container mx-auto px-4">
      <div class="overflow-x-auto" dir="rtl">
        <div class="flex space-x-reverse space-x-1 py-2 min-w-max">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="$emit('categoryChange', category)"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
              category.id === activeCategory
                ? 'bg-green-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            ]"
          >
            {{ category.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Category {
  id: string
  name: string
  href: string
  isActive: boolean
}

const categories: Category[] = [
  { id: 'cars', name: 'عربيات و قطع غيار', href: '#', isActive: true },
  { id: 'real-estate', name: 'العقارات', href: '#', isActive: false },
  { id: 'mobile', name: 'موبايلات', href: '#', isActive: false },
  { id: 'jobs', name: 'وظائف', href: '#', isActive: false },
  { id: 'dev', name: 'تصميم و برمجة', href: '#', isActive: false },
  { id: 'electronics', name: 'أجهزة إلكترونية', href: '#', isActive: false },
  { id: 'more', name: 'المزيد من الخدمات', href: '#', isActive: false },
]

defineProps<{
  activeCategory: string
}>()

defineEmits<{
  (e: 'categoryChange', category: Category): void
}>()
</script>