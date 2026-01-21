<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStocksStore } from '@/stores/stocks'
import SearchBar from '@/components/common/SearchBar.vue'

const router = useRouter()
const stocksStore = useStocksStore()

const lastUpdatedText = computed(() => {
  if (!stocksStore.lastUpdated) return 'Never'
  const seconds = Math.floor((Date.now() - stocksStore.lastUpdated.getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  return `${minutes}m ago`
})

const isPolling = computed(() => stocksStore.pollingEnabled)

function handleSearch(query: string) {
  if (query.trim()) {
    router.push({ name: 'stocks', query: { search: query } })
  }
}
</script>

<template>
  <header class="bg-tv-bg-secondary border-b border-tv-border px-6 py-3">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-8">
        <router-link to="/" class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-br from-tv-blue to-tv-purple rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <span class="text-xl font-bold text-tv-text">Stock Viewer</span>
        </router-link>
        
        <div class="w-96">
          <SearchBar @search="handleSearch" placeholder="Search stocks by ticker or company..." />
        </div>
      </div>

      <div class="flex items-center space-x-6">
        <div class="flex items-center space-x-2 text-sm">
          <span class="text-tv-text-secondary">Updated:</span>
          <span class="text-tv-text">{{ lastUpdatedText }}</span>
          <button
            @click="stocksStore.togglePolling"
            class="ml-2 p-1 rounded hover:bg-tv-bg-tertiary transition-colors"
            :class="isPolling ? 'text-tv-green' : 'text-tv-text-secondary'"
            :title="isPolling ? 'Auto-refresh ON' : 'Auto-refresh OFF'"
          >
            <svg class="w-4 h-4" :class="{ 'animate-spin': isPolling }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        <div class="h-6 w-px bg-tv-border"></div>

        <router-link to="/admin" class="text-tv-text-secondary hover:text-tv-text transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </router-link>
      </div>
    </div>
  </header>
</template>
