<script setup lang="ts">
import { computed } from 'vue'
import type { Stock } from '@/types'

const props = defineProps<{
  stock: Stock
}>()

const priceChange = computed(() => {
  if (!props.stock.target_from || !props.stock.target_to) return null
  return ((props.stock.target_to - props.stock.target_from) / props.stock.target_from) * 100
})

const isPriceUp = computed(() => priceChange.value !== null && priceChange.value >= 0)

const ratingClass = computed(() => {
  const rating = props.stock.rating_to.toLowerCase()
  if (rating.includes('buy') || rating.includes('outperform')) return 'badge-green'
  if (rating.includes('sell') || rating.includes('underperform')) return 'badge-red'
  if (rating.includes('hold') || rating.includes('neutral')) return 'badge-yellow'
  return 'badge-neutral'
})

const actionClass = computed(() => {
  const action = props.stock.action.toLowerCase()
  if (action.includes('raised') || action.includes('upgraded')) return 'text-tv-green'
  if (action.includes('lowered') || action.includes('downgraded')) return 'text-tv-red'
  return 'text-tv-text-secondary'
})
</script>

<template>
  <router-link :to="{ name: 'stock-detail', params: { id: stock.id } }" class="block">
    <div class="card-hover group">
      <div class="flex items-start justify-between mb-3">
        <div>
          <h3 class="text-lg font-bold text-tv-text group-hover:text-tv-blue transition-colors">
            {{ stock.ticker }}
          </h3>
          <p class="text-sm text-tv-text-secondary truncate max-w-48">{{ stock.company }}</p>
        </div>
        <span :class="ratingClass">{{ stock.rating_to }}</span>
      </div>

      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-tv-text-secondary">Brokerage</span>
          <span class="text-tv-text">{{ stock.brokerage || 'N/A' }}</span>
        </div>

        <div class="flex justify-between">
          <span class="text-tv-text-secondary">Action</span>
          <span :class="actionClass" class="capitalize">{{ stock.action }}</span>
        </div>

        <div v-if="priceChange !== null" class="flex justify-between">
          <span class="text-tv-text-secondary">Target Change</span>
          <span :class="isPriceUp ? 'price-up' : 'price-down'" class="font-medium">
            {{ isPriceUp ? '+' : '' }}{{ priceChange.toFixed(2) }}%
          </span>
        </div>

        <div class="flex justify-between items-center pt-2 border-t border-tv-border">
          <span class="text-tv-text-secondary">Score</span>
          <div class="flex items-center">
            <div class="w-20 h-2 bg-tv-bg rounded-full overflow-hidden mr-2">
              <div
                class="h-full rounded-full transition-all duration-500"
                :class="stock.recommend_score >= 70 ? 'bg-tv-green' : stock.recommend_score >= 40 ? 'bg-tv-yellow' : 'bg-tv-red'"
                :style="{ width: `${stock.recommend_score}%` }"
              ></div>
            </div>
            <span class="font-semibold text-tv-text">{{ stock.recommend_score.toFixed(1) }}</span>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>
