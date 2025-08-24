import { useEffect } from 'react'
import { AnalyticsService, generateSessionId } from '@/lib/supabase'

/**
 * 页面访问追踪Hook
 */
export function usePageTracking(pagePath: string) {
  useEffect(() => {
    const trackPageView = async () => {
      const sessionId = generateSessionId()
      const userAgent = navigator.userAgent
      
      await AnalyticsService.trackPageView(sessionId, pagePath, userAgent)
    }

    trackPageView()
  }, [pagePath])
}

/**
 * 事件追踪Hook
 */
export function useEventTracking() {
  const trackEvent = async (eventType: string, eventData?: any) => {
    const sessionId = generateSessionId()
    
    await AnalyticsService.trackEvent({
      session_id: sessionId,
      page_path: window.location.pathname,
      event_type: eventType,
      event_data: eventData,
      user_agent: navigator.userAgent
    })
  }

  return { trackEvent }
}
