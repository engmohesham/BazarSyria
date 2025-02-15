<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <h3 class="font-medium text-lg mb-4">السعر ومعلومات الاتصال</h3>
    
    <div class="space-y-4">
      <!-- Price -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          السعر *
        </label>
        <div class="relative">
          <input 
            :value="modelValue.price"
            @input="$emit('update:modelValue', { ...modelValue, price: $event.target.value })"
            type="number"
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 pl-16"
            placeholder="ادخل السعر"
            required
          />
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            ل.س
          </span>
        </div>
      </div>

      <!-- Contact Method -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          طريقة التواصل المفضلة
        </label>
        <div class="flex gap-4 flex-wrap">
          <label class="flex items-center">
            <input 
              type="radio" 
              :checked="modelValue.contactMethod === 'phone'"
              @change="handleContactMethodChange('phone')"
              class="ml-2"
            />
            اتصال
          </label>
          <label class="flex items-center">
            <input 
              type="radio" 
              :checked="modelValue.contactMethod === 'whatsapp'"
              @change="handleContactMethodChange('whatsapp')"
              class="ml-2"
            />
            واتساب
          </label>
          <label class="flex items-center">
            <input 
              type="radio" 
              :checked="modelValue.contactMethod === 'chat'"
              @change="handleContactMethodChange('chat')"
              class="ml-2"
            />
            شات بازار سوريا
          </label>
          <label class="flex items-center">
            <input 
              type="radio" 
              :checked="modelValue.contactMethod === 'both'"
              @change="handleContactMethodChange('both')"
              class="ml-2"
            />
            الجميع
          </label>
        </div>
      </div>

      <!-- Phone Numbers Section -->
      <div v-if="showPhoneInputs" class="space-y-4">
        <!-- Regular Phone -->
        <div v-if="showRegularPhone">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            رقم الهاتف *
          </label>
          <div class="relative">
            <input 
              :value="modelValue.phoneNumber"
              @input="handlePhoneInput($event, 'phone')"
              type="tel"
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
              placeholder="ادخل رقم الهاتف"
              maxlength="11"
              required
            />
          </div>
          <p v-if="phoneError" class="mt-1 text-sm text-red-600">
            {{ phoneError }}
          </p>
        </div>

        <!-- WhatsApp -->
        <div v-if="showWhatsApp">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            رقم الواتساب *
          </label>
          <div class="relative">
            <input 
              :value="modelValue.whatsappNumber"
              @input="handlePhoneInput($event, 'whatsapp')"
              type="tel"
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
              placeholder="ادخل رقم الواتساب"
              maxlength="15"
              required
            />
          </div>
          <p v-if="whatsappError" class="mt-1 text-sm text-red-600">
            {{ whatsappError }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const phoneError = ref('')
const whatsappError = ref('')

// Computed properties for visibility
const showPhoneInputs = computed(() => {
  return ['phone', 'whatsapp', 'both'].includes(props.modelValue.contactMethod)
})

const showRegularPhone = computed(() => {
  return ['phone', 'both'].includes(props.modelValue.contactMethod)
})

const showWhatsApp = computed(() => {
  return ['whatsapp', 'both'].includes(props.modelValue.contactMethod)
})

// Handle phone input with validation
const handlePhoneInput = (event, type) => {
  const value = event.target.value
  const cleanValue = value.replace(/\D/g, '')

  if (type === 'whatsapp') {
    whatsappError.value = ''
    emit('update:modelValue', {
      ...props.modelValue,
      whatsappNumber: cleanValue
    })
  } else {
    phoneError.value = ''
    emit('update:modelValue', {
      ...props.modelValue,
      phoneNumber: cleanValue
    })
  }
}

// Handle contact method change
const handleContactMethodChange = (method) => {
  phoneError.value = ''
  whatsappError.value = ''
  
  emit('update:modelValue', {
    ...props.modelValue,
    contactMethod: method,
    phoneNumber: ['phone', 'both'].includes(method) ? props.modelValue.phoneNumber : '',
    whatsappNumber: ['whatsapp', 'both'].includes(method) ? props.modelValue.whatsappNumber : ''
  })
}
</script> 