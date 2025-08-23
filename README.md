# 🇺🇸 美国移民排期查询工具

> **US Visa Bulletin Tracker** - 专业的美国移民排期实时查询工具

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel&logoColor=white)](https://vercel.com)
[![React](https://img.shields.io/badge/Built%20with-React-61dafb?logo=react&logoColor=white)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/Built%20with-TypeScript-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3ecf8e?logo=supabase&logoColor=white)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-38b2ac?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

## 🌟 功能特性

### ✅ 核心功能
- **实时数据**: 最新的美国移民排期信息
- **多类别支持**: 职业移民、亲属移民等各类别
- **国别筛选**: 支持中国大陆、印度等主要国家
- **趋势分析**: 排期变化趋势图表
- **FAQ解答**: 常见移民问题详细解答

### 📱 用户体验
- **响应式设计**: 完美适配桌面端和移动端
- **高性能**: 基于React + Vite构建，极速加载
- **SEO优化**: 针对搜索引擎优化的静态内容
- **人性化交互**: 直观清晰的界面设计

### 🚀 技术亮点
- **现代技术栈**: React 18 + TypeScript + Vite
- **实时数据库**: Supabase 云数据库
- **UI框架**: Tailwind CSS + shadcn/ui 组件
- **部署优化**: Vercel 全球 CDN 加速

## 📸 预览截图

### 桌面端
![Desktop Preview](docs/desktop-preview.png)

### 移动端
![Mobile Preview](docs/mobile-preview.png)

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm/pnpm/yarn
- Git

### 本地开发

```bash
# 克隆项目
git clone https://github.com/YOUR_USERNAME/us-visa-bulletin-tracker.git
cd us-visa-bulletin-tracker

# 安装依赖
npm install
# 或
pnpm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 文件填入实际值

# 启动开发服务器
npm run dev
# 或
pnpm dev
```

访问 [http://localhost:5173](http://localhost:5173) 查看应用。

### 环境变量配置

在 `.env.local` 文件中配置以下变量：

```env
# Supabase 配置
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🛠️ 项目结构

```
us-visa-bulletin-tracker/
├── public/                 # 静态资源
│   └── images/             # 图片资源
├── src/
│   ├── components/         # React 组件
│   │   ├── BulletinTable.tsx  # 排期表格
│   │   ├── Header.tsx         # 头部导航
│   │   └── Footer.tsx         # 底部信息
│   ├── pages/              # 页面组件
│   │   ├── HomePage.tsx       # 主页
│   │   ├── TrendsPage.tsx     # 趋势页
│   │   └── FaqPage.tsx        # FAQ页
│   ├── lib/                # 工具库
│   │   ├── supabase.ts        # Supabase 配置
│   │   └── utils.ts           # 工具函数
│   ├── hooks/              # React Hooks
│   └── types/              # TypeScript 类型
├── vercel.json             # Vercel 配置
├── tailwind.config.js      # Tailwind CSS 配置
└── vite.config.ts          # Vite 配置
```

## 📊 数据来源

- **官方数据**: 数据来源于美国国务院签证公告
- **实时更新**: 每月定期更新最新排期信息
- **历史数据**: 保存多年历史排期变化数据
- **趋势分析**: 基于历史数据的趋势分析

## 📝 部署指南

### Vercel 部署（推荐）

1. **Fork 或克隆此仓库**
2. **在 [Vercel](https://vercel.com) 中导入项目**
3. **配置环境变量**
4. **点击部署**

### 其他部署平台

- **Netlify**: 支持
- **GitHub Pages**: 支持（需额外配置）
- **自建服务器**: 支持静态托管

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出改进建议！

### 贡献步骤

1. **Fork 项目**
2. **创建功能分支** (`git checkout -b feature/AmazingFeature`)
3. **提交修改** (`git commit -m 'Add some AmazingFeature'`)
4. **推送分支** (`git push origin feature/AmazingFeature`)
5. **创建 Pull Request**

### 开发规范

- 使用 TypeScript 编写代码
- 遵循 ESLint 和 Prettier 配置
- 编写清晰的 commit 信息
- 添加必要的测试用例

## 📜 技术文档

- [API 文档](docs/api.md)
- [组件文档](docs/components.md)
- [部署指南](docs/deployment.md)
- [故障排除](docs/troubleshooting.md)

## 📈 路线图

- [x] 基础排期查询功能
- [x] 响应式设计
- [x] 趋势分析图表
- [x] FAQ 常见问题解答
- [x] SEO 优化
- [ ] 用户订阅提醒功能
- [ ] 多语言支持 (中文/英文)
- [ ] PWA 支持
- [ ] 排期预测算法

## 📞 技术支持

如果您遇到问题或有任何建议：

1. **查阅 [FAQ](docs/faq.md)**
2. **搜索 [Issues](https://github.com/YOUR_USERNAME/us-visa-bulletin-tracker/issues)**
3. **创建新的 Issue**

## 📜 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🚀 特别鸣谢

感谢以下开源项目：

- [React](https://reactjs.org) - UI 框架
- [TypeScript](https://www.typescriptlang.org) - 类型安全
- [Vite](https://vitejs.dev) - 构建工具
- [Tailwind CSS](https://tailwindcss.com) - CSS 框架
- [Supabase](https://supabase.com) - 后端服务
- [shadcn/ui](https://ui.shadcn.com) - UI 组件
- [Vercel](https://vercel.com) - 部署平台

---

<div align="center">
  <sub>由 <a href="https://github.com/YOUR_USERNAME">@YOUR_USERNAME</a> 精心打造 ❤️</sub><br>
  <sub>为美国移民群体提供更好的数据服务</sub>
</div>