<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'md' | 'lg'
  text?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-8">
    <div
      class="loading-spinner"
      :class="{
        'w-6 h-6': size === 'sm',
        'w-10 h-10': size === 'md' || !size,
        'w-16 h-16': size === 'lg'
      }"
    ></div>
    <p v-if="text" class="mt-4 text-tv-text-secondary text-sm">{{ text }}</p>
  </div>
</template>
