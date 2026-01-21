import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/stocks',
      name: 'stocks',
      component: () => import('@/views/StocksView.vue')
    },
    {
      path: '/stocks/:id',
      name: 'stock-detail',
      component: () => import('@/views/StockDetailView.vue')
    },
    {
      path: '/recommendations',
      name: 'recommendations',
      component: () => import('@/views/RecommendationsView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminView.vue')
    }
  ]
})

export default router
