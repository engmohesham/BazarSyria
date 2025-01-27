<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <div class="container mx-auto px-2 sm:px-4">
      <TopHeader />
      <Navigation />
    </div>
  </header>
</template>

<script setup lang="ts">
import TopHeader from './TopHeader.vue'
import Navigation from './Navigation.vue'
</script>