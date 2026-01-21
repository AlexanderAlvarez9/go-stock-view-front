<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStocksStore } from '@/stores/stocks'
import { useRecommendationsStore } from '@/stores/recommendations'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import RecommendationCard from '@/components/recommendations/RecommendationCard.vue'
import StockCard from '@/components/stocks/StockCard.vue'

const router = useRouter()
const stocksStore = useStocksStore()
const recommendationsStore = useRecommendationsStore()

const topRecommendations = computed(() => recommendationsStore.recommendations.slice(0, 3))
const recentStocks = computed(() => stocksStore.stocks.slice(0, 6))

onMounted(async () => {
  await Promise.all([
    stocksStore.fetchStocks({ page_size: 10 }),
    recommendationsStore.fetchRecommendations(10)
  ])
  stocksStore.startPolling()
  recommendationsStore.startPolling()
})

onUnmounted(() => {
  stocksStore.stopPolling()
  recommendationsStore.stopPolling()
})
</script>

<template>
  <div class="space-y-8 animate-fade-in">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-tv-text">Dashboard</h1>
        <p class="text-tv-text-secondary mt-1">Real-time stock analysis and recommendations</p>
      </div>
      <div class="flex items-center space-x-2 text-sm">
        <span class="w-2 h-2 rounded-full animate-pulse" :class="stocksStore.pollingEnabled ? 'bg-tv-green' : 'bg-tv-red'"></span>
        <span class="text-tv-text-secondary">{{ stocksStore.pollingEnabled ? 'Live' : 'Paused' }}</span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card bg-gradient-to-br from-tv-bg-secondary to-tv-bg-tertiary">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-tv-text-secondary text-sm">Total Stocks</p>
            <p class="text-3xl font-bold text-tv-text mt-1">{{ stocksStore.pagination.totalItems }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-tv-blue/20 flex items-center justify-center">
            <svg class="w-6 h-6 text-tv-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card bg-gradient-to-br from-tv-bg-secondary to-tv-bg-tertiary">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-tv-text-secondary text-sm">Buy Ratings</p>
            <p class="text-3xl font-bold text-tv-green mt-1">{{ recommendationsStore.buyRecommendations.length }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-tv-green/20 flex items-center justify-center">
            <svg class="w-6 h-6 text-tv-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card bg-gradient-to-br from-tv-bg-secondary to-tv-bg-tertiary">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-tv-text-secondary text-sm">Top Score</p>
            <p class="text-3xl font-bold text-tv-yellow mt-1">
              {{ recommendationsStore.topRecommendation?.score.toFixed(1) || '-' }}
            </p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-tv-yellow/20 flex items-center justify-center">
            <svg class="w-6 h-6 text-tv-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-tv-text">Top Recommendations</h2>
        <router-link to="/recommendations" class="text-tv-blue hover:text-tv-blue-light text-sm">
          View All →
        </router-link>
      </div>

      <LoadingSpinner v-if="recommendationsStore.isLoading && !recommendationsStore.hasRecommendations" />
      <ErrorMessage v-else-if="recommendationsStore.error" :message="recommendationsStore.error" @retry="recommendationsStore.fetchRecommendations()" />
      
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RecommendationCard
          v-for="rec in topRecommendations"
          :key="rec.stock.id"
          :recommendation="rec"
          :highlight="rec.rank === 1"
        />
      </div>
    </section>

    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-tv-text">Recent Stocks</h2>
        <router-link to="/stocks" class="text-tv-blue hover:text-tv-blue-light text-sm">
          View All →
        </router-link>
      </div>

      <LoadingSpinner v-if="stocksStore.isLoading && !stocksStore.hasStocks" />
      <ErrorMessage v-else-if="stocksStore.error" :message="stocksStore.error" @retry="stocksStore.fetchStocks()" />

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StockCard v-for="stock in recentStocks" :key="stock.id" :stock="stock" />
      </div>
    </section>
  </div>
</template>
