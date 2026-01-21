import type { AppConfig } from '@/types'

export const config: AppConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  pollingInterval: parseInt(import.meta.env.VITE_POLLING_INTERVAL || '10000', 10),
  defaultPageSize: parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE || '20', 10)
}

export default config
