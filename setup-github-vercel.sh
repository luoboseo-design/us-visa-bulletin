#!/bin/bash

# GitHub + Vercel 自动部署脚本 - 方法二
# 使用方法：chmod +x setup-github-vercel.sh && ./setup-github-vercel.sh

echo "📁 美国移民排期查询工具 - GitHub + Vercel 自动部署"
echo "======================================================"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ 错误：请在项目根目录中执行此脚本${NC}"
    echo -e "${BLUE}📁 应该包含：package.json, src/, public/ 等文件${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 项目目录验证通过${NC}"

echo -e "\n${BLUE}1️⃣ 检查环境...${NC}"

# 检查Git
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git 未安装${NC}"
    echo -e "${YELLOW}📝 请先安装 Git: https://git-scm.com/downloads${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Git 版本: $(git --version)${NC}"

# 检查是否已经初始化Git仓库
if [ ! -d ".git" ]; then
    echo -e "\n${BLUE}2️⃣ 初始化Git仓库...${NC}"
    git init
    
    # 检查Git用户配置
    if ! git config user.name &> /dev/null; then
        echo -e "\n${YELLOW}⚠️  需要配置Git用户信息${NC}"
        read -p "请输入您的GitHub用户名: " git_username
        read -p "请输入您的邮箱地址: " git_email
        
        git config --global user.name "$git_username"
        git config --global user.email "$git_email"
        echo -e "${GREEN}✅ Git用户配置完成${NC}"
    else
        echo -e "${GREEN}✅ Git用户配置存在: $(git config user.name) <$(git config user.email)>${NC}"
    fi
else
    echo -e "${GREEN}✅ Git仓库已存在${NC}"
fi

echo -e "\n${BLUE}3️⃣ 准备提交文件...${NC}"

# 添加所有文件
git add .

# 检查是否有文件需要提交
if git diff --staged --quiet; then
    echo -e "${YELLOW}⚠️  没有文件需要提交${NC}"
else
    # 提交文件
    git commit -m "Initial commit: US Visa Bulletin Tracker - Ready for Vercel deployment"
    echo -e "${GREEN}✅ 文件提交完成${NC}"
fi

echo -e "\n${BLUE}4️⃣ GitHub仓库设置${NC}"

# 检查是否已经有远程仓库
if git remote get-url origin &> /dev/null; then
    echo -e "${GREEN}✅ 远程仓库已配置: $(git remote get-url origin)${NC}"
    
    read -p "是否要推送到现有仓库？(y/N): " push_existing
    if [[ $push_existing =~ ^[Yy]$ ]]; then
        echo -e "\n${BLUE}📤 推送到GitHub...${NC}"
        git push -u origin main 2>/dev/null || git push -u origin master
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ 代码推送成功！${NC}"
        else
            echo -e "${RED}❌ 推送失败，请检查权限或网络${NC}"
        fi
    fi
