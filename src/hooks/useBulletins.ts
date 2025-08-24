import { useState, useEffect } from 'react'
import { BulletinService } from '@/lib/supabase'
import { LatestBulletinResponse, BulletinDisplayData } from '@/types'
import { formatPriorityDate, getChangeText, getChangeClass } from '@/lib/supabase'

/**
 * 获取最新排期数据的Hook
 */
export function useLatestBulletins() {
  const [bulletins, setBulletins] = useState<LatestBulletinResponse[]>([])
  const [displayData, setDisplayData] = useState<BulletinDisplayData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await BulletinService.getLatestBulletins()
        setBulletins(data)
        
        // 处理显示数据
        const processed = processDisplayData(data)
        setDisplayData(processed)
        
        // 成功后重置重试次数
        setRetryCount(0)
      } catch (err) {
        console.error('加载排期数据失败:', err)
        
        // 显示精确的错误信息
        const errorMessage = err instanceof Error ? err.message : '获取排期数据失败'
        setError(errorMessage)
        
        // 如果是网络错误且重试次数少于3次，则自动重试
        if (errorMessage.includes('网络') && retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1)
          }, 2000 * (retryCount + 1)) // 逐渐增加延迟时间
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [retryCount])

  // 手动重试函数
  const retry = () => {
    setRetryCount(0)
  }

  return { bulletins, displayData, loading, error, retry }
}

/**
 * 处理排期数据为显示格式
 */
function processDisplayData(bulletins: LatestBulletinResponse[]): BulletinDisplayData[] {
  const categoryMap = new Map<string, BulletinDisplayData>()
  
  bulletins.forEach(bulletin => {
    const key = `${bulletin.category_code}_${bulletin.region_code}`
    
    if (!categoryMap.has(key)) {
      categoryMap.set(key, {
        categoryName: bulletin.category_name,
        categoryCode: bulletin.category_code,
        categoryType: bulletin.category_type,
        regionCode: bulletin.region_code,
        regionName: bulletin.region_name,
        tableA: {
          priorityDate: null,
          displayText: '',
          changeText: '',
          changeClass: ''
        },
        tableB: {
          priorityDate: null,
          displayText: '',
          changeText: '',
          changeClass: ''
        }
      })
    }
    
    const item = categoryMap.get(key)!
    const tableData = bulletin.table_type === 'A' ? item.tableA : item.tableB
    
    tableData.priorityDate = bulletin.priority_date || null
    tableData.displayText = formatPriorityDate(bulletin.priority_date || null)
    tableData.changeText = getChangeText(bulletin.change_days || null, bulletin.change_status)
    tableData.changeClass = getChangeClass(bulletin.change_days || null, bulletin.change_status)
  })
  
  return Array.from(categoryMap.values())
}

/**
 * 获取排期趋势数据的Hook
 */
export function useBulletinTrends(
  categoryCode: string,
  regionCode: string,
  tableType: 'A' | 'B',
  months: number = 12
) {
  const [trends, setTrends] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await BulletinService.getBulletinTrends(
          categoryCode,
          regionCode,
          tableType,
          months
        )
        setTrends(data)
        
        // 成功后重置重试次数
        setRetryCount(0)
      } catch (err) {
        console.error('加载趋势数据失败:', err)
        
        // 显示精确的错误信息
        const errorMessage = err instanceof Error ? err.message : '获取趋势数据失败'
        setError(errorMessage)
        
        // 如果是网络错误且重试次数少于3次，则自动重试
        if (errorMessage.includes('网络') && retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1)
          }, 2000 * (retryCount + 1))
        }
      } finally {
        setLoading(false)
      }
    }

    if (categoryCode && regionCode) {
      fetchTrends()
    }
  }, [categoryCode, regionCode, tableType, months, retryCount])

  // 手动重试函数
  const retry = () => {
    setRetryCount(0)
  }

  return { trends, loading, error, retry }
}
