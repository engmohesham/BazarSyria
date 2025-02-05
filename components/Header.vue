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
import { inject } from 'vue'
import TopHeader from './TopHeader.vue'
import Navigation from './Navigation.vue'

const isLoggedIn = inject('isLoggedIn')
const openLogin = inject('openLogin')
const openRegister = inject('openRegister')

defineEmits(['open-login', 'open-register'])
</script> 