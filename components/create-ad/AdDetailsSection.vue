<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <h3 class="font-medium text-lg mb-4">تفاصيل الإعلان</h3>
    
    <div class="space-y-4">
      <!-- Title -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          عنوان الإعلان *
        </label>
        <input 
          v-model="modelValue.advTitle"
          type="text"
          class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
          placeholder="اكتب عنوان مختصر ومميز"
          required
        />
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          وصف الإعلان *
        </label>
        <textarea 
          v-model="modelValue.advDescription"
          rows="4"
          class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
          placeholder="اكتب وصفاً مفصلاً..."
          required
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Object,
    required: true
  }
})
</script> 