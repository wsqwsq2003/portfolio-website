# 🚀 快速部署指南

## ✅ 已完成配置

- [x] 前端 Vercel 部署配置
- [x] 后端 Railway 部署配置
- [x] 环境变量支持
- [x] CORS 跨域配置
- [x] 自动构建配置

---

## 📦 第一步：部署后端到 Railway

### 1. 访问 Railway
👉 https://railway.app/

### 2. 登录
- 点击 "Login"
- 选择 "Sign in with GitHub"
- 授权访问

### 3. 创建项目
- 点击 "New Project"
- 选择 **"Deploy from GitHub repo"**
- 搜索并选择 `Wangshou123/qqqqq-demo`

### 4. 配置项目
Railway 会自动读取 `railway.json` 配置，您只需要：
- 确认 **Root Directory** 设置为 `backend`（如果没有自动设置）
- 其他配置已自动完成

### 5. 等待部署
- Railway 会自动：
  - 检测 Java + Maven 项目
  - 执行构建：`mvn clean package -DskipTests`
  - 启动应用：`java -jar backend/target/demo-0.0.1-SNAPSHOT.jar`
- 部署时间：约 2-5 分钟

### 6. 获取后端 URL
- 部署成功后，点击项目
- 进入 "Settings" 标签
- 找到 **Domains** 部分
- 复制域名，例如：`https://qqqqq-demo-production.up.railway.app`

### 7. 测试 API
访问：`https://your-domain.up.railway.app/api/users`
应该看到 JSON 返回：
```json
[
  {
    "id": 1,
    "name": "张三",
    "email": "zhangsan@example.com"
  },
  ...
]
```

---

## 🌐 第二步：更新前端环境变量

### 1. 访问 Vercel Dashboard
👉 https://vercel.com/dashboard

### 2. 选择项目
- 点击 `qqqqq-demo` 项目

### 3. 设置环境变量
- 点击 "Settings" → "Environment Variables"
- 添加或更新：
  - **Key**: `VITE_API_BASE_URL`
  - **Value**: `https://your-domain.up.railway.app/api`
  - 环境：选择 "Production", "Preview", "Development" 都添加
- 点击 "Save"

### 4. 重新部署前端
- 进入 "Deployments" 标签
- 点击最新部署右侧的 "..."
- 选择 "Redeploy"
- 等待部署完成

---

## 🎉 完成！

现在访问您的 Vercel 前端 URL：
- `https://qqqqq-demo.vercel.app`

您应该能看到：
- ✅ 用户列表页面
- ✅ 3 个示例用户数据
- ✅ 添加用户功能正常工作

---

## 🔧 故障排除

### 后端部署失败
1. 查看 Railway 构建日志
2. 确认 Java 版本正确（Java 21）
3. 检查 `railway.json` 配置

### 前端 API 调用失败
1. 检查 Vercel 环境变量是否正确
2. 确认后端 URL 可访问
3. 查看浏览器控制台错误信息

### CORS 错误
1. 后端已配置允许所有域名
2. 如果仍有问题，检查后端日志

---

## 📝 后续优化建议

1. **数据库集成**：添加 PostgreSQL 或 MySQL
2. **用户认证**：实现 JWT 登录
3. **CI/CD**：配置自动部署
4. **监控**：添加日志和性能监控
5. **域名绑定**：使用自定义域名

---

## 💡 有用的链接

- Railway Dashboard: https://railway.app/dashboard
- Vercel Dashboard: https://vercel.com/dashboard
- 项目仓库: https://github.com/Wangshou123/qqqqq-demo