else
    echo -e "\n${YELLOW}📝 需要创建GitHub仓库并连接${NC}"
    echo -e "\n请选择创建GitHub仓库的方式："
    echo "1) 通过GitHub网页创建 (推荐)"
    echo "2) 使用GitHub CLI (如果已安装)"
    echo "3) 跳过此步，手动操作"
    
    read -p "请选择 (1-3): " github_method
    
    case $github_method in
        1)
            echo -e "\n${BLUE}🌐 通过GitHub网页创建仓库：${NC}"
            echo "1. 访问 https://github.com/new"
            echo "2. 仓库名称：us-visa-bulletin-tracker"
            echo "3. 描述：美国移民排期查询工具 - US Visa Bulletin Tracker"
            echo "4. 设置为 Public（推荐）"
            echo "5. 不要勾选 'Add a README file' 等选项"
            echo "6. 点击 'Create repository'"
            echo -e "\n${YELLOW}⏳ 创建完成后，请复制仓库URL并回车继续...${NC}"
            read -p "请输入您的GitHub用户名: " github_username
            
            repo_url="https://github.com/$github_username/us-visa-bulletin-tracker.git"
            echo -e "\n${BLUE}🔗 添加远程仓库：$repo_url${NC}"
            git remote add origin $repo_url
            
            echo -e "\n${BLUE}📤 推送到GitHub...${NC}"
            git branch -M main
            git push -u origin main
            
            if [ $? -eq 0 ]; then
                echo -e "${GREEN}✅ 代码推送成功！${NC}"
            else
                echo -e "${RED}❌ 推送失败${NC}"
                echo -e "${YELLOW}💡 可能需要配置GitHub访问令牌或SSH密钥${NC}"
            fi
            ;;
        2)
            if command -v gh &> /dev/null; then
                echo -e "\n${BLUE}🔧 使用GitHub CLI创建仓库...${NC}"
                
                # 检查GitHub CLI登录状态
                if ! gh auth status &> /dev/null; then
                    echo -e "${YELLOW}🔐 需要登录GitHub CLI...${NC}"
                    gh auth login
                fi
                
                # 创建仓库
                gh repo create us-visa-bulletin-tracker --public --description "美国移民排期查询工具 - US Visa Bulletin Tracker" --clone=false
                
                if [ $? -eq 0 ]; then
                    # 添加远程仓库
                    git remote add origin "https://github.com/$(gh api user --jq .login)/us-visa-bulletin-tracker.git"
                    
                    # 推送代码
                    git branch -M main
                    git push -u origin main
                    
                    echo -e "${GREEN}✅ GitHub仓库创建并推送成功！${NC}"
                else
                    echo -e "${RED}❌ 仓库创建失败${NC}"
                fi
            else
                echo -e "${RED}❌ GitHub CLI 未安装${NC}"
                echo -e "${BLUE}📝 请选择方法1或安装GitHub CLI: https://cli.github.com/${NC}"
            fi
            ;;
        3)
            echo -e "${YELLOW}⏭️  跳过GitHub设置，您可以稍后手动操作${NC}"
            ;;
        *)
            echo -e "${RED}❌ 无效选择${NC}"
            ;;
    esac
fi

echo -e "\n${BLUE}5️⃣ Vercel部署设置${NC}"
echo -e "\n${GREEN}🎯 接下来请在Vercel Dashboard中完成部署：${NC}"
echo -e "\n${BLUE}步骤说明：${NC}"
echo "1. 访问 https://vercel.com 并登录"
echo "2. 点击 'New Project'"
echo "3. 选择 'Import Git Repository' 并找到您的仓库"
echo "4. 点击 'Import' 导入项目"
echo -e "\n${YELLOW}⚠️  重要：在部署前必须设置环境变量：${NC}"
echo "   VITE_SUPABASE_URL=https://cyczdqlhwowtfhznfvlg.supabase.co"
echo "   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5Y3pkcWxod293dGZoem5mdmxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4OTAyOTMsImV4cCI6MjA3MTQ2NjI5M30.jKZGoBkL93gr95__XmpBVG8pB3G9MJr5w8zzKkK_Od4"
echo -e "\n${BLUE}5. 点击 'Deploy' 开始部署${NC}"

echo -e "\n${GREEN}🎉 Git仓库设置完成！${NC}"
echo -e "\n${BLUE}📋 后续操作：${NC}"
echo "✅ 完成Vercel Dashboard中的部署设置"
echo "✅ 配置环境变量"
echo "✅ 等待部署完成并获取URL"
echo -e "\n${GREEN}🔄 自动部署已启用：每次 'git push' 都会自动部署新版本！${NC}"

echo -e "\n${BLUE}🛠️  常用命令：${NC}"
echo "# 推送更新（触发自动部署）"
echo "git add ."
echo "git commit -m '更新描述'"
echo "git push"
echo -e "\n# 创建功能分支"
echo "git checkout -b feature/new-feature"
echo "git push origin feature/new-feature"

echo -e "\n${GREEN}🚀 准备就绪！请继续在Vercel Dashboard中完成最终部署。${NC}"