import { useState, useEffect } from 'react'
import { ConfigService } from '@/lib/supabase'
import { SiteConfiguration } from '@/types'

/**
 * 网站配置Hook
 */
export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfiguration | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true)
        
        const configs = await ConfigService.getPublicConfigs()
        
        // 处理配置数据
        const processedConfig: SiteConfiguration = {
          seo: {
            title: getValue(configs, 'site_title', '美国移民排期查询工具'),
            description: getValue(configs, 'site_description', '最新美国移民排期数据'),
            keywords: getValue(configs, 'site_keywords', '美国移民排期'),
            author: getValue(configs, 'site_author', 'MiniMax Agent')
          },
          ads: {
            enabled: getBooleanValue(configs, 'adsense_enabled', false),
            clientId: getValue(configs, 'adsense_client_id', ''),
            slots: {
              header: getValue(configs, 'ads_slot_header', ''),
              sidebar: getValue(configs, 'ads_slot_sidebar', '')
            }
          },
          general: {
            bulletinUpdateDay: getNumberValue(configs, 'bulletin_update_day', 15),
            maxSearchResults: getNumberValue(configs, 'max_search_results', 20),
            enableAnalytics: getBooleanValue(configs, 'enable_analytics', true)
          }
        }
        
        setConfig(processedConfig)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取配置失败')
      } finally {
        setLoading(false)
      }
    }

    fetchConfig()
  }, [])

  return { config, loading, error }
}

// 辅助函数
function getValue(configs: any[], key: string, defaultValue: string): string {
  const config = configs.find(c => c.key === key)
  return config ? config.value : defaultValue
}

function getBooleanValue(configs: any[], key: string, defaultValue: boolean): boolean {
  const config = configs.find(c => c.key === key)
  return config ? config.value.toLowerCase() === 'true' : defaultValue
}

function getNumberValue(configs: any[], key: string, defaultValue: number): number {
  const config = configs.find(c => c.key === key)
  return config ? parseFloat(config.value) : defaultValue
}
