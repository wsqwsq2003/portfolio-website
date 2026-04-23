#!/bin/bash

# 构建项目
cd frontend
npm install
npm run build

# 进入构建输出目录
cd dist

# 创建 .nojekyll 文件（防止 GitHub Pages 忽略下划线开头的文件）
touch .nojekyll

# 初始化 git 并推送到 gh-pages 分支
git init
git add -A
git commit -m "Deploy to GitHub Pages"
git push -f https://github.com/Wangshou123/qqqqq-demo.git main:gh-pages

cd -
