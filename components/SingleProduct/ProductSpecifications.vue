<template>
  <div class="px-6 py-4">
    <div class="grid grid-cols-3 gap-4">
      <div 
        v-for="(spec, index) in specifications" 
        :key="index"
        class="flex items-center justify-center gap-2 p-4 bg-gray-50 rounded-lg text-center"
      >
        <Icon :name="spec.icon" class="w-6 h-6 text-gray-600" />
        <div>
          <div class="text-sm text-gray-500">{{ spec.label }}</div>
          <div class="font-medium">{{ spec.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  specifications: Array
});
</script> 