import React, { useState } from 'react'
import { useFaqs, useFaqCategories, useFaqSearch } from '@/hooks/useFaq'
import { usePageTracking } from '@/hooks/useAnalytics'
import { GoogleAdsense } from '@/components/GoogleAdsense'
import { LoadingSpinner, LoadingCard } from '@/components/Loading'
import { Alert } from '@/components/Alert'
import { Search, ChevronDown, ChevronUp, ThumbsUp, Eye, BookOpen } from 'lucide-react'

export function FaqPage() {
  const { categories, loading: categoriesLoading } = useFaqCategories()
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>()
  const { faqs, loading: faqsLoading, incrementViewCount, incrementHelpfulCount } = useFaqs(selectedCategoryId)
  const { query, setQuery, results, loading: searchLoading } = useFaqSearch()
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [votedItems, setVotedItems] = useState<Set<string>>(new Set())
  
  usePageTracking('/faq')

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
      // 增加查看次数
      incrementViewCount(id)
    }
    setExpandedItems(newExpanded)
  }

  const handleHelpfulVote = (id: string) => {
    if (votedItems.has(id)) return
    
    setVotedItems(new Set(votedItems).add(id))
    incrementHelpfulCount(id)
  }

  const displayFaqs = query.trim() ? results : faqs
  const isSearching = query.trim().length > 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-700 to-blue-800 text-white">
        <div className="absolute inset-0 opacity-20">
          <img
            src="/images/us-flag-immigration-document-uscis.jpg"
            alt="FAQ Header"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              常见问题
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              解答您关于美国移民排期的疑问，提供专业的指导和建议
            </p>
            
            {/* Search Box */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="搜索问题...例如：EB-1排期、表A表B区别"
                  className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {searchLoading && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <LoadingSpinner size="sm" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Category Filter */}
            {!isSearching && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">选择分类</h2>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedCategoryId(undefined)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      !selectedCategoryId
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    全部
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategoryId(category.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedCategoryId === category.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results Info */}
            {isSearching && (
              <div className="mb-6">
                <div className="text-sm text-gray-600">
                  搜索 "{query}" 的结果：共找到 {results.length} 个问题
                </div>
              </div>
            )}

            {/* FAQ List */}
            {(faqsLoading || searchLoading) && <LoadingCard rows={8} />}
            
            {!faqsLoading && !searchLoading && displayFaqs.length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="text-lg text-gray-600 mb-2">
                  {isSearching ? '没有找到相关问题' : '暂无FAQ内容'}
                </div>
                <div className="text-sm text-gray-500">
                  {isSearching ? '请尝试使用其他关键词搜索' : '内容正在完善中，请稍后再来'}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {displayFaqs.map((faq) => {
                const isExpanded = expandedItems.has(faq.id)
                const hasVoted = votedItems.has(faq.id)
                
                return (
                  <div key={faq.id} className="bg-white rounded-lg shadow-md">
                    <button
                      onClick={() => toggleExpanded(faq.id)}
                      className="w-full text-left p-6 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {faq.question}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            {faq.category && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {faq.category.name}
                              </span>
                            )}
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>{faq.view_count}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <ThumbsUp className="w-4 h-4" />
                              <span>{faq.helpful_count}</span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </button>
                    
                    {isExpanded && (
                      <div className="px-6 pb-6">
                        <div className="border-t pt-4">
                          <div className="prose max-w-none text-gray-700 mb-4">
                            {faq.answer.split('\n').map((paragraph, index) => (
                              <p key={index} className="mb-2">
                                {paragraph}
                              </p>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="text-sm text-gray-500">
                              这个回答对您有帮助吗？
                            </div>
                            <button
                              onClick={() => handleHelpfulVote(faq.id)}
                              disabled={hasVoted}
                              className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-colors ${
                                hasVoted
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              <ThumbsUp className="w-4 h-4" />
                              <span>{hasVoted ? '已投票' : '有用'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* AdSense - Main Content */}
            <div className="mt-8 flex justify-center">
              <GoogleAdsense adSlot="" className="w-full max-w-4xl" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Popular Categories */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">热门分类</h3>
              <div className="space-y-2">
                {categories.slice(0, 5).map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategoryId(category.id)}
                    className="block w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-sm font-medium text-gray-900">
                      {category.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {category.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">搜索小贴士</h3>
              <div className="space-y-3 text-sm text-blue-800">
                <div>• 使用具体的签证类型，如“EB-1”、“F2A”</div>
                <div>• 搜索关键词：“排期”、“优先日期”</div>
                <div>• 使用简单词汇获得更好的结果</div>
              </div>
            </div>

            {/* AdSense - Sidebar */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-xs text-gray-500 text-center mb-2">广告</div>
              <GoogleAdsense adSlot="" className="" />
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">找不到答案？</h3>
              <div className="text-sm text-gray-600 mb-4">
                如果您没有在FAQ中找到所需信息，建议您：
              </div>
              <div className="space-y-2 text-sm">
                <div>• 查阅美国国务院官方签证公告</div>
                <div>• 咨询专业的移民律师</div>
                <div>• 联系当地的移民服务机构</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
