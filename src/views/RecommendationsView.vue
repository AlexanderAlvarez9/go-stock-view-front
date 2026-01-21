<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRecommendationsStore } from '@/stores/recommendations'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import RecommendationCard from '@/components/recommendations/RecommendationCard.vue'

const recommendationsStore = useRecommendationsStore()
const limit = ref(20)

onMounted(async () => {
  await recommendationsStore.fetchRecommendations(limit.value)
  recommendationsStore.startPolling()
})

onUnmounted(() => {
  recommendationsStore.stopPolling()
})

function loadMore() {
  limit.value += 10
  recommendationsStore.fetchRecommendations(limit.value)
}
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-tv-text">Top Recommendations</h1>
        <p class="text-tv-text-secondary mt-1">
          AI-powered stock recommendations based on analyst ratings and price targets
        </p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="text-sm text-tv-text-secondary">
          Showing {{ recommendationsStore.recommendations.length }} stocks
        </div>
        <button
          @click="recommendationsStore.togglePolling"
          class="btn-secondary flex items-center space-x-2"
        >
          <span class="w-2 h-2 rounded-full" :class="recommendationsStore.pollingEnabled ? 'bg-tv-green animate-pulse' : 'bg-tv-red'"></span>
          <span>{{ recommendationsStore.pollingEnabled ? 'Live' : 'Paused' }}</span>
        </button>
      </div>
    </div>

    <div class="card bg-gradient-to-r from-tv-blue/10 to-tv-purple/10 border-tv-blue/30">
      <div class="flex items-start space-x-4">
        <div class="w-12 h-12 rounded-lg bg-tv-blue/20 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6 text-tv-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 class="font-semibold text-tv-text">How Recommendations Work</h3>
          <p class="text-sm text-tv-text-secondary mt-1">
            Our algorithm analyzes multiple factors including analyst ratings (Buy, Hold, Sell), 
            recent price target changes, brokerage actions (upgrades/downgrades), and calculates 
            a weighted score to recommend the best investment opportunities.
          </p>
        </div>
      </div>
    </div>

    <LoadingSpinner v-if="recommendationsStore.isLoading && !recommendationsStore.hasRecommendations" text="Analyzing stocks..." />
    <ErrorMessage v-else-if="recommendationsStore.error" :message="recommendationsStore.error" @retry="recommendationsStore.fetchRecommendations(limit)" :retry="true" />

    <template v-else>
      <div v-if="recommendationsStore.topRecommendation" class="mb-8">
        <h2 class="text-xl font-semibold text-tv-text mb-4 flex items-center">
          <svg class="w-6 h-6 text-tv-yellow mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          #1 Top Pick
        </h2>
        <RecommendationCard :recommendation="recommendationsStore.topRecommendation" :highlight="true" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RecommendationCard
          v-for="rec in recommendationsStore.recommendations.slice(1)"
          :key="rec.stock.id"
          :recommendation="rec"
        />
      </div>

      <div v-if="recommendationsStore.recommendations.length >= limit" class="text-center pt-6">
        <button @click="loadMore" class="btn-secondary">
          Load More Recommendations
        </button>
      </div>
    </template>
  </div>
</template>
