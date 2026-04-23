# 🚀 全栈项目部署指南

## ✅ 已完成配置

- [x] 前端 Netlify 部署配置（`netlify.toml`）
- [x] 后端 Render 部署配置（`render.yaml`）
- [x] WebSocket 实时同步功能
- [x] CORS 跨域配置已修复
- [x] 生产环境变量支持
- [x] 代码已推送到 GitHub

---

## 📦 第一步：部署后端到 Render（推荐免费方案）

### 方法一：使用 Render Blueprint（自动配置）

1. **访问 Render**
   ```
   https://render.com
   ```

2. **登录**
   - 点击 "Get Started for Free"
   - 选择 "Sign in with GitHub"
   - 授权访问你的仓库

3. **使用 Blueprint 自动部署**
   - 登录后进入 Dashboard
   - 点击 "New +" → "Blueprint"
   - 选择仓库 `Wangshou123/qqqqq-demo`
   - Render 会自动读取 `render.yaml` 配置
   - 点击 "Apply"

4. **等待部署**
   - 构建时间：约 3-5 分钟
   - Render 会自动：
     - 检测 Java + Maven 项目
     - 执行构建：`cd backend && mvn clean package -DskipTests`
     - 启动应用：`cd backend && java -jar target/*.jar`

### 方法二：手动创建 Web Service

1. **访问 Render**
   ```
   https://render.com
   ```

2. **创建 Web Service**
   - 点击 "New +" → "Web Service"
   - 选择 "Connect a repository"
   - 找到 `Wangshou123/qqqqq-demo`
   - 点击 "Connect"

