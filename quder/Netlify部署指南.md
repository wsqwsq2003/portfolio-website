# 🎨 Netlify 前端部署完整指南

## ✅ 部署前准备

### 已完成的配置
- [x] 代码已推送到 GitHub：https://github.com/wsqwsq2003/portfolio-website
- [x] `netlify.toml` 部署配置已就绪
- [x] `.env.production` 前端环境变量已配置（占位符 URL）
- [x] 构建命令和发布目录已配置

### 需要完成的配置
- [ ] Render 后端部署（获取真实后端 URL）
- [ ] 更新 `.env.production` 中的后端 URL
- [ ] 在 Netlify 完成部署

---

## 🚀 快速部署步骤

### 方法一：使用部署脚本（推荐）

**双击运行**：`Netlify部署助手.bat`

脚本会自动打开 Netlify 并提供详细指导。

---

### 方法二：手动部署

#### 步骤 1：访问 Netlify

在浏览器中打开：
```
https://app.netlify.com/start
```

#### 步骤 2：登录

1. 点击 **"Let's deploy"** 或 **"New site from Git"**
2. 选择 **GitHub** 作为 Git provider
3. 点击 GitHub 图标
4. 授权 Netlify 访问你的 GitHub 账号（wsqwsq2003）

#### 步骤 3：选择仓库

1. 在仓库列表中搜索：`portfolio-website`
2. 选择：**wsqwsq2003/portfolio-website**
3. 点击 **"Select"**

#### 步骤 4：配置构建

Netlify 会自动读取 `netlify.toml`，确认以下配置：

- **Base directory**: 留空
- **Build command**: `cd portfolio && npm install && npm run build`
- **Publish directory**: `portfolio/dist`

**重要**：如果 netlify.toml 未被自动识别，请手动输入上述配置。

#### 步骤 5：环境变量（可选）

如果需要，可以点击 "Advanced build settings" 添加：

- **Key**: `VITE_API_URL`
- **Value**: `https://portfolio-backend-xxxx.onrender.com/api`
- **Key**: `VITE_WS_URL`
- **Value**: `https://portfolio-backend-xxxx.onrender.com/ws`

> **注意**：由于 `.env.production` 文件已包含这些变量，这里可以留空。

#### 步骤 6：开始部署

点击 **"Deploy site"** 按钮。

#### 步骤 7：等待部署完成

- 构建时间：约 1-2 分钟
- 可以在 "Deploy log" 中查看实时进度

#### 步骤 8：获取网站 URL

部署成功后，Netlify 会显示你的网站 URL，格式类似：
```
https://your-site-name.netlify.app
```

你可以在 Netlify Dashboard 的 "Site overview" 中找到这个 URL。

---

## 🔄 更新后端 URL

### 当你获得真实的 Render 后端 URL 后

#### 方法 A：更新本地配置并重新部署

1. **运行配置脚本**：
   ```
   双击运行：配置前端环境.bat
   ```
   - 输入你的 Render 后端 URL
   - 脚本自动更新 `.env.production`
   - 自动提交到 Git

2. **Netlify 自动重新部署**：
   - Netlify 会检测到 Git 推送
   - 自动触发新的构建
   - 使用新的后端 URL

#### 方法 B：在 Netlify Dashboard 直接设置

1. 登录 Netlify Dashboard
2. 选择你的网站
3. 进入 **Site configuration** → **Environment variables**
4. 添加或更新：
   - `VITE_API_URL`: `https://portfolio-backend-xxxx.onrender.com/api`
   - `VITE_WS_URL`: `https://portfolio-backend-xxxx.onrender.com/ws`
5. 进入 **Deploys** → 点击最新部署 → **Trigger deploy** → **Clear cache and deploy site**

---

## 🧪 测试部署

### 访问你的网站

1. **前台展示**：
   ```
   https://your-site-name.netlify.app
   ```

2. **管理后台**：
   ```
   https://your-site-name.netlify.app/#/admin
   ```

### 测试实时同步功能

1. 打开两个浏览器窗口
2. 窗口 A：访问前台展示页面
3. 窗口 B：访问管理后台
4. 在窗口 B 中：
   - 登录管理后台（如果有认证）
   - 修改某个字段（如姓名）
   - 点击保存
5. 观察窗口 A：
   - 应该自动更新显示新内容
   - 无需刷新页面

### 测试响应式设计

1. 在浏览器中按 F12 打开开发者工具
2. 切换到移动设备模式
3. 测试不同屏幕尺寸的显示效果

---

## 🔧 故障排除

### 构建失败

**问题**：Netlify 构建失败，显示找不到依赖

**解决方案**：
1. 检查 `package.json` 是否包含所有依赖
2. 确认构建命令正确：`cd portfolio && npm install && npm run build`
3. 查看构建日志中的具体错误信息

### 构建成功但页面空白

**问题**：部署成功但访问页面显示空白

**解决方案**：
1. 检查浏览器控制台（F12）是否有错误
2. 确认 `publish` 目录正确：`portfolio/dist`
3. 检查 `vite.config.ts` 中的 `base` 配置

### API 调用失败

**问题**：前端无法连接到后端 API

**解决方案**：
1. 检查 `.env.production` 中的 `VITE_API_URL` 是否正确
2. 确认 Render 后端服务正在运行
3. 访问后端健康检查 URL 验证：`https://your-backend.onrender.com/api/portfolio/health`

### WebSocket 连接失败

**问题**：实时同步功能不工作

**解决方案**：
1. 检查 `VITE_WS_URL` 配置
2. 确认 Render 支持 WebSocket（免费套餐支持）
3. 查看浏览器控制台的 WebSocket 连接日志
4. 检查 CORS 配置是否正确

### 404 错误（刷新页面后）

**问题**：刷新页面后出现 404 错误

**解决方案**：
在 `netlify.toml` 中添加 SPA 路由支持：

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 📊 部署检查清单

- [ ] 代码已推送到 GitHub
- [ ] `.env.production` 已配置后端 URL
- [ ] 在 Netlify 连接 GitHub 仓库
- [ ] 构建配置正确（读取 netlify.toml）
- [ ] 部署成功完成
- [ ] 网站可以正常访问
- [ ] API 调用正常
- [ ] WebSocket 实时同步工作
- [ ] 移动端响应式正常

---

## 💡 提示

1. **自定义域名**：
   - Netlify 支持绑定自定义域名
   - 在 Domain settings 中添加

2. **HTTPS**：
   - Netlify 自动提供 HTTPS
   - 无需额外配置

3. **部署预览**：
   - 每次推送到 GitHub 都会触发新部署
   - 可以在 Deploys 中查看历史版本

4. **免费额度**：
   - 100GB 带宽/月
   - 300 分钟构建/月
   - 对于个人网站完全够用

---

## 🎯 下一步

**部署完成后：**

1. 告诉我你的 Netlify 网站 URL
2. 告诉我你的 Render 后端 URL
3. 我会帮你测试完整的实时同步功能

**祝你部署顺利！** 🚀
