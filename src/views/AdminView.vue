<script setup lang="ts">
import { ref } from 'vue'
import apiService from '@/services/api'
import type { SyncStatus } from '@/types'
import config from '@/config'

const username = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref<string | null>(null)
const syncResult = ref<SyncStatus | null>(null)
const showPassword = ref(false)

async function handleSync() {
  if (!username.value || !password.value) {
    error.value = 'Please enter username and password'
    return
  }

  isLoading.value = true
  error.value = null
  syncResult.value = null

  try {
    syncResult.value = await apiService.syncStocks(username.value, password.value)
  } catch (err: any) {
    if (err.response?.status === 401) {
      error.value = 'Invalid credentials'
    } else if (err.response?.status === 409) {
      error.value = 'Sync already in progress. Please wait.'
    } else {
      error.value = err.message || 'Failed to sync stocks'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6 animate-fade-in">
    <div>
      <h1 class="text-3xl font-bold text-tv-text">Admin Panel</h1>
      <p class="text-tv-text-secondary mt-1">Sync stock data from external API</p>
    </div>

    <div class="card">
      <h2 class="text-xl font-semibold text-tv-text mb-6">Sync Stocks</h2>
      
      <form @submit.prevent="handleSync" class="space-y-4">
        <div>
          <label class="block text-sm text-tv-text-secondary mb-2">Username</label>
          <input
            v-model="username"
            type="text"
            placeholder="Enter admin username"
            class="input"
            :disabled="isLoading"
          />
        </div>

        <div>
          <label class="block text-sm text-tv-text-secondary mb-2">Password</label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter admin password"
              class="input pr-10"
              :disabled="isLoading"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-tv-text-secondary hover:text-tv-text"
            >
              <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>

        <div v-if="error" class="p-4 rounded-lg bg-tv-red/10 border border-tv-red/30">
          <p class="text-tv-red text-sm">{{ error }}</p>
        </div>

        <button
          type="submit"
          class="btn-primary w-full flex items-center justify-center space-x-2"
          :disabled="isLoading"
        >
          <svg v-if="isLoading" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{{ isLoading ? 'Syncing...' : 'Start Sync' }}</span>
        </button>
      </form>
    </div>

    <div v-if="syncResult" class="card border-tv-green/30">
      <div class="flex items-center space-x-3 mb-4">
        <div class="w-10 h-10 rounded-full bg-tv-green/20 flex items-center justify-center">
          <svg class="w-6 h-6 text-tv-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h3 class="font-semibold text-tv-text">Sync Completed</h3>
          <p class="text-sm text-tv-text-secondary">{{ syncResult.last_sync }}</p>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div class="text-center p-4 bg-tv-bg rounded-lg">
          <p class="text-2xl font-bold text-tv-text">{{ syncResult.total_records }}</p>
          <p class="text-sm text-tv-text-secondary">Total Records</p>
        </div>
        <div class="text-center p-4 bg-tv-bg rounded-lg">
          <p class="text-2xl font-bold text-tv-green">{{ syncResult.new_records }}</p>
          <p class="text-sm text-tv-text-secondary">New Records</p>
        </div>
        <div class="text-center p-4 bg-tv-bg rounded-lg">
          <p class="text-2xl font-bold text-tv-blue">{{ syncResult.updated_records }}</p>
          <p class="text-sm text-tv-text-secondary">Updated</p>
        </div>
      </div>
    </div>

    <div class="card">
      <h3 class="font-semibold text-tv-text mb-4">Configuration</h3>
      <div class="space-y-3 text-sm">
        <div class="flex justify-between py-2 border-b border-tv-border/50">
          <span class="text-tv-text-secondary">API Base URL</span>
          <span class="text-tv-text font-mono">{{ config.apiBaseUrl }}</span>
        </div>
        <div class="flex justify-between py-2 border-b border-tv-border/50">
          <span class="text-tv-text-secondary">Polling Interval</span>
          <span class="text-tv-text">{{ config.pollingInterval / 1000 }} seconds</span>
        </div>
        <div class="flex justify-between py-2">
          <span class="text-tv-text-secondary">Default Page Size</span>
          <span class="text-tv-text">{{ config.defaultPageSize }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
