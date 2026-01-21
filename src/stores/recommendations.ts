import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { StockRecommendation } from '@/types'
import apiService from '@/services/api'
import config from '@/config'

export const useRecommendationsStore = defineStore('recommendations', () => {
  const recommendations = ref<StockRecommendation[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const lastUpdated = ref<Date | null>(null)
  const pollingEnabled = ref(true)
  let pollingInterval: ReturnType<typeof setInterval> | null = null

  const hasRecommendations = computed(() => recommendations.value.length > 0)

  const topRecommendation = computed(() =>
    recommendations.value.length > 0 ? recommendations.value[0] : null
  )

  const buyRecommendations = computed(() =>
    recommendations.value.filter((r) => r.stock.rating_to.toLowerCase().includes('buy'))
  )

  async function fetchRecommendations(limit: number = 10) {
    isLoading.value = true
    error.value = null

    try {
      recommendations.value = await apiService.getRecommendations(limit)
      lastUpdated.value = new Date()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch recommendations'
      console.error('Error fetching recommendations:', err)
    } finally {
      isLoading.value = false
    }
  }

  function startPolling() {
    if (pollingInterval) return

    pollingEnabled.value = true
    pollingInterval = setInterval(() => {
      if (pollingEnabled.value) {
        fetchRecommendations()
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
    recommendations,
    isLoading,
    error,
    lastUpdated,
    pollingEnabled,
    hasRecommendations,
    topRecommendation,
    buyRecommendations,
    fetchRecommendations,
    startPolling,
    stopPolling,
    togglePolling
  }
})
