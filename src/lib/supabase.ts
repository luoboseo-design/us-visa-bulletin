import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cyczdqlhwowtfhznfvlg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5Y3pkcWxod293dGZoem5mdmxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4OTAyOTMsImV4cCI6MjA3MTQ2NjI5M30.jKZGoBkL93gr95__XmpBVG8pB3G9MJr5w8zzKkK_Od4'

export const supabase = createClient(supabaseUrl, supabaseKey)

// 工具函数
export function formatPriorityDate(date: string | null): string {
  if (!date) return '有名额'
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return '无名额'
  
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

export function getChangeText(changeDays: number | null, changeStatus: string): string {
  if (changeStatus === 'current') return '有名额'
  if (changeStatus === 'unavailable') return '无名额'
  if (!changeDays) return '无变化'
  
  const absDays = Math.abs(changeDays)
  if (changeDays > 0) {
    return `前进${absDays}天`
  } else {
    return `后退${absDays}天`
  }
}

export function getChangeClass(changeDays: number | null, changeStatus: string): string {
  if (changeStatus === 'current') return 'text-green-600'
  if (changeStatus === 'unavailable') return 'text-gray-600'
  if (!changeDays) return 'text-gray-600'
  
  return changeDays > 0 ? 'text-green-600' : 'text-red-600'
}

// 错误处理工具函数
export function handleSupabaseError(error: any): string {
  if (!error) return '未知错误'
  
  // 网络连接错误
  if (error.message?.includes('Failed to fetch') || error.message?.includes('network')) {
    return '网络连接失败，请检查网络连接后重试'
  }
  
  // 数据库查询错误
  if (error.code === 'PGRST116') {
    return '数据库查询失败，请稍后重试或联系技术支持'
  }
  
  // 权限错误
  if (error.code === 'PGRST301' || error.message?.includes('permission')) {
    return '数据访问权限不足，请刷新页面重试'
  }
  
  // 超时错误
  if (error.message?.includes('timeout')) {
    return '请求超时，服务器响应缓慢，请稍后重试'
  }
  
  // 表或视图不存在
  if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
    return '数据表不存在，系统可能正在维护中'
  }
  
  // 字段不存在错误
  if (error.message?.includes('column') && error.message?.includes('does not exist')) {
    return '数据结构异常，请联系技术支持'
  }
  
  // 函数不存在错误
  if (error.message?.includes('function') && error.message?.includes('does not exist')) {
    return '系统功能异常，请稍后重试'
  }
  
  // 返回详细错误信息（开发环境）或通用错误信息（生产环境）
  if (process.env.NODE_ENV === 'development') {
    return `数据库错误: ${error.message || error.toString()}`
  }
  
  return '数据加载失败，请稍后重试或刷新页面'
}

// 数据访问层服务类
export class BulletinService {
  /**
   * 获取最新排期数据
   */
  static async getLatestBulletins() {
    try {
      const { data, error } = await supabase
        .from('v_latest_bulletins')
        .select('*')
        .order('category_type', { ascending: true })
        .order('display_order', { ascending: true })

      if (error) {
        console.error('获取排期数据错误:', error)
        throw new Error(handleSupabaseError(error))
      }
      
      if (!data || data.length === 0) {
        throw new Error('暂无排期数据，请稍后重试')
      }
      
      return data
    } catch (error) {
      if (error instanceof Error && error.message.includes('数据')) {
        throw error // 重新抛出已处理的错误
      }
      throw new Error(handleSupabaseError(error))
    }
  }

  /**
   * 获取排期趋势数据
   */
  static async getBulletinTrends(
    categoryCode: string,
    regionCode: string,
    tableType: 'A' | 'B',
    months: number = 12
  ) {
    try {
      const { data, error } = await supabase
        .rpc('get_bulletin_trends', {
          p_category_code: categoryCode,
          p_region_code: regionCode,
          p_table_type: tableType,
          p_months: months
        })

      if (error) {
        console.error('获取趋势数据错误:', error)
        throw new Error(handleSupabaseError(error))
      }
      
      return data || []
    } catch (error) {
      if (error instanceof Error && error.message.includes('数据')) {
        throw error
      }
      throw new Error(handleSupabaseError(error))
    }
  }

