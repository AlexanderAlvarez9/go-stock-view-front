<script setup lang="ts">
import { computed } from 'vue'
import type { StockRecommendation } from '@/types'

const props = defineProps<{
  recommendation: StockRecommendation
  highlight?: boolean
}>()

const scoreColor = computed(() => {
  if (props.recommendation.score >= 70) return 'text-tv-green'
  if (props.recommendation.score >= 40) return 'text-tv-yellow'
  return 'text-tv-red'
})

const scoreGlow = computed(() => {
  if (props.recommendation.score >= 70) return 'glow-green'
  return ''
})

const ratingClass = computed(() => {
  const rating = props.recommendation.stock.rating_to.toLowerCase()
  if (rating.includes('buy') || rating.includes('outperform')) return 'badge-green'
  if (rating.includes('sell') || rating.includes('underperform')) return 'badge-red'
  return 'badge-yellow'
})
</script>

<template>
  <router-link :to="{ name: 'stock-detail', params: { id: recommendation.stock.id } }">
    <div
      class="card-hover relative overflow-hidden"
      :class="{ 'border-tv-blue': highlight, [scoreGlow]: highlight }"
    >
      <div v-if="recommendation.rank <= 3" class="absolute top-0 left-0 z-10">
        <div
          class="w-10 h-10 flex items-center justify-center text-sm font-bold rounded-br-lg"
          :class="{
            'bg-yellow-500 text-black': recommendation.rank === 1,
            'bg-gray-400 text-black': recommendation.rank === 2,
            'bg-amber-700 text-white': recommendation.rank === 3
          }"
        >
          #{{ recommendation.rank }}
        </div>
      </div>

      <div class="flex items-start justify-between mb-4">
        <div class="flex-1" :class="{ 'ml-12': recommendation.rank <= 3 }">
          <div class="flex items-center space-x-2">
            <span class="text-2xl font-bold text-tv-text">{{ recommendation.stock.ticker }}</span>
            <span :class="ratingClass">{{ recommendation.stock.rating_to }}</span>
          </div>
          <p class="text-sm text-tv-text-secondary mt-1">{{ recommendation.stock.company }}</p>
        </div>
        <div class="text-right flex-shrink-0 ml-4">
          <div :class="scoreColor" class="text-3xl font-bold">
            {{ recommendation.score.toFixed(1) }}
          </div>
          <div class="text-xs text-tv-text-secondary">Score</div>
        </div>
      </div>

      <div class="mb-4">
        <div class="w-full h-2 bg-tv-bg rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-700"
            :class="recommendation.score >= 70 ? 'bg-tv-green' : recommendation.score >= 40 ? 'bg-tv-yellow' : 'bg-tv-red'"
            :style="{ width: `${recommendation.score}%` }"
          ></div>
        </div>
      </div>

      <div class="text-sm text-tv-text-secondary mb-3">
        <span class="text-tv-text-secondary capitalize">{{ recommendation.stock.action }}</span>
        <span v-if="recommendation.stock.brokerage"> by {{ recommendation.stock.brokerage }}</span>
      </div>

      <div class="p-3 bg-tv-bg rounded-lg">
        <p class="text-sm text-tv-text">{{ recommendation.reason }}</p>
      </div>

      <div v-if="recommendation.stock.target_from && recommendation.stock.target_to" class="mt-4 flex justify-between text-sm">
        <div>
          <span class="text-tv-text-secondary">Target From:</span>
          <span class="ml-2 text-tv-text">${{ recommendation.stock.target_from.toFixed(2) }}</span>
        </div>
        <div>
          <span class="text-tv-text-secondary">Target To:</span>
          <span
            class="ml-2 font-medium"
            :class="recommendation.stock.target_to >= recommendation.stock.target_from ? 'text-tv-green' : 'text-tv-red'"
          >
            ${{ recommendation.stock.target_to.toFixed(2) }}
          </span>
        </div>
      </div>
    </div>
  </router-link>
</template>
