<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStocksStore } from '@/stores/stocks'
import type { Stock, StockFilter } from '@/types'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import StockTable from '@/components/stocks/StockTable.vue'
import StockFilters from '@/components/stocks/StockFilters.vue'
import Pagination from '@/components/common/Pagination.vue'

const route = useRoute()
const router = useRouter()
const stocksStore = useStocksStore()

const viewMode = ref<'table' | 'cards'>('table')

onMounted(async () => {
  await stocksStore.fetchFilters()

  const searchQuery = route.query.search as string
  if (searchQuery) {
    await stocksStore.fetchStocks({ ticker: searchQuery })
  } else {
    await stocksStore.fetchStocks()
  }

  stocksStore.startPolling()
})

onUnmounted(() => {
  stocksStore.stopPolling()
})

watch(() => route.query.search, (newSearch) => {
  if (newSearch) {
    stocksStore.fetchStocks({ ticker: newSearch as string })
  }
})

function handleFilter(filter: StockFilter) {
  stocksStore.setFilter(filter)
}

function handleSort(field: string) {
  const currentSort = stocksStore.currentFilter.sort_by
  const currentOrder = stocksStore.currentFilter.sort_order

  let newOrder: 'ASC' | 'DESC' = 'DESC'
  if (currentSort === field && currentOrder === 'DESC') {
    newOrder = 'ASC'
  }

  stocksStore.setFilter({ sort_by: field, sort_order: newOrder })
}

function handleSelect(stock: Stock) {
  router.push({ name: 'stock-detail', params: { id: stock.id } })
}

function handlePageChange(page: number) {
  stocksStore.setPage(page)
}

function handlePageSizeChange(size: number) {
  stocksStore.setPageSize(size)
}
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-tv-text">All Stocks</h1>
        <p class="text-tv-text-secondary mt-1">
          Browse and filter stock recommendations
        </p>
      </div>
      <div class="flex items-center space-x-2">
        <button
          @click="viewMode = 'table'"
          class="p-2 rounded transition-colors"
          :class="viewMode === 'table' ? 'bg-tv-blue text-white' : 'bg-tv-bg-tertiary text-tv-text-secondary hover:text-tv-text'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </button>
        <button
          @click="viewMode = 'cards'"
          class="p-2 rounded transition-colors"
          :class="viewMode === 'cards' ? 'bg-tv-blue text-white' : 'bg-tv-bg-tertiary text-tv-text-secondary hover:text-tv-text'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
      </div>
    </div>

    <StockFilters
      :filters="stocksStore.filters"
      :current-filter="stocksStore.currentFilter"
      @filter="handleFilter"
      @reset="stocksStore.resetFilters"
    />

    <LoadingSpinner v-if="stocksStore.isLoading && !stocksStore.hasStocks" text="Loading stocks..." />
    <ErrorMessage v-else-if="stocksStore.error" :message="stocksStore.error" @retry="stocksStore.fetchStocks()" :retry="true" />

    <template v-else>
      <StockTable
        v-if="viewMode === 'table'"
        :stocks="stocksStore.stocks"
        :sort-by="stocksStore.currentFilter.sort_by"
        :sort-order="stocksStore.currentFilter.sort_order"
        @sort="handleSort"
        @select="handleSelect"
      />

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div
          v-for="stock in stocksStore.stocks"
          :key="stock.id"
          class="card-hover cursor-pointer"
          @click="handleSelect(stock)"
        >
          <div class="flex items-start justify-between mb-2">
            <div>
              <span class="text-lg font-bold text-tv-text">{{ stock.ticker }}</span>
              <p class="text-sm text-tv-text-secondary truncate max-w-40">{{ stock.company }}</p>
            </div>
            <span
              class="text-xs px-2 py-1 rounded"
              :class="stock.rating_to.toLowerCase().includes('buy') ? 'badge-green' :
                      stock.rating_to.toLowerCase().includes('sell') ? 'badge-red' : 'badge-neutral'"
            >
              {{ stock.rating_to }}
            </span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-tv-text-secondary">Score</span>
            <span class="font-semibold" :class="stock.recommend_score >= 70 ? 'text-tv-green' : stock.recommend_score >= 40 ? 'text-tv-yellow' : 'text-tv-red'">
              {{ stock.recommend_score.toFixed(1) }}
            </span>
          </div>
        </div>
      </div>

      <Pagination
        :page="stocksStore.pagination.page"
        :page-size="stocksStore.pagination.pageSize"
        :total-items="stocksStore.pagination.totalItems"
        :total-pages="stocksStore.pagination.totalPages"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      />
    </template>
  </div>
</template>