3. **配置服务**
   - **Name**: `portfolio-backend`
   - **Region**: Singapore（推荐，离中国最近）
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -jar target/*.jar`
   - **Plan**: Free

4. **环境变量**
   点击 "Advanced" → "Add Environment Variable"：
   ```
   PORT=8080
   JAVA_OPTS=-Xmx512m
   SPRING_PROFILES_ACTIVE=production
   ```

5. **健康检查**
   - **Health Check Path**: `/api/portfolio/health`

6. **点击 "Create Web Service"**

### 获取后端 URL

部署成功后，在 Render Dashboard 可以看到你的后端 URL：
```
https://portfolio-backend-xxxx.onrender.com
```

### 测试后端 API

访问以下 URL 验证：
- 健康检查：`https://your-domain.onrender.com/api/portfolio/health`
  应该返回：`ok`

---

## 🌐 第二步：更新前端环境变量

### 1. 创建生产环境配置文件

在前端目录创建 `portfolio/.env.production`：

```env
# 替换为你的实际后端 URL
VITE_API_URL=https://portfolio-backend-xxxx.onrender.com/api
VITE_WS_URL=https://portfolio-backend-xxxx.onrender.com/ws
```

### 2. 提交更改

```bash
cd portfolio
git add .env.production
git commit -m "update: 配置生产环境 API 和 WebSocket URL"
git push
```

---

## 🎨 第三步：部署前端到 Netlify

### 方法一：通过 Netlify 网站（推荐）

1. **访问 Netlify**
   ```
   https://netlify.com
   ```

2. **登录**
   - 点击 "Sign in"
   - 选择 "Sign in with GitHub"
   - 授权访问

3. **创建站点**
   - 点击 "Add new site" → "Import an existing project"
   - 选择 "GitHub"
   - 找到并选择 `Wangshou123/qqqqq-demo`
   - 点击 "Connect"

4. **配置构建**
   Netlify 会自动读取 `netlify.toml`，确认以下配置：
   - **Base directory**: 留空
   - **Build command**: `cd portfolio && npm install && npm run build`
   - **Publish directory**: `portfolio/dist`

5. **环境变量**（可选）
   如果需要，可以在 Netlify Dashboard 添加：
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-domain.onrender.com/api`
   - **Key**: `VITE_WS_URL`
   - **Value**: `https://your-domain.onrender.com/ws`

6. **点击 "Deploy site"**

7. **等待部署**
   - 构建时间：约 1-2 分钟
   - 部署成功后会获得一个 URL：
     ```
     https://your-site-name.netlify.app
     ```

### 方法二：通过 Netlify CLI

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录
netlify login

# 进入前端目录
cd portfolio

# 初始化
netlify init
# 选择 "Create & configure a new site"
# 选择 team
# 输入站点名称（可选）

# 部署
netlify deploy --prod
```

---

## 🎉 完成！

现在你的全栈网站已经部署到互联网：

### 访问地址

- **前端展示**: `https://your-site-name.netlify.app`
- **管理后台**: `https://your-site-name.netlify.app/#/admin`

### 测试实时同步

1. 打开两个浏览器窗口
2. 窗口 A：访问前端展示页面
3. 窗口 B：访问管理后台
4. 在窗口 B 修改内容并保存
5. 窗口 A 应该自动更新显示新内容

---

## 🔧 故障排除

### 后端部署失败

1. **检查构建日志**
   - 进入 Render Dashboard → 你的服务 → "Logs"
   - 查看错误信息

2. **常见问题**
   - Java 版本不匹配：确保使用 Java 21
   - 端口错误：确保应用监听 8080 端口
   - 内存不足：调整 `JAVA_OPTS=-Xmx512m`

3. **手动触发重新部署**
   - Dashboard → 你的服务 → "Manual Deploy" → "Deploy latest commit"

### 前端构建失败

1. **检查 Netlify 构建日志**
   - Dashboard → 你的站点 → "Deploys" → 点击失败部署 → 查看日志

2. **常见问题**
   - Node.js 版本：确保使用 Node 18+
   - 依赖缺失：检查 `package.json`
   - 环境变量：确认 `.env.production` 正确

3. **重新部署**
   - Dashboard → "Deploys" → 点击最新部署 → "Retry deploy"

### WebSocket 连接失败

1. **检查浏览器控制台**
   - 按 F12 打开开发者工具
   - 查看 Console 和 Network 标签

2. **验证 WebSocket URL**
   - 确认 `VITE_WS_URL` 正确
   - 格式：`https://your-domain.onrender.com/ws`

3. **Render WebSocket 支持**
   - Render 免费套餐支持 WebSocket
   - 确保 CORS 配置正确

### API 调用失败

1. **检查环境变量**
   - 确认 `VITE_API_URL` 正确
   - 格式：`https://your-domain.onrender.com/api`

2. **测试后端可访问性**
   ```bash
   curl https://your-domain.onrender.com/api/portfolio/health
   ```

3. **CORS 错误**
   - 后端已配置允许所有域名
   - 如果仍有问题，检查 Render 日志

---

## 💡 平台限制说明

### Render 免费套餐

- **休眠策略**：30 分钟无访问后休眠
- **唤醒时间**：首次访问需要 30-60 秒
- **月度额度**：750 小时/月（足够单个服务持续运行）
- **数据库**：使用 H2 文件数据库，数据持久化在容器内

### Netlify 免费套餐

- **带宽**：100 GB/月
- **构建时间**：300 分钟/月
- **站点数量**：无限
- **HTTPS**：自动配置
- **自定义域名**：支持

---

## 🔗 有用的链接

- Render Dashboard: https://dashboard.render.com
- Netlify Dashboard: https://app.netlify.com
- 项目仓库: https://github.com/Wangshou123/qqqqq-demo
- Render 文档: https://render.com/docs
- Netlify 文档: https://docs.netlify.com

---

## 📊 部署架构

```
用户访问
   ↓
Netlify (前端 CDN)
   ↓
    ├─→ 静态资源（HTML/CSS/JS）
    └─→ API 请求
         ↓
      Render (后端服务)
         ↓
         ├─→ REST API (Spring Boot)
         └─→ WebSocket (实时推送)
              ↓
         H2 Database (文件存储)
```

---

## 🎯 后续优化建议

1. **数据库升级**
   - 从 H2 迁移到 PostgreSQL（Render 提供免费额度）

2. **自定义域名**
   - 在 Netlify 和 Render 分别绑定自定义域名

3. **监控与日志**
   - 集成 Sentry 错误追踪
   - 添加性能监控

4. **CI/CD**
   - 配置 GitHub Actions 自动测试
   - 部署成功后自动通知

5. **安全加固**
   - 添加 API 认证
   - 启用 CSRF 保护
   - 配置 CSP 头
