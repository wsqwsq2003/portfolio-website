# Netlify 前端部署指南

## 当前状态
- [x] 后端已部署到 Render: https://portfolio-website-441f.onrender.com
- [x] 前端配置已更新 (.env.production)
- [x] 代码已推送到 GitHub: https://github.com/wsqwsq2003/portfolio-website

---

## 快速部署步骤

### 1. 访问 Netlify
打开 https://app.netlify.com/start

### 2. 连接 GitHub
- 点击 **"New site from Git"**
- 选择 **GitHub**
- 授权 Netlify 访问你的仓库
- 选择仓库: **portfolio-website**

### 3. 配置构建
**Build command:**
```
cd portfolio && npm install && npm run build
```

**Publish directory:**
```
portfolio/dist
```

**环境变量 (Netlify 会自动从 .env.production 读取):**
- VITE_API_URL = https://portfolio-website-441f.onrender.com/api
- VITE_WS_URL = https://portfolio-website-441f.onrender.com/ws

### 4. 点击 Deploy site
等待 2-3 分钟完成部署

### 5. 获取你的 Netlify URL
格式类似: `https://your-site-name.netlify.app`

---

## 部署后测试

访问你的 Netlify URL 并检查:
- [ ] 首页正常显示
- [ ] 多语言切换 (6种语言)
- [ ] 页面滚动动画
- [ ] 管理后台 (/#/admin)
- [ ] 内容编辑功能 (需要后端运行)

---

## 自定义域名 (可选)
在 Netlify Dashboard:
1. Domain settings
2. Add custom domain
3. 配置 DNS 记录

---

## 故障排除

### 构建失败
- 检查 Build command 是否正确
- 确认 Node 版本兼容 (Netlify 默认 Node 18+)

### 404 错误
- 确认 Publish directory 是 `portfolio/dist`
- 检查 dist 目录是否存在

### API 连接失败
- 确认后端 URL 正确
- 检查 Render 服务是否运行

---

**完成后告诉我你的 Netlify URL!**
