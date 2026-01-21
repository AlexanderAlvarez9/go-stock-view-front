<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}>()

const emit = defineEmits<{
  'page-change': [page: number]
  'page-size-change': [size: number]
}>()

const displayRange = computed(() => {
  const start = (props.page - 1) * props.pageSize + 1
  const end = Math.min(props.page * props.pageSize, props.totalItems)
  return { start, end }
})

const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5
  let startPage = Math.max(1, props.page - Math.floor(maxVisible / 2))
  const endPage = Math.min(props.totalPages, startPage + maxVisible - 1)

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  return pages
})

function goToPage(page: number) {
  if (page >= 1 && page <= props.totalPages && page !== props.page) {
    emit('page-change', page)
  }
}
</script>

<template>
  <div class="flex items-center justify-between py-4">
    <div class="text-sm text-tv-text-secondary">
      Showing {{ displayRange.start }} to {{ displayRange.end }} of {{ totalItems }} results
    </div>

    <div class="flex items-center space-x-4">
      <select
        :value="pageSize"
        @change="emit('page-size-change', parseInt(($event.target as HTMLSelectElement).value))"
        class="select text-sm py-1 w-20"
      >
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>

      <nav class="flex items-center space-x-1">
        <button
          @click="goToPage(page - 1)"
          :disabled="page <= 1"
          class="p-2 rounded hover:bg-tv-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          v-for="p in visiblePages"
          :key="p"
          @click="goToPage(p)"
          class="px-3 py-1 rounded text-sm font-medium transition-colors"
          :class="p === page ? 'bg-tv-blue text-white' : 'hover:bg-tv-bg-tertiary text-tv-text-secondary'"
        >
          {{ p }}
        </button>

        <button
          @click="goToPage(page + 1)"
          :disabled="page >= totalPages"
          class="p-2 rounded hover:bg-tv-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </nav>
    </div>
  </div>
</template>
