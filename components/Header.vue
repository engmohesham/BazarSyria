<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <div class="container mx-auto px-2 sm:px-4">
      <TopHeader 
        @open-login="$emit('open-login')" 
        @open-register="$emit('open-register')"
        :isLoggedIn="isLoggedIn" 
      />
      <Navigation />
    </div>
  </header>
</template>

<script setup>
import TopHeader from './TopHeader.vue'
import Navigation from './Navigation.vue'

defineProps({
  isLoggedIn: {
    type: Boolean,
    default: false
  }
})

defineEmits(['open-login', 'open-register'])
</script> 