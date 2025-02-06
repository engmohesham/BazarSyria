<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <label class="block text-sm font-medium text-gray-700 mb-4">
      تحميل الصور *
    </label>
    <div class="grid grid-cols-5 gap-4">
      <!-- Upload Button -->
      <button 
        type="button"
        @click="$refs.fileInput.click()"
        class="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 transition-colors"
      >
        <Icon name="ph:plus" class="w-6 h-6 text-green-600" />
      </button>
      
      <!-- Image Previews -->
      <div 
        v-for="(image, index) in modelValue" 
        :key="index"
        class="relative aspect-square"
      >
        <img 
          :src="image" 
          class="w-full h-full object-cover rounded-lg border border-gray-200" 
        />
        <button 
          @click="removeImage(index)"
          class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
        >
          <Icon name="ph:x" class="w-4 h-4" />
        </button>
      </div>
    </div>
    <input 
      type="file"
      multiple
      accept="image/*"
      @change="handleImageUpload"
      class="hidden"
      ref="fileInput"
    />
  </div>
  
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const handleImageUpload = (event) => {
  const files = event.target.files
  if (files.length + props.modelValue.length > 5) {
    alert('يمكنك تحميل 5 صور كحد أقصى')
    return
  }
  
  Array.from(files).forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const newGallery = [...props.modelValue, e.target.result]
      emit('update:modelValue', newGallery)
    }
    reader.readAsDataURL(file)
  })
}

const removeImage = (index) => {
  const newGallery = [...props.modelValue]
  newGallery.splice(index, 1)
  emit('update:modelValue', newGallery)
}
</script> 