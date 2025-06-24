#!/bin/bash

# 发布脚本
set -e

echo "🚀 开始发布流程..."

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
  echo "❌ 请在项目根目录运行此脚本"
  exit 1
fi

# 检查 git 仓库
if [ ! -d ".git" ]; then
  echo "❌ 当前目录不是 git 仓库"
  exit 1
fi

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
  echo "❌ 有未提交的更改，请先提交或暂存"
  echo "当前状态："
  git status
  exit 1
fi

# 检查当前分支
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
  echo "❌ 请在 main 或 master 分支上发布，当前分支: $CURRENT_BRANCH"
  exit 1
fi

# 检查远程仓库
if [ -z "$(git remote -v 2>/dev/null)" ]; then
  echo "⚠️  警告: 没有配置远程仓库"
  read -p "是否继续发布? (y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 发布已取消"
    exit 1
  fi
fi

# 检查依赖是否安装
if [ ! -d "node_modules" ]; then
  echo "📦 安装依赖..."
  yarn install
fi

# 运行测试
echo "🧪 运行测试..."
if ! yarn test; then
  echo "❌ 测试失败"
  exit 1
fi

# 运行代码检查
echo "🔍 运行代码检查..."
if ! yarn lint; then
  echo "❌ 代码检查失败"
  exit 1
fi

# 构建项目
echo "🔨 构建项目..."
if ! yarn build; then
  echo "❌ 构建失败"
  exit 1
fi

# 选择版本类型
echo "📦 选择版本类型:"
echo "1) patch (补丁版本)"
echo "2) minor (次要版本)"
echo "3) major (主要版本)"
read -p "请选择 (1-3): " version_type

case $version_type in
  1)
    echo "📈 更新补丁版本..."
    npm version patch
    ;;
  2)
    echo "📈 更新次要版本..."
    npm version minor
    ;;
  3)
    echo "📈 更新主要版本..."
    npm version major
    ;;
  *)
    echo "❌ 无效选择"
    exit 1
    ;;
esac

# 获取新版本号
NEW_VERSION=$(node -p "require('./package.json').version")
echo "🎉 新版本: $NEW_VERSION"

# 发布到 npm
echo "📤 发布到 npm..."
if ! npm publish --access public; then
  echo "❌ 发布失败"
  exit 1
fi

# 推送标签（如果有远程仓库）
if [ -n "$(git remote -v 2>/dev/null)" ]; then
  echo "🏷️ 推送标签..."
  if ! git push --follow-tags; then
    echo "⚠️  标签推送失败，请手动推送"
  fi
else
  echo "⚠️  跳过标签推送（无远程仓库）"
fi

echo "✅ 发布完成！版本 $NEW_VERSION 已发布到 npm" 