import React from 'react'
import { AlertTriangle, RefreshCw, Wifi, Database, Clock, Shield } from 'lucide-react'

interface ErrorDisplayProps {
  error: string
  onRetry?: () => void
  showRetry?: boolean
  className?: string
}

export function ErrorDisplay({ 
  error, 
  onRetry, 
  showRetry = true,
  className = ''
}: ErrorDisplayProps) {
  // 根据错误类型选择合适的图标和颜色
  const getErrorIcon = () => {
    if (error.includes('网络')) return Wifi
    if (error.includes('数据库') || error.includes('查询')) return Database
    if (error.includes('超时')) return Clock
    if (error.includes('权限') || error.includes('访问')) return Shield
    return AlertTriangle
  }

  const getErrorColor = () => {
    if (error.includes('网络')) return 'text-orange-600'
    if (error.includes('数据库') || error.includes('查询')) return 'text-red-600'
    if (error.includes('超时')) return 'text-yellow-600'
    if (error.includes('权限') || error.includes('访问')) return 'text-purple-600'
    return 'text-red-600'
  }

  const getBorderColor = () => {
    if (error.includes('网络')) return 'border-orange-200'
    if (error.includes('数据库') || error.includes('查询')) return 'border-red-200'
    if (error.includes('超时')) return 'border-yellow-200'
    if (error.includes('权限') || error.includes('访问')) return 'border-purple-200'
    return 'border-red-200'
  }

  const getBgColor = () => {
    if (error.includes('网络')) return 'bg-orange-50'
    if (error.includes('数据库') || error.includes('查询')) return 'bg-red-50'
    if (error.includes('超时')) return 'bg-yellow-50'
    if (error.includes('权限') || error.includes('访问')) return 'bg-purple-50'
    return 'bg-red-50'
  }

  const Icon = getErrorIcon()
  const colorClass = getErrorColor()
  const borderClass = getBorderColor()
  const bgClass = getBgColor()

  return (
    <div className={`rounded-lg border-2 ${borderClass} ${bgClass} p-6 ${className}`}>
      <div className="flex items-start space-x-4">
        <div className={`flex-shrink-0 ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className={`font-medium ${colorClass} mb-2`}>
            数据加载出现问题
          </div>
          <div className="text-gray-700 text-sm mb-4 leading-relaxed">
            {error}
          </div>
          {showRetry && onRetry && (
            <div className="flex items-center space-x-4">
              <button
                onClick={onRetry}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                重新加载
              </button>
              <div className="text-xs text-gray-500">
                或者刷新页面重试
              </div>
            </div>
          )}
          
          {/* 根据错误类型显示建议 */}
          {error.includes('网络') && (
            <div className="mt-3 text-xs text-gray-600 bg-white bg-opacity-60 rounded p-2">
              <div className="font-medium mb-1">建议:</div>
              • 检查网络连接是否正常<br/>
              • 尝试刷新页面<br/>
              • 如问题持续存在，请稍后再试
            </div>
          )}
          
          {error.includes('数据库') && (
            <div className="mt-3 text-xs text-gray-600 bg-white bg-opacity-60 rounded p-2">
              <div className="font-medium mb-1">建议:</div>
              • 系统可能正在维护中<br/>
              • 请稍后再试<br/>
              • 如问题持续，请联系技术支持
            </div>
          )}
          
          {error.includes('超时') && (
            <div className="mt-3 text-xs text-gray-600 bg-white bg-opacity-60 rounded p-2">
              <div className="font-medium mb-1">建议:</div>
              • 服务器响应较慢<br/>
              • 请稍等片刻后重试<br/>
              • 检查网络连接状况
            </div>
          )}
        </div>
      </div>
    </div>
  )
}