import { Link } from 'react-router-dom'
import { ExternalLink, Mail, Clock } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const usefulLinks = [
    { name: '美国国务院签证公告', url: 'https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html' },
    { name: 'USCIS官网', url: 'https://www.uscis.gov/' },
    { name: '国家签证中心', url: 'https://nvc.state.gov/' },
  ]

  const internalLinks = [
    { name: '排期查询', href: '/' },
    { name: '趋势分析', href: '/trends' },
    { name: '常见问题', href: '/faq' },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 网站介绍 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">US</span>
              </div>
              <div className="text-xl font-bold">
                美国移民排期查询
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              提供最新、最准确的美国移民排期信息，帮助您更好地了解和跟踪移民进程。我们致力于为移民申请人提供专业、可靠的排期数据和分析服务。
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <Clock className="w-4 h-4" />
              <span>每月更新，数据来源于美国国务院官方签证公告</span>
            </div>
          </div>

          {/* 官方资源 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">官方资源</h3>
            <ul className="space-y-2">
              {usefulLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 text-sm transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 快捷导航 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">快捷导航</h3>
            <ul className="space-y-2">
              {internalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-blue-400 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-4 border-t border-gray-700">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Mail className="w-4 h-4" />
                <span>有疑问？查看常见问题</span>
              </div>
            </div>
          </div>
        </div>

        {/* 底部信息 */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <div className="text-sm text-gray-300 space-y-2">
            <p>
              © {currentYear} 美国移民排期查询工具. Developed by Huarenca.
            </p>
            <p className="text-xs text-gray-400">
              数据仅供参考，请以美国国务院官方签证公告为准。本网站不提供法律建议。
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
