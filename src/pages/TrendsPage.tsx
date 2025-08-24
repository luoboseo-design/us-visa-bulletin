import React, { useState } from 'react'
import { useBulletinTrends } from '@/hooks/useBulletins'
import { usePageTracking } from '@/hooks/useAnalytics'
import { GoogleAdsense } from '@/components/GoogleAdsense'
import { LoadingSpinner } from '@/components/Loading'
import { Alert } from '@/components/Alert'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Calendar, TrendingUp, BarChart3 } from 'lucide-react'

const VISA_CATEGORIES = [
  { code: 'EB1', name: 'EB-1 杰出人才' },
  { code: 'EB2', name: 'EB-2 高等学位专业人才' },
  { code: 'EB3', name: 'EB-3 技术和非技术工人' },
  { code: 'F1', name: 'F1 公民成年未婚子女' },
  { code: 'F2A', name: 'F2A 绿卡配偶及未成年子女' },
  { code: 'F2B', name: 'F2B 绿卡成年未婚子女' },
  { code: 'F3', name: 'F3 公民已婚子女' },
  { code: 'F4', name: 'F4 公民兄弟姐妹' }
]

const REGIONS = [
  { code: 'cn', name: '中国大陆' },
  { code: 'rw', name: '全球/港澳台' }
]

