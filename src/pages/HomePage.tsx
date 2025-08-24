import React, { useState } from 'react'
import { useLatestBulletins } from '@/hooks/useBulletins'
import { usePageTracking } from '@/hooks/useAnalytics'
import { BulletinTable } from '@/components/BulletinTable'
import { GoogleAdsense } from '@/components/GoogleAdsense'
import { LoadingCard } from '@/components/Loading'
import { ErrorDisplay } from '@/components/ErrorDisplay'
import { Calendar, TrendingUp, Users, Building } from 'lucide-react'

export function HomePage() {
  const { displayData, loading, error, retry } = useLatestBulletins()
  const [selectedRegion, setSelectedRegion] = useState<'cn' | 'rw'>('cn')
  
  usePageTracking('/')

  // 过滤地区数据
  const filteredData = displayData.filter(item => item.regionCode === selectedRegion)

  const heroStats = [
    {
      label: '职业移民类别',
      value: '8个',
      icon: Building,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: '亲属移民类别',
      value: '5个',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: '每月更新',
      value: '15日',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      label: '实时追踪',
      value: '24/7',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="/images/us_immigration_green_card_schedule_banner_november_2024.jpg"
            alt="US Immigration Green Card Schedule Banner"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              美国移民排期查询
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              提供最新、最准确的美国移民排期信息，帮助您了解EB和F类签证排期进展
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="text-sm text-blue-200">数据来源</div>
                <div className="font-semibold">美国国务院官方</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="text-sm text-blue-200">更新频率</div>
                <div className="font-semibold">每月同步</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="text-sm text-blue-200">支持语言</div>
                <div className="font-semibold">中文界面</div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {heroStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 ${stat.bgColor} rounded-full mb-3`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-blue-200">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Region Selector */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">选择地区</h2>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setSelectedRegion('cn')}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    selectedRegion === 'cn'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  中国大陆
                </button>
                <button
                  onClick={() => setSelectedRegion('rw')}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    selectedRegion === 'rw'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  全球/港澳台
                </button>
              </div>
            </div>

            {/* Bulletin Table */}
            {loading && <LoadingCard title="排期数据" rows={10} />}
            {error && (
              <ErrorDisplay
                error={error}
                onRetry={retry}
                className="mb-6"
              />
            )}
            {!loading && !error && (
              <BulletinTable
                data={filteredData}
                region={selectedRegion}
                loading={loading}
                error={error}
              />
            )}

            {/* 什么是移民排期说明 */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                什么是移民排期？
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  移民排期（Visa Bulletin）是美国国务院每月发布的官方文件，用于公布各类移民签证的优先日期（Priority Date）进度。排期决定了移民申请人何时可以递交I-485调整身份申请或在领事馆进行移民签证面试。
                </p>
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <h4 className="text-lg font-semibold text-blue-900 mb-3">移民排期分为两个表格：</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <strong className="text-blue-900">表A（最终裁定日期）：</strong>
                        <span className="text-blue-800">决定何时可以获得绿卡</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <strong className="text-blue-900">表B（递交申请日期）：</strong>
                        <span className="text-blue-800">决定何时可以递交I-485申请</span>
                      </div>
                    </li>
                  </ul>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  排期影响所有基于就业的移民（EB-1至EB-5）和基于家庭的移民（F1至F4）申请人，特别是来自中国大陆和印度的申请人通常面临更长的等待时间。
                </p>
              </div>
            </div>

            {/* 常见问题及解答 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-1 h-6 bg-green-600 rounded-full mr-3"></div>
                常见问题及解答
              </h2>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">排期倒退是什么意思？</h4>
                  <p className="text-gray-700 leading-relaxed">
                    排期倒退是指当月的优先日期比上个月更早，这意味着移民局收到的申请数量超过了可用的签证配额，导致处理进度放缓。这种情况在EB-2和EB-3类别中比较常见。
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">表A和表B有什么区别？</h4>
                  <p className="text-gray-700 leading-relaxed">
                    表A（最终裁定日期）显示的是可以获得绿卡的日期，而表B（递交申请日期）显示的是可以递交I-485调整身份申请的日期。通常表B的日期会比表A更加宽松，允许申请人提前递交申请。
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">为什么中国大陆申请人的排期特别长？</h4>
                  <p className="text-gray-700 leading-relaxed">
                    由于美国移民法规定每个国家每年获得绿卡的人数不能超过总配额的7%，而中国大陆申请人数量庞大，因此面临更长的等待时间。这就是所谓的"按国别限额"制度。
                  </p>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">如何查看自己的排期进度？</h4>
                  <p className="text-gray-700 leading-relaxed">
                    您需要知道自己的优先日期（Priority Date），这个日期通常在I-797批准通知书上。然后将您的优先日期与当月签证公告中相应类别的日期进行比较。如果您的优先日期早于或等于公告中的日期，就可以进行下一步申请。
                  </p>
                </div>

                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">排期预测准确吗？</h4>
                  <p className="text-gray-700 leading-relaxed">
                    排期预测基于历史数据和当前趋势，但移民局的实际决定会受到多种因素影响，包括申请数量、政策变化、处理能力等。预测仅供参考，实际排期以国务院每月发布的官方签证公告为准。
                  </p>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">EB-1还有排期吗？</h4>
                  <p className="text-gray-700 leading-relaxed">
                    EB-1（杰出人才）类别通常没有排期或排期较短，但近年来由于申请人数增加，中国大陆申请人偶尔也会遇到排期。具体情况需要查看每月的最新签证公告。
                  </p>
                </div>

                <div className="border-l-4 border-teal-500 pl-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">排期到了就能马上拿到绿卡吗？</h4>
                  <p className="text-gray-700 leading-relaxed">
                    不是的。排期到了只是意味着您可以递交I-485申请或进行领事馆面试。从递交申请到最终获得绿卡，还需要经过背景调查、体检、面试等程序，通常还需要几个月到一年的时间。
                  </p>
                </div>
              </div>
            </div>

            {/* AdSense - Main Content */}
            <div className="flex justify-center">
              <GoogleAdsense adSlot="" className="w-full max-w-4xl" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">快速统计</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-blue-800">数据更新</span>
                  <span className="text-sm font-medium text-blue-900">今日</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-green-800">可查询类别</span>
                  <span className="text-sm font-medium text-green-900">13个</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm text-purple-800">支持地区</span>
                  <span className="text-sm font-medium text-purple-900">2个</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">官方资源</h3>
              <div className="space-y-3">
                <a
                  href="https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="text-sm font-medium text-gray-900">美国国务院</div>
                  <div className="text-xs text-gray-600">签证公告官方页面</div>
                </a>
                <a
                  href="https://www.uscis.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="text-sm font-medium text-gray-900">USCIS</div>
                  <div className="text-xs text-gray-600">美国移民局官网</div>
                </a>
                <a
                  href="https://nvc.state.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="text-sm font-medium text-gray-900">NVC</div>
                  <div className="text-xs text-gray-600">国家签证中心</div>
                </a>
              </div>
            </div>

            {/* AdSense - Sidebar */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-xs text-gray-500 text-center mb-2">广告</div>
              <GoogleAdsense adSlot="" className="" />
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">排期更新提醒</h3>
              <p className="text-sm text-blue-700 mb-4">
                订阅我们的更新通知，第一时间了解排期变化
              </p>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                即将推出
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
