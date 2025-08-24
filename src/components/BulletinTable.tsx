import React from 'react'
import { BulletinDisplayData } from '@/types'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

 interface BulletinTableProps {
  data: BulletinDisplayData[]
  region: 'cn' | 'rw'
  loading?: boolean
  error?: string
}

export function BulletinTable({ data, region, loading, error }: BulletinTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="grid grid-cols-4 gap-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="text-red-800 font-medium mb-2">数据加载失败</div>
        <div className="text-red-600 text-sm">{error}</div>
      </div>
    )
  }

  const regionTitle = region === 'cn' ? '中国大陆' : '全球/港澳台'
  const employmentData = data.filter(item => item.categoryType === 'employment')
  const familyData = data.filter(item => item.categoryType === 'family')

  const renderChangeIndicator = (changeText: string, changeClass: string) => {
    if (changeText.includes('前进')) {
      return (
        <div className={`flex items-center space-x-1 ${changeClass}`}>
          <TrendingUp className="w-3 h-3" />
          <span className="text-xs">{changeText}</span>
        </div>
      )
    } else if (changeText.includes('后退')) {
      return (
        <div className={`flex items-center space-x-1 ${changeClass}`}>
          <TrendingDown className="w-3 h-3" />
          <span className="text-xs">{changeText}</span>
        </div>
      )
    } else {
      return (
        <div className={`flex items-center space-x-1 ${changeClass}`}>
          <Minus className="w-3 h-3" />
          <span className="text-xs">{changeText}</span>
        </div>
      )
    }
  }

  const renderTable = (tableData: BulletinDisplayData[], title: string) => {
    if (tableData.length === 0) return null

    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  类别
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  表A - 审批日期
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  变化
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  表B - 递件日期
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  变化
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tableData.map((item, index) => (
                <tr key={item.categoryCode} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.categoryCode}</div>
                    <div className="text-xs text-gray-500">{item.categoryName}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.tableA.displayText}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {renderChangeIndicator(item.tableA.changeText, item.tableA.changeClass)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.tableB.displayText}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {renderChangeIndicator(item.tableB.changeText, item.tableB.changeClass)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {regionTitle}排期数据
        </h2>
        <div className="text-sm text-gray-500">
          数据来源：美国国务院签证公告
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-2">暂无排期数据</div>
          <div className="text-sm text-gray-400">请稍后再试或查看其他地区数据</div>
        </div>
      ) : (
        <>
          {renderTable(employmentData, '职业移民 (EB类)')}
          {renderTable(familyData, '亲属移民 (F类)')}
        </>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="text-sm text-blue-800">
          <div className="font-medium mb-2">说明：</div>
          <ul className="space-y-1 text-xs">
            <li>• 表A（审批日期）：显示移民局当前正在审批哪个日期之前递交的申请</li>
            <li>• 表B（递件日期）：显示可以递交I-485调整身份申请的最早优先日期</li>
            <li>• “有名额”：表示没有排期限制，可以立即申请</li>
            <li>• “无名额”：表示暂时没有名额可用</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
