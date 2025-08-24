import { useState, useEffect } from 'react'
import { FaqService, AnalyticsService, generateSessionId } from '@/lib/supabase'
import { Faq, FaqCategory, FaqSearchResult } from '@/types'

/**
 * FAQ分类Hook
 */
export function useFaqCategories() {
  const [categories, setCategories] = useState<FaqCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const data = await FaqService.getCategories()
        setCategories(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取FAQ分类失败')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}

/**
 * FAQ列表Hook
 */
export function useFaqs(categoryId?: string) {
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true)
        const data = await FaqService.getFaqsByCategory(categoryId)
        setFaqs(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取FAQ失败')
      } finally {
        setLoading(false)
      }
    }

    fetchFaqs()
  }, [categoryId])

  // 增加查看次数
  const incrementViewCount = async (faqId: string) => {
    await FaqService.incrementViewCount(faqId)
    // 记录分析事件
    const sessionId = generateSessionId()
    await AnalyticsService.trackEvent({
      session_id: sessionId,
      page_path: '/faq',
      event_type: 'faq_view',
      event_data: { faq_id: faqId }
    })
  }

  // 增加有用投票
  const incrementHelpfulCount = async (faqId: string) => {
    await FaqService.incrementHelpfulCount(faqId)
    // 记录分析事件
    const sessionId = generateSessionId()
    await AnalyticsService.trackEvent({
      session_id: sessionId,
      page_path: '/faq',
      event_type: 'click',
      event_data: { action: 'helpful_vote', faq_id: faqId }
    })
  }

  return { faqs, loading, error, incrementViewCount, incrementHelpfulCount }
}

/**
 * FAQ搜索Hook
 */
export function useFaqSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<FaqSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = async (searchQuery: string, categoryId?: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    try {
      setLoading(true)
      const data = await FaqService.searchFaqs(searchQuery, categoryId)
      setResults(data)
      
      // 记录搜索行为
      const sessionId = generateSessionId()
      await AnalyticsService.trackSearch(sessionId, searchQuery, data.length)
      
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : '搜索失败')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  // 防抖搜索
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query) {
        search(query)
      } else {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    search: (q: string, categoryId?: string) => {
      setQuery(q)
      search(q, categoryId)
    }
  }
}
