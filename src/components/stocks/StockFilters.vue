<script setup lang="ts">
import { ref, watch } from 'vue'
import type { StockFilter, FiltersResponse } from '@/types'

const props = defineProps<{
  filters: FiltersResponse | null
  currentFilter: StockFilter
}>()

const emit = defineEmits<{
  filter: [filter: StockFilter]
  reset: []
}>()

const localFilter = ref<StockFilter>({ ...props.currentFilter })

watch(() => props.currentFilter, (newFilter) => {
  localFilter.value = { ...newFilter }
}, { deep: true })

function applyFilters() {
  emit('filter', localFilter.value)
}

function resetFilters() {
  localFilter.value = {}
  emit('reset')
}
</script>

<template>
  <div class="card space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-tv-text">Filters</h3>
      <button @click="resetFilters" class="text-sm text-tv-text-secondary hover:text-tv-text">
        Reset
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label class="block text-sm text-tv-text-secondary mb-1">Ticker</label>
        <input
          v-model="localFilter.ticker"
          type="text"
          placeholder="e.g., AAPL"
          class="input"
          @keyup.enter="applyFilters"
        />
      </div>

      <div>
        <label class="block text-sm text-tv-text-secondary mb-1">Company</label>
        <input
          v-model="localFilter.company"
          type="text"
          placeholder="Search company..."
          class="input"
          @keyup.enter="applyFilters"
        />
      </div>

      <div>
        <label class="block text-sm text-tv-text-secondary mb-1">Brokerage</label>
        <select v-model="localFilter.brokerage" class="select">
          <option value="">All Brokerages</option>
          <option v-for="b in filters?.brokerages" :key="b" :value="b">{{ b }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm text-tv-text-secondary mb-1">Rating</label>
        <select v-model="localFilter.rating" class="select">
          <option value="">All Ratings</option>
          <option v-for="r in filters?.ratings" :key="r" :value="r">{{ r }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm text-tv-text-secondary mb-1">Action</label>
        <select v-model="localFilter.action" class="select">
          <option value="">All Actions</option>
          <option v-for="a in filters?.actions" :key="a" :value="a">{{ a }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm text-tv-text-secondary mb-1">Sort By</label>
        <select v-model="localFilter.sort_by" class="select">
          <option value="">Default (Score)</option>
          <option value="ticker">Ticker</option>
          <option value="company">Company</option>
          <option value="recommend_score">Score</option>
          <option value="created_at">Date Added</option>
        </select>
      </div>

      <div>
        <label class="block text-sm text-tv-text-secondary mb-1">Order</label>
        <select v-model="localFilter.sort_order" class="select">
          <option value="DESC">Descending</option>
          <option value="ASC">Ascending</option>
        </select>
      </div>

      <div class="flex items-end">
        <button @click="applyFilters" class="btn-primary w-full">
          Apply Filters
        </button>
      </div>
    </div>
  </div>
</template>
