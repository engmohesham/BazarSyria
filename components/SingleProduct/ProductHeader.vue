<template>
  <div class="p-6">
    <div class="flex flex-col gap-4">
      <div class="text-4xl font-bold text-green-600">{{ price }} LS</div>
      <h1 class="text-2xl font-bold">{{ title }}</h1>
      <div class="flex items-center gap-4 text-gray-600">
        <div class="flex items-center gap-2">
          <Icon name="ph:map-pin" class="w-5 h-5" />
          <span>{{ location }}</span>
        </div>
        <div class="flex items-center gap-2">
          <Icon name="ph:clock" class="w-5 h-5" />
          <span>{{ timeAgo }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  price: String,
  location: String,
  timeAgo: String
});
</script> 