export function TrendsPage() {
  const [selectedCategory, setSelectedCategory] = useState('EB2')
  const [selectedRegion, setSelectedRegion] = useState('cn')
  const [selectedTable, setSelectedTable] = useState<'A' | 'B'>('A')
  const [selectedMonths, setSelectedMonths] = useState(12)
  
  const { trends, loading, error } = useBulletinTrends(
    selectedCategory,
    selectedRegion,
    selectedTable,
    selectedMonths
  )
  
  usePageTracking('/trends')

  // 处理图表数据
  const chartData = trends.map(trend => {
    const date = new Date(trend.bulletin_month)
    const priorityDateObj = trend.priority_date ? new Date(trend.priority_date) : null
    
    return {
      month: date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short' }),
      priorityDate: priorityDateObj ? priorityDateObj.getTime() : null,
      displayDate: trend.priority_date ? new Date(trend.priority_date).toLocaleDateString('zh-CN') : '有名额',
      changeDays: trend.change_days || 0,
      status: trend.change_status
    }
  }).reverse() // 按时间正序排列

  const formatTooltipContent = (value: any, name: string) => {
    if (name === 'priorityDate' && value) {
      return [new Date(value).toLocaleDateString('zh-CN'), '优先日期']
    }
    return [value, name]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-700 to-blue-800 text-white">
        <div className="absolute inset-0 opacity-20">
          <img
            src="/images/US-EB2-Immigration-Priority-Date-FAD-DOF-Trend-Forecast-Chart.jpg"
            alt="Trends Header"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              排期趋势分析
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              查看各类签证排期的历史趋势，帮助您更好地预测排期走向
            </p>
            
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <BarChart3 className="w-8 h-8 mx-auto mb-2" />
                <div className="text-sm">历史数据</div>
              </div>
              <div className="text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                <div className="text-sm">趋势分析</div>
              </div>
              <div className="text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2" />
                <div className="text-sm">月度更新</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">选择查询参数</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 签证类别 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    签证类别
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {VISA_CATEGORIES.map(cat => (
                      <option key={cat.code} value={cat.code}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 地区 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    地区
                  </label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {REGIONS.map(region => (
                      <option key={region.code} value={region.code}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 表类型 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    表类型
                  </label>
                  <select
                    value={selectedTable}
                    onChange={(e) => setSelectedTable(e.target.value as 'A' | 'B')}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="A">表A - 审批日期</option>
                    <option value="B">表B - 递件日期</option>
                  </select>
                </div>

                {/* 时间范围 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    时间范围
                  </label>
                  <select
                    value={selectedMonths}
                    onChange={(e) => setSelectedMonths(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={6}>6个月</option>
                    <option value={12}>12个月</option>
                    <option value={24}>24个月</option>
                    <option value={36}>36个月</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {VISA_CATEGORIES.find(cat => cat.code === selectedCategory)?.name} - 
                  {REGIONS.find(region => region.code === selectedRegion)?.name} - 
                  表{selectedTable}
                </h2>
                <div className="text-sm text-gray-500">
                  近{selectedMonths}个月趋势
                </div>
              </div>

              {loading && (
                <div className="flex justify-center items-center h-96">
                  <LoadingSpinner size="lg" text="加载趋势数据中..." />
                </div>
              )}

              {error && (
                <Alert
                  type="error"
                  title="数据加载失败"
                  message={error}
                />
              )}

              {!loading && !error && chartData.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <div>暂无趋势数据</div>
                  <div className="text-sm mt-2">请尝试选择其他参数</div>
                </div>
              )}

              {!loading && !error && chartData.length > 0 && (
                <div style={{ width: '100%', height: 400 }}>
                  <ResponsiveContainer>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis 
                        domain={['dataMin - 86400000', 'dataMax + 86400000']}
                        type="number"
                        scale="time"
                        tickFormatter={(value) => new Date(value).toLocaleDateString('zh-CN', { month: 'short', year: '2-digit' })}
                        tick={{ fontSize: 12 }}
                        width={80}
                      />
                      <Tooltip 
                        formatter={formatTooltipContent}
                        labelStyle={{ color: '#333' }}
                        contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #d1d5db' }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="priorityDate" 
                        stroke="#2563eb" 
                        strokeWidth={2}
                        dot={{ fill: '#2563eb', r: 4 }}
                        connectNulls={false}
                        name="优先日期"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Data Table */}
            {!loading && !error && chartData.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">详细数据</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          月份
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          优先日期
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          变化天数
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          状态
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {chartData.reverse().map((data, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {data.month}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {data.displayDate}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            <span className={`${
                              data.changeDays > 0 ? 'text-green-600' :
                              data.changeDays < 0 ? 'text-red-600' :
                              'text-gray-600'
                            }`}>
                              {data.changeDays > 0 ? `+${data.changeDays}` : data.changeDays || 0} 天
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              data.status === 'advanced' ? 'bg-green-100 text-green-800' :
                              data.status === 'retrogressed' ? 'bg-red-100 text-red-800' :
                              data.status === 'current' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {data.status === 'advanced' ? '前进' :
                               data.status === 'retrogressed' ? '后退' :
                               data.status === 'current' ? '有名额' : '无变化'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* AdSense - Main Content */}
            <div className="flex justify-center">
              <GoogleAdsense adSlot="" className="w-full max-w-4xl" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Analysis */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">快速分析</h3>
              <div className="space-y-4">
                {!loading && !error && chartData.length > 1 && (
                  <>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-800 font-medium">最新排期</div>
                      <div className="text-lg text-blue-900 font-bold">
                        {chartData[chartData.length - 1]?.displayDate || '数据缺失'}
                      </div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-sm text-green-800 font-medium">上月变化</div>
                      <div className="text-lg text-green-900 font-bold">
                        {(() => {
                          const lastChange = chartData[chartData.length - 1]?.changeDays || 0
                          return lastChange > 0 ? `+${lastChange}天` : `${lastChange}天`
                        })()} 
                      </div>
                    </div>
                  </>
                )}
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-sm text-purple-800 font-medium">数据点数</div>
                  <div className="text-lg text-purple-900 font-bold">{chartData.length}个月</div>
                </div>
              </div>
            </div>

            {/* Understanding Trends */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">趋势读解</h3>
              <div className="space-y-3 text-sm text-blue-800">
                <div>• <strong>上升趋势</strong>：排期前进，等待时间缩短</div>
                <div>• <strong>下降趋势</strong>：排期后退，等待时间延长</div>
                <div>• <strong>平稳趋势</strong>：排期基本不变</div>
                <div>• <strong>波动趋势</strong>：排期反复前后摇摆</div>
              </div>
            </div>

            {/* Popular Comparisons */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">热门对比</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => { setSelectedCategory('EB2'); setSelectedRegion('cn'); }}
                  className="block w-full text-left p-2 rounded hover:bg-gray-50 transition-colors"
                >
                  <div className="text-sm font-medium">EB-2 中国大陆</div>
                </button>
                <button 
                  onClick={() => { setSelectedCategory('EB3'); setSelectedRegion('cn'); }}
                  className="block w-full text-left p-2 rounded hover:bg-gray-50 transition-colors"
                >
                  <div className="text-sm font-medium">EB-3 中国大陆</div>
                </button>
                <button 
                  onClick={() => { setSelectedCategory('F1'); setSelectedRegion('cn'); }}
                  className="block w-full text-left p-2 rounded hover:bg-gray-50 transition-colors"
                >
                  <div className="text-sm font-medium">F1 中国大陆</div>
                </button>
              </div>
            </div>

            {/* AdSense - Sidebar */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-xs text-gray-500 text-center mb-2">广告</div>
              <GoogleAdsense adSlot="" className="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
