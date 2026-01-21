<script setup lang="ts">
import { ref, watch } from 'vue'
import { useStocksStore } from '@/stores/stocks'
import { useRouter } from 'vue-router'

const props = defineProps<{
  placeholder?: string
}>()

const emit = defineEmits<{
  search: [query: string]
}>()

const stocksStore = useStocksStore()
const router = useRouter()

const query = ref('')
const showResults = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(query, (newQuery) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  
  if (newQuery.trim().length >= 2) {
    debounceTimer = setTimeout(() => {
      stocksStore.searchStocks(newQuery)
      showResults.value = true
    }, 300)
  } else {
    stocksStore.clearSearchResults()
    showResults.value = false
  }
})

function handleSubmit() {
  if (query.value.trim()) {
    emit('search', query.value)
    showResults.value = false
    stocksStore.clearSearchResults()
  }
}

function selectStock(stockId: string) {
  router.push({ name: 'stock-detail', params: { id: stockId } })
  query.value = ''
  showResults.value = false
  stocksStore.clearSearchResults()
}

function handleBlur() {
  setTimeout(() => {
    showResults.value = false
  }, 200)
}
</script>

<template>
  <div class="relative">
    <form @submit.prevent="handleSubmit">
      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tv-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref="inputRef"
          v-model="query"
          type="text"
          :placeholder="placeholder || 'Search...'"
          class="input pl-10 pr-4"
          @focus="showResults = stocksStore.searchResults.length > 0"
          @blur="handleBlur"
        />
      </div>
    </form>

    <Transition name="fade">
      <div
        v-if="showResults && stocksStore.searchResults.length > 0"
        class="absolute z-50 w-full mt-2 bg-tv-bg-secondary border border-tv-border rounded-lg shadow-xl overflow-hidden"
      >
        <ul class="max-h-80 overflow-auto">
          <li
            v-for="stock in stocksStore.searchResults"
            :key="stock.id"
            @click="selectStock(stock.id)"
            class="px-4 py-3 hover:bg-tv-bg-tertiary cursor-pointer transition-colors border-b border-tv-border last:border-0"
          >
            <div class="flex items-center justify-between">
              <div>
                <span class="font-semibold text-tv-text">{{ stock.ticker }}</span>
                <span class="ml-2 text-sm text-tv-text-secondary">{{ stock.company }}</span>
              </div>
              <span
                class="text-xs font-medium px-2 py-1 rounded"
                :class="stock.rating_to.toLowerCase().includes('buy') ? 'badge-green' : 
                        stock.rating_to.toLowerCase().includes('sell') ? 'badge-red' : 'badge-neutral'"
              >
                {{ stock.rating_to }}
              </span>
            </div>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
