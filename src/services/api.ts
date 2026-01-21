import axios, { type AxiosInstance, type AxiosError } from 'axios'
import type {
  Stock,
  StockRecommendation,
  PaginatedResponse,
  ApiResponse,
  SyncStatus,
  StockFilter,
  FiltersResponse
} from '@/types'
import config from '@/config'

class ApiService {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: config.apiBaseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        console.error('API Error:', error.message)
        return Promise.reject(error)
      }
    )
  }

  async getStocks(filter: StockFilter = {}): Promise<PaginatedResponse<Stock>> {
    const params = new URLSearchParams()

    if (filter.ticker) params.append('ticker', filter.ticker)
    if (filter.company) params.append('company', filter.company)
    if (filter.brokerage) params.append('brokerage', filter.brokerage)
    if (filter.rating) params.append('rating', filter.rating)
    if (filter.action) params.append('action', filter.action)
    if (filter.sort_by) params.append('sort_by', filter.sort_by)
    if (filter.sort_order) params.append('sort_order', filter.sort_order)
    if (filter.page) params.append('page', filter.page.toString())
    if (filter.page_size) params.append('page_size', filter.page_size.toString())

    const response = await this.client.get<PaginatedResponse<Stock>>(`/stocks?${params}`)
    return response.data
  }

  async getStockById(id: string): Promise<Stock> {
    const response = await this.client.get<ApiResponse<Stock>>(`/stocks/${id}`)
    return response.data.data
  }

  async searchStocks(query: string, limit: number = 10): Promise<Stock[]> {
    const response = await this.client.get<ApiResponse<Stock[]>>('/stocks/search', {
      params: { q: query, limit }
    })
    return response.data.data
  }

  async getFilters(): Promise<FiltersResponse> {
    const response = await this.client.get<ApiResponse<FiltersResponse>>('/stocks/filters')
    return response.data.data
  }

  async getRecommendations(limit: number = 10): Promise<StockRecommendation[]> {
    const response = await this.client.get<ApiResponse<StockRecommendation[]>>('/recommendations', {
      params: { limit }
    })
    return response.data.data
  }

  async syncStocks(username: string, password: string): Promise<SyncStatus> {
    const response = await this.client.post<SyncStatus>(
      '/sync',
      {},
      {
        auth: { username, password }
      }
    )
    return response.data
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.client.get('/ping')
      return true
    } catch {
      return false
    }
  }
}

export const apiService = new ApiService()
export default apiService
