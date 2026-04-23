# Vercel 环境变量配置说明

## 在 Vercel Dashboard 中设置环境变量

### 步骤：
1. 访问 https://vercel.com/dashboard
2. 选择您的项目 `qqqqq-demo`
3. 点击 "Settings" → "Environment Variables"
4. 添加以下环境变量：

### 需要配置的变量：

**VITE_API_BASE_URL**
- 开发环境：`http://localhost:8080/api`
- 生产环境：您的后端部署 URL + `/api`
  - 例如：`https://your-backend-url.railway.app/api`

### 注意：
- 设置后需要重新部署才能生效
- 可以在部署时通过 Vercel CLI 设置：`vercel env add VITE_API_BASE_URL`
