<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStocksStore } from '@/stores/stocks'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

const route = useRoute()
const router = useRouter()
const stocksStore = useStocksStore()

const stockId = computed(() => route.params.id as string)

const priceChange = computed(() => {
  const stock = stocksStore.currentStock
  if (!stock?.target_from || !stock?.target_to) return null
  return ((stock.target_to - stock.target_from) / stock.target_from) * 100
})

const isPriceUp = computed(() => priceChange.value !== null && priceChange.value >= 0)

const ratingClass = computed(() => {
  const rating = stocksStore.currentStock?.rating_to?.toLowerCase() || ''
  if (rating.includes('buy') || rating.includes('outperform')) return 'badge-green'
  if (rating.includes('sell') || rating.includes('underperform')) return 'badge-red'
  if (rating.includes('hold') || rating.includes('neutral')) return 'badge-yellow'
  return 'badge-neutral'
})

const actionClass = computed(() => {
  const action = stocksStore.currentStock?.action?.toLowerCase() || ''
  if (action.includes('raised') || action.includes('upgraded')) return 'text-tv-green'
  if (action.includes('lowered') || action.includes('downgraded')) return 'text-tv-red'
  return 'text-tv-text'
})

const scoreColor = computed(() => {
  const score = stocksStore.currentStock?.recommend_score || 0
  if (score >= 70) return 'text-tv-green'
  if (score >= 40) return 'text-tv-yellow'
  return 'text-tv-red'
})

onMounted(() => {
  stocksStore.fetchStockById(stockId.value)
})

function goBack() {
  router.back()
}
</script>

<template>
  <div class="max-w-4xl mx-auto animate-fade-in">
    <button @click="goBack" class="flex items-center text-tv-text-secondary hover:text-tv-text mb-6 transition-colors">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Back to Stocks
    </button>

    <LoadingSpinner v-if="stocksStore.isLoading" text="Loading stock details..." />
    <ErrorMessage v-else-if="stocksStore.error" :message="stocksStore.error" @retry="stocksStore.fetchStockById(stockId)" :retry="true" />

    <template v-else-if="stocksStore.currentStock">
      <div class="card mb-6">
        <div class="flex items-start justify-between mb-6">
          <div>
            <div class="flex items-center space-x-4">
              <h1 class="text-4xl font-bold text-tv-text">{{ stocksStore.currentStock.ticker }}</h1>
              <span :class="ratingClass" class="text-lg">{{ stocksStore.currentStock.rating_to }}</span>
            </div>
            <p class="text-lg text-tv-text-secondary mt-2">{{ stocksStore.currentStock.company }}</p>
          </div>
          <div class="text-right">
            <div class="text-sm text-tv-text-secondary mb-1">Recommendation Score</div>
            <div :class="scoreColor" class="text-5xl font-bold">
              {{ stocksStore.currentStock.recommend_score.toFixed(1) }}
            </div>
          </div>
        </div>

        <div class="w-full h-3 bg-tv-bg rounded-full overflow-hidden mb-6">
          <div
            class="h-full rounded-full transition-all duration-700"
            :class="stocksStore.currentStock.recommend_score >= 70 ? 'bg-tv-green' :
                    stocksStore.currentStock.recommend_score >= 40 ? 'bg-tv-yellow' : 'bg-tv-red'"
            :style="{ width: `${stocksStore.currentStock.recommend_score}%` }"
          ></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-tv-text border-b border-tv-border pb-2">Analysis Details</h3>
            
            <div class="flex justify-between py-2 border-b border-tv-border/50">
              <span class="text-tv-text-secondary">Brokerage</span>
              <span class="text-tv-text font-medium">{{ stocksStore.currentStock.brokerage || 'N/A' }}</span>
            </div>
            
            <div class="flex justify-between py-2 border-b border-tv-border/50">
              <span class="text-tv-text-secondary">Action</span>
              <span :class="actionClass" class="font-medium capitalize">{{ stocksStore.currentStock.action }}</span>
            </div>
            
            <div v-if="stocksStore.currentStock.rating_from" class="flex justify-between py-2 border-b border-tv-border/50">
              <span class="text-tv-text-secondary">Previous Rating</span>
              <span class="text-tv-text">{{ stocksStore.currentStock.rating_from }}</span>
            </div>
            
            <div class="flex justify-between py-2">
              <span class="text-tv-text-secondary">Current Rating</span>
              <span class="text-tv-text font-semibold">{{ stocksStore.currentStock.rating_to }}</span>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-tv-text border-b border-tv-border pb-2">Price Target</h3>
            
            <div v-if="stocksStore.currentStock.target_from" class="flex justify-between py-2 border-b border-tv-border/50">
              <span class="text-tv-text-secondary">Previous Target</span>
              <span class="text-tv-text">${{ stocksStore.currentStock.target_from.toFixed(2) }}</span>
            </div>
            
            <div v-if="stocksStore.currentStock.target_to" class="flex justify-between py-2 border-b border-tv-border/50">
              <span class="text-tv-text-secondary">Current Target</span>
              <span class="text-tv-text font-semibold">${{ stocksStore.currentStock.target_to.toFixed(2) }}</span>
            </div>
            
            <div v-if="priceChange !== null" class="flex justify-between py-2">
              <span class="text-tv-text-secondary">Target Change</span>
              <span :class="isPriceUp ? 'text-tv-green' : 'text-tv-red'" class="font-bold text-lg">
                {{ isPriceUp ? '+' : '' }}{{ priceChange.toFixed(2) }}%
              </span>
            </div>

            <div v-if="priceChange !== null" class="p-4 rounded-lg mt-4" :class="isPriceUp ? 'bg-tv-green/10' : 'bg-tv-red/10'">
              <div class="flex items-center space-x-2">
                <svg v-if="isPriceUp" class="w-6 h-6 text-tv-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <svg v-else class="w-6 h-6 text-tv-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
                <span :class="isPriceUp ? 'text-tv-green' : 'text-tv-red'" class="font-medium">
                  {{ isPriceUp ? 'Bullish Signal' : 'Bearish Signal' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <h3 class="text-lg font-semibold text-tv-text mb-4">Timestamps</h3>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-tv-text-secondary">Created</span>
            <p class="text-tv-text mt-1">{{ new Date(stocksStore.currentStock.created_at).toLocaleString() }}</p>
          </div>
          <div>
            <span class="text-tv-text-secondary">Last Updated</span>
            <p class="text-tv-text mt-1">{{ new Date(stocksStore.currentStock.updated_at).toLocaleString() }}</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
