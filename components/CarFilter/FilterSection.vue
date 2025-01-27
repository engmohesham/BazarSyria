<template>
  <div class="bg-white rounded-lg p-4 shadow-sm space-y-4 mb-4">
    <h3 class="font-semibold text-lg">{{ title }}</h3>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script> 