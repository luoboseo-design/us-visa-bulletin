// 数据库表类型定义

export interface Region {
  id: string
  code: string
  name: string
  display_order: number
  created_at: string
  updated_at: string
}

export interface VisaCategory {
  id: string
  code: string
  name: string
  category_type: 'employment' | 'family'
  subcategory?: string
  description?: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface VisaBulletin {
  id: string
  bulletin_month: string
  visa_category_id: string
  region_id: string
  table_type: 'A' | 'B'
  priority_date?: string
  change_days?: number
  change_status: 'advanced' | 'retrogressed' | 'unchanged' | 'current' | 'unavailable'
  bulletin_url?: string
  notes?: string
  created_at: string
  updated_at: string
  
  // 关联数据
  visa_category?: VisaCategory
  region?: Region
}

export interface FaqCategory {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Faq {
  id: string
  category_id: string
  question: string
  answer: string
  keywords: string[]
  view_count: number
  helpful_count: number
  display_order: number
  is_published: boolean
  created_at: string
  updated_at: string
  search_vector?: string
  
  // 关联数据
  category?: {
    name: string
    slug: string
  }
}

export interface SystemConfig {
  id: string
  key: string
  value: string
  value_type: 'string' | 'number' | 'boolean' | 'json'
  category: string
  description?: string
  is_public: boolean
  created_at: string
  updated_at: string
}

// API响应类型定义

export interface LatestBulletinResponse {
  bulletin_month: string
  category_code: string
  category_name: string
  category_type: 'employment' | 'family'
  region_code: string
  region_name: string
  table_type: 'A' | 'B'
  priority_date?: string
  change_days?: number
  change_status: string
  notes?: string
}

export interface BulletinTrendResponse {
  bulletin_month: string
  priority_date?: string
  change_days?: number
  change_status: string
}

export interface FaqSearchResult {
  id: string
  question: string
  answer: string
  category_name: string
  view_count: number
  helpful_count: number
  rank: number
}

// 业务逻辑类型定义

export interface BulletinDisplayData {
  categoryName: string
  categoryCode: string
  categoryType: 'employment' | 'family'
  regionCode: string
  regionName: string
  tableA: {
    priorityDate: string | null
    displayText: string
    changeText: string
    changeClass: string
  }
  tableB: {
    priorityDate: string | null
    displayText: string
    changeText: string
    changeClass: string
  }
}

export interface ChartDataPoint {
  date: string
  value: string
  label?: string
}

export interface TrendChartData {
  category: string
  region: string
  tableType: 'A' | 'B'
  data: ChartDataPoint[]
}

// 网站配置类型
export interface SiteConfiguration {
  seo: {
    title: string
    description: string
    keywords: string
    author: string
  }
  ads: {
    enabled: boolean
    clientId: string
    slots: {
      header: string
      sidebar: string
    }
  }
  general: {
    bulletinUpdateDay: number
    maxSearchResults: number
    enableAnalytics: boolean
  }
}

// 签证类别常量
export const VISA_CATEGORIES = {
  // 职业移民
  EB1: 'EB1',
  EB2: 'EB2', 
  EB3: 'EB3',
  EB4: 'EB4',
  EB5: 'EB5',
  EB5R: 'EB5R',
  EB5H: 'EB5H',
  EB5I: 'EB5I',
  
  // 亲属移民
  F1: 'F1',
  F2A: 'F2A',
  F2B: 'F2B',
  F3: 'F3',
  F4: 'F4'
} as const

// 地区常量
export const REGIONS = {
  CHINA: 'cn',
  REST_OF_WORLD: 'rw'
} as const

// 表格类型
export const TABLE_TYPES = {
  A: 'A', // 审批日期
  B: 'B'  // 递件日期
} as const

// 事件追踪类型
export interface AnalyticsEvent {
  type: 'page_view' | 'search' | 'click' | 'faq_view'
  category: string
  action: string
  label?: string
  value?: number
  custom_data?: Record<string, any>
}
