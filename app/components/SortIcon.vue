<template>
  <span class="inline-flex flex-col gap-0 opacity-60 group-hover:opacity-100">
    <!-- Up arrow — aktif jika field ini asc -->
    <svg
      class="w-2.5 h-2.5 -mb-0.5 transition-opacity"
      :class="current === field && dir === 'asc' ? 'opacity-100 text-white' : 'opacity-40'"
      fill="currentColor" viewBox="0 0 24 24"
    >
      <path d="M12 4l8 8H4z"/>
    </svg>
    <!-- Down arrow — aktif jika field ini desc -->
    <svg
      class="w-2.5 h-2.5 transition-opacity"
      :class="current === field && dir === 'desc' ? 'opacity-100 text-white' : 'opacity-40'"
      fill="currentColor" viewBox="0 0 24 24"
    >
      <path d="M12 20l-8-8h16z"/>
    </svg>
  </span>
</template>

<script setup lang="ts">
defineProps<{
  field: string
  current: string
  dir: 'asc' | 'desc'
}>()
</script>
