export interface Stock {
  id: string
  ticker: string
  company: string
  brokerage: string
  action: string
  rating_from: string
  rating_to: string
  target_from: number
  target_to: number
  recommend_score: number
  created_at: string
  updated_at: string
}

export interface StockRecommendation {
  stock: Stock
  score: number
  reason: string
  rank: number
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  page_size: number
  total_items: number
  total_pages: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ErrorResponse {
  error: string
  message?: string
}

export interface SyncStatus {
  status: string
  total_records: number
  new_records: number
  updated_records: number
  last_sync: string
}

export interface StockFilter {
  ticker?: string
  company?: string
  brokerage?: string
  rating?: string
  action?: string
  sort_by?: string
  sort_order?: 'ASC' | 'DESC'
  page?: number
  page_size?: number
}

export interface FiltersResponse {
  brokerages: string[]
  ratings: string[]
  actions: string[]
}

export interface AppConfig {
  apiBaseUrl: string
  pollingInterval: number
  defaultPageSize: number
}

export type RatingType = 'Buy' | 'Sell' | 'Hold' | 'Neutral' | 'Outperform' | 'Underperform' | string

export type ActionType = 'target raised by' | 'target lowered by' | 'upgraded by' | 'downgraded by' | 'initiated by' | string
