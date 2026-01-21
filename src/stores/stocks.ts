import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Stock, StockFilter, PaginatedResponse, FiltersResponse } from '@/types'
import apiService from '@/services/api'
import config from '@/config'

export const useStocksStore = defineStore('stocks', () => {
  const stocks = ref<Stock[]>([])
  const currentStock = ref<Stock | null>(null)
  const filters = ref<FiltersResponse | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    page: 1,
    pageSize: config.defaultPageSize,
    totalItems: 0,
    totalPages: 0
  })
  const currentFilter = ref<StockFilter>({})
  const searchResults = ref<Stock[]>([])
  const lastUpdated = ref<Date | null>(null)
  const pollingEnabled = ref(true)
  let pollingInterval: ReturnType<typeof setInterval> | null = null

  const hasStocks = computed(() => stocks.value.length > 0)
  const hasNextPage = computed(() => pagination.value.page < pagination.value.totalPages)
  const hasPrevPage = computed(() => pagination.value.page > 1)

  async function fetchStocks(filter: StockFilter = {}) {
    isLoading.value = true
    error.value = null

    try {
      const mergedFilter = { ...currentFilter.value, ...filter }
      const response: PaginatedResponse<Stock> = await apiService.getStocks(mergedFilter)

      stocks.value = response.data || []
      pagination.value = {
        page: response.page,
        pageSize: response.page_size,
        totalItems: response.total_items,
        totalPages: response.total_pages
      }
      currentFilter.value = mergedFilter
      lastUpdated.value = new Date()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch stocks'
      console.error('Error fetching stocks:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchStockById(id: string) {
    isLoading.value = true
    error.value = null

    try {
      currentStock.value = await apiService.getStockById(id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch stock'
      currentStock.value = null
    } finally {
      isLoading.value = false
    }
  }

  async function searchStocks(query: string, limit: number = 10) {
    if (!query.trim()) {
      searchResults.value = []
      return
    }

    try {
      searchResults.value = await apiService.searchStocks(query, limit)
    } catch (err) {
      console.error('Error searching stocks:', err)
      searchResults.value = []
    }
  }

  async function fetchFilters() {
    try {
      filters.value = await apiService.getFilters()
    } catch (err) {
      console.error('Error fetching filters:', err)
    }
  }

  function setPage(page: number) {
    fetchStocks({ page })
  }

  function setPageSize(pageSize: number) {
    fetchStocks({ page: 1, page_size: pageSize })
  }

  function setFilter(filter: StockFilter) {
    fetchStocks({ ...filter, page: 1 })
  }

  function resetFilters() {
    currentFilter.value = {}
    fetchStocks({ page: 1, page_size: config.defaultPageSize })
  }

  function clearSearchResults() {
    searchResults.value = []
  }

  function startPolling() {
    if (pollingInterval) return

    pollingEnabled.value = true
    pollingInterval = setInterval(() => {
      if (pollingEnabled.value) {
        fetchStocks()
      }
    }, config.pollingInterval)
  }

  function stopPolling() {
    pollingEnabled.value = false
    if (pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = null
    }
  }

  function togglePolling() {
    pollingEnabled.value = !pollingEnabled.value
    if (pollingEnabled.value && !pollingInterval) {
      startPolling()
    }
  }

  return {
    stocks,
    currentStock,
    filters,
    isLoading,
    error,
    pagination,
    currentFilter,
    searchResults,
    lastUpdated,
    pollingEnabled,
    hasStocks,
    hasNextPage,
    hasPrevPage,
    fetchStocks,
    fetchStockById,
    searchStocks,
    fetchFilters,
    setPage,
    setPageSize,
    setFilter,
    resetFilters,
    clearSearchResults,
    startPolling,
    stopPolling,
    togglePolling
  }
})
