<script setup lang="ts">
import { computed } from 'vue'
import type { Stock } from '@/types'

const props = defineProps<{
  stocks: Stock[]
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
}>()

const emit = defineEmits<{
  sort: [field: string]
  select: [stock: Stock]
}>()

const columns = [
  { key: 'ticker', label: 'Ticker', sortable: true },
  { key: 'company', label: 'Company', sortable: true },
  { key: 'brokerage', label: 'Brokerage', sortable: true },
  { key: 'action', label: 'Action', sortable: false },
  { key: 'rating_to', label: 'Rating', sortable: false },
  { key: 'recommend_score', label: 'Score', sortable: true }
]

function handleSort(key: string) {
  emit('sort', key)
}

function getRatingClass(rating: string) {
  const r = rating.toLowerCase()
  if (r.includes('buy') || r.includes('outperform')) return 'badge-green'
  if (r.includes('sell') || r.includes('underperform')) return 'badge-red'
  if (r.includes('hold') || r.includes('neutral')) return 'badge-yellow'
  return 'badge-neutral'
}

function getActionClass(action: string) {
  const a = action.toLowerCase()
  if (a.includes('raised') || a.includes('upgraded')) return 'text-tv-green'
  if (a.includes('lowered') || a.includes('downgraded')) return 'text-tv-red'
  return 'text-tv-text-secondary'
}

function getScoreColor(score: number) {
  if (score >= 70) return 'bg-tv-green'
  if (score >= 40) return 'bg-tv-yellow'
  return 'bg-tv-red'
}
</script>

<template>
  <div class="overflow-x-auto rounded-lg border border-tv-border">
    <table class="w-full">
      <thead class="bg-tv-bg-tertiary">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            class="table-header"
            :class="{ 'cursor-pointer hover:text-tv-text': col.sortable }"
            @click="col.sortable && handleSort(col.key)"
          >
            <div class="flex items-center space-x-1">
              <span>{{ col.label }}</span>
              <template v-if="col.sortable && sortBy === col.key">
                <svg v-if="sortOrder === 'ASC'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </template>
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-tv-border">
        <tr
          v-for="stock in stocks"
          :key="stock.id"
          class="hover:bg-tv-bg-tertiary cursor-pointer transition-colors"
          @click="emit('select', stock)"
        >
          <td class="table-cell font-semibold text-tv-blue">{{ stock.ticker }}</td>
          <td class="table-cell text-tv-text max-w-xs truncate">{{ stock.company }}</td>
          <td class="table-cell text-tv-text-secondary">{{ stock.brokerage || '-' }}</td>
          <td class="table-cell">
            <span :class="getActionClass(stock.action)" class="capitalize text-sm">
              {{ stock.action }}
            </span>
          </td>
          <td class="table-cell">
            <span :class="getRatingClass(stock.rating_to)">{{ stock.rating_to }}</span>
          </td>
          <td class="table-cell">
            <div class="flex items-center space-x-2">
              <div class="w-16 h-2 bg-tv-bg rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full"
                  :class="getScoreColor(stock.recommend_score)"
                  :style="{ width: `${stock.recommend_score}%` }"
                ></div>
              </div>
              <span class="text-sm font-medium text-tv-text w-10">{{ stock.recommend_score.toFixed(1) }}</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="stocks.length === 0" class="p-8 text-center text-tv-text-secondary">
      No stocks found
    </div>
  </div>
</template>
