# Netlify 前端部署步骤

## 当前状态
- ✅ 代码已推送到 GitHub: https://github.com/wsqwsq2003/portfolio-website
- ✅ netlify.toml 配置文件已就绪
- ✅ 环境变量使用占位符 URL (后端部署后需更新)

---

## 部署步骤

### 1. 连接 Netlify

1. 打开 https://app.netlify.com/start
2. 使用 GitHub 账号登录
3. 点击 **"New site from Git"**

### 2. 选择仓库

1. 点击 **"GitHub"**
2. 授权 Netlify 访问你的仓库
3. 选择仓库: **portfolio-website**

### 3. 配置构建

**Build Command:**
```
cd portfolio && npm install && npm run build
```

**Publish Directory:**
```
portfolio/dist
```

**环境变量 (可选,先留空):**
- `VITE_API_URL` = https://your-backend.onrender.com/api
- `VITE_WS_URL` = https://your-backend.onrender.com/ws

### 4. 开始部署

点击 **"Deploy site"** 按钮

等待 2-3 分钟完成构建

### 5. 获取 URL

部署成功后,你会得到类似这样的 URL:
```
https://wangshouqing-portfolio.netlify.app
```

---

## 部署后配置

### 更新后端 URL

获得后端 Render URL 后,需要:

1. 在 Netlify Dashboard 中进入 **Site settings > Environment variables**
2. 添加或更新以下变量:
   - `VITE_API_URL` = `https://your-backend.onrender.com/api`
   - `VITE_WS_URL` = `https://your-backend.onrender.com/ws`
3. 重新部署网站 (点击 **"Deploy site"**)

---

## 测试清单

部署完成后,访问你的 Netlify URL 并测试:

- [ ] 首页是否正常显示
- [ ] 多语言切换 (6种语言)
- [ ] 页面滚动动画
- [ ] 响应式设计 (手机端)
- [ ] 管理后台访问 (/#/admin)
- [ ] WebSocket 实时同步 (需要后端运行)

---

## 故障排除

### 构建失败

检查:
- Build Command 是否正确
- Node 版本是否兼容 (Netlify 默认 Node 18)
- 依赖是否完整 (package.json)

### 部署后 404

检查:
- Publish Directory 是否为 `portfolio/dist`
- dist 目录中是否有 index.html

### API 连接失败

这是预期的 (后端尚未部署)
- 前端会自动降级使用本地数据
- 完成 Render 部署后更新环境变量

---

## 自定义域名 (可选)

在 Netlify Dashboard 中:
1. 进入 **Domain settings**
2. 点击 **Add custom domain**
3. 按照提示配置 DNS

---

**下一步:** 完成部署后,将你的 Netlify URL 和 Render URL 告诉我!