  /**
   * 获取所有签证类别
   */
  static async getVisaCategories() {
    const { data, error } = await supabase
      .from('visa_categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order')

    if (error) throw error
    return data || []
  }

  /**
   * 获取地区列表
   */
  static async getRegions() {
    const { data, error } = await supabase
      .from('regions')
      .select('*')
      .order('display_order')

    if (error) throw error
    return data || []
  }
}

export class FaqService {
  /**
   * 获取FAQ分类
   */
  static async getCategories() {
    const { data, error } = await supabase
      .from('faq_categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order')

    if (error) throw error
    return data || []
  }

  /**
   * 根据分类获取FAQ
   */
  static async getFaqsByCategory(categoryId?: string) {
    let query = supabase
      .from('faqs')
      .select(`
        *,
        category:faq_categories(name, slug)
      `)
      .eq('is_published', true)
      .order('display_order')

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  }

  /**
   * 搜索FAQ
   */
  static async searchFaqs(query: string, categoryId?: string, limit: number = 20) {
    const { data, error } = await supabase
      .rpc('search_faqs', {
        p_query: query,
        p_category_id: categoryId || null,
        p_limit: limit
      })

    if (error) throw error
    return data || []
  }

  /**
   * 增加FAQ查看次数
   */
  static async incrementViewCount(faqId: string) {
    // TODO: 实现自增SQL逻辑
    console.log('Increment view count for FAQ:', faqId)
  }

  /**
   * 增加有用投票
   */
  static async incrementHelpfulCount(faqId: string) {
    // TODO: 实现自增SQL逻辑
    console.log('Increment helpful count for FAQ:', faqId)
  }
}

export class ConfigService {
  /**
   * 获取公开配置
   */
  static async getPublicConfigs() {
    const { data, error } = await supabase
      .from('system_configs')
      .select('key, value, value_type, category')
      .eq('is_public', true)

    if (error) throw error
    return data || []
  }

  /**
   * 按分类获取配置
   */
  static async getConfigsByCategory(category: string) {
    const { data, error } = await supabase
      .from('system_configs')
      .select('*')
      .eq('category', category)
      .eq('is_public', true)

    if (error) throw error
    return data || []
  }

  /**
   * 获取单个配置值
   */
  static async getConfigValue(key: string): Promise<any> {
    const { data, error } = await supabase
      .from('system_configs')
      .select('value, value_type')
      .eq('key', key)
      .eq('is_public', true)
      .maybeSingle()

    if (error || !data) return null

    // 根据类型转换值
    switch (data.value_type) {
      case 'boolean':
        return data.value.toLowerCase() === 'true'
      case 'number':
        return parseFloat(data.value)
      case 'json':
        return JSON.parse(data.value)
      default:
        return data.value
    }
  }
}

export class AnalyticsService {
  /**
   * 记录用户行为
   */
  static async trackEvent(event: {
    session_id: string
    page_path: string
    event_type: string
    event_data?: any
    user_agent?: string
  }) {
    const { error } = await supabase
      .from('user_analytics')
      .insert(event)

    if (error) console.error('Analytics tracking failed:', error)
  }

  /**
   * 记录页面访问
   */
  static async trackPageView(sessionId: string, pagePath: string, userAgent?: string) {
    await this.trackEvent({
      session_id: sessionId,
      page_path: pagePath,
      event_type: 'page_view',
      user_agent: userAgent
    })
  }

  /**
   * 记录搜索行为
   */
  static async trackSearch(sessionId: string, query: string, results: number) {
    await this.trackEvent({
      session_id: sessionId,
      page_path: '/search',
      event_type: 'search',
      event_data: { query, results_count: results }
    })
  }
}

/**
 * 生成会话ID
 */
export function generateSessionId(): string {
  return 'sess_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}
