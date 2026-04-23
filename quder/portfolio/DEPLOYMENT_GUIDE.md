# 王守卿个人网站 - 完整部署指南

## 项目结构

```
quder/
├── portfolio/          # 前端 - React + Vite（wangshouqing-personal-website）
└── backend/            # 后端 - Spring Boot（API 服务）
```

---

## 前端部署到 Netlify

### 方法 1: 通过 GitHub 自动部署（推荐）

1. **创建 GitHub 仓库**
   - 访问 https://github.com/new
   - 仓库名: `wangshouqing-personal-website`
   - 设为 Public
   - 点击 Create repository

2. **推送代码到 GitHub**
   ```bash
   cd c:\Users\17988\Desktop\quder\portfolio
   git branch -M main
   git remote add origin https://github.com/Wangshou123/wangshouqing-personal-website.git
   git push -u origin main
   ```

3. **连接 Netlify**
   - 访问 https://app.netlify.com/
   - 使用邮箱 `3187193437@qq.com` 登录
   - 点击 "New site from Git"
   - 选择 "GitHub"
   - 选择 `wangshouqing-personal-website` 仓库
   - 构建设置自动识别，无需修改
   - 点击 "Deploy site"

4. **部署完成**
   - Netlify 会生成一个 URL，如 `https://wangshouqing-personal-website.netlify.app`
   - 可在 Settings → Domain management 中自定义域名

### 方法 2: 手动拖拽部署

1. **构建项目**
   ```bash
   cd c:\Users\17988\Desktop\quder\portfolio
   npm run build
   ```

2. **访问 Netlify**
   - 打开 https://app.netlify.com/drop
   - 将 `dist` 文件夹拖拽到网页中

3. **部署完成**
   - 即时获得访问 URL

---

## 后端部署到 Render

### 准备工作

1. **访问 Render**
   - 打开 https://render.com/
   - 使用 GitHub 账号登录

2. **推送后端代码到 GitHub**
   - 需要先创建 GitHub 仓库
   - 推送整个 `quder` 项目（包含 backend 文件夹）

### 部署步骤

1. **创建 Web Service**
   - 在 Render Dashboard 点击 "New +"
   - 选择 "Web Service"
   - 连接 GitHub 仓库

2. **配置服务**
   ```
   名称: qqqqq-demo-backend
   环境: Java
   构建命令: cd backend && mvn clean package -DskipTests
   启动命令: cd backend && java -jar target/*.jar
   环境变量:
     - PORT: 8080
     - JAVA_OPTS: -Xmx512m
   ```

3. **健康检查**
   - 路径: `/api/users`

4. **部署完成**
   - Render 会生成 URL，如 `https://qqqqq-demo-backend.onrender.com`

---

## 配置前端 API 地址

如果部署了后端，需要更新前端的环境变量：

1. **创建 `.env.production` 文件**
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

2. **重新构建并部署**
   ```bash
   npm run build
   git add .
   git commit -m "Update API URL"
   git push
   ```

---

## 快速部署检查清单

- [ ] 前端代码已推送到 GitHub
- [ ] Netlify 已连接 GitHub 仓库
- [ ] Netlify 自动部署成功
- [ ] （可选）后端代码已推送到 GitHub
- [ ] （可选）Render Web Service 已创建
- [ ] （可选）后端部署成功
- [ ] （可选）前端 API URL 已更新

---

## 注意事项

1. **网络问题**
   - 如果无法连接 GitHub，可尝试：
     - 使用 VPN 或代理
     - 使用 Git 镜像
     - 手动拖拽部署到 Netlify

2. **数据持久化**
   - 前端数据保存在浏览器 localStorage
   - 每个用户的数据独立
   - 清除浏览器数据会丢失配置

3. **自定义域名**
   - Netlify: Settings → Domain management
   - Render: Settings → Custom domain

---

## 已配置文件

- ✅ `netlify.toml` - Netlify 部署配置（SPA 重定向）
- ✅ `render.yaml` - Render 部署配置（后端）
- ✅ `.gitignore` - Git 忽略文件
- ✅ `package.json` - 依赖和构建脚本

---

## 技术栈

**前端:**
- React 18.3.1 + TypeScript
- Vite 4.5.5
- Tailwind CSS 3.4.4
- 6 种语言国际化 (zh/en/ja/ko/fr/es)
- Glassmorphism UI 设计
- 粒子动画开场效果

**后端:**
- Spring Boot
- Java
- Maven 构建

---

部署完成后，你的网站将通过 URL 全球可访问！
