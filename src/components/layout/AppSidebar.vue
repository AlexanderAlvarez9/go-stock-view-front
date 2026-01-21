<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const navItems = [
  { name: 'Dashboard', path: '/', icon: 'dashboard' },
  { name: 'All Stocks', path: '/stocks', icon: 'stocks' },
  { name: 'Recommendations', path: '/recommendations', icon: 'recommendations' }
]

function isActive(path: string): boolean {
  return route.path === path
}
</script>

<template>
  <aside class="w-64 bg-tv-bg-secondary border-r border-tv-border flex flex-col">
    <nav class="flex-1 py-4">
      <ul class="space-y-1">
        <li v-for="item in navItems" :key="item.path">
          <router-link
            :to="item.path"
            class="flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200"
            :class="isActive(item.path)
              ? 'text-tv-blue bg-tv-blue/10 border-r-2 border-tv-blue'
              : 'text-tv-text-secondary hover:text-tv-text hover:bg-tv-bg-tertiary'"
          >
            <template v-if="item.icon === 'dashboard'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </template>
            <template v-else-if="item.icon === 'stocks'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </template>
            <template v-else-if="item.icon === 'recommendations'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </template>
            {{ item.name }}
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="p-4 border-t border-tv-border">
      <div class="text-xs text-tv-text-secondary">
        <p>Stock Viewer v1.0</p>
        <p class="mt-1">Real-time stock analysis</p>
      </div>
    </div>
  </aside>
</template>
