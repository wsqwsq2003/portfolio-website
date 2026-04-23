# 🎯 部署检查清单

## ✅ 已完成的配置

- [x] Git 仓库初始化并提交
- [x] 代码推送到 GitHub: https://github.com/Wangshou123/qqqqq-demo
- [x] Vercel 前端部署配置 (vercel.json)
- [x] Railway 后端部署配置 (railway.json)
- [x] 环境变量配置 (.env.development, .env.production)
- [x] CORS 跨域配置
- [x] 动态端口支持
- [x] 部署文档创建

---

## 📦 待完成的部署步骤

### 第 1 步：部署后端到 Railway ⏳

#### 操作清单：
1. [ ] 访问 https://railway.app/
2. [ ] 点击 "Login" → "Sign in with GitHub"
3. [ ] 授权 Railway 访问 GitHub
4. [ ] 点击 "New Project"
5. [ ] 选择 "Deploy from GitHub repo"
6. [ ] 搜索并选择 `Wangshou123/qqqqq-demo`
7. [ ] 等待 Railway 自动检测项目
8. [ ] 确认 Root Directory 设置为 `backend`
9. [ ] 点击 "Deploy"
10. [ ] 等待部署完成（2-5 分钟）
11. [ ] 复制生成的域名（例如：`https://xxx.up.railway.app`）

#### 验证后端：
- [ ] 访问 `https://your-domain.up.railway.app/api/users`
- [ ] 确认返回 JSON 数据（用户列表）

---

### 第 2 步：配置 Vercel 环境变量 ⏳

#### 操作清单：
1. [ ] 访问 https://vercel.com/dashboard
2. [ ] 点击 `qqqqq-demo` 项目
3. [ ] 点击 "Settings" → "Environment Variables"
4. [ ] 添加环境变量：
   - Key: `VITE_API_BASE_URL`
   - Value: `https://your-railway-domain.up.railway.app/api`
   - 环境：勾选 Production、Preview、Development
5. [ ] 点击 "Save"

---

### 第 3 步：重新部署前端 ⏳

#### 操作清单：
1. [ ] 在 Vercel 项目页面，点击 "Deployments"
2. [ ] 找到最新的部署
3. [ ] 点击右侧 "..." 菜单
4. [ ] 选择 "Redeploy"
5. [ ] 等待部署完成（1-2 分钟）

---

### 第 4 步：测试完整应用 ⏳

#### 操作清单：
1. [ ] 访问前端 URL: `https://qqqqq-demo.vercel.app`
2. [ ] 确认页面正常加载
3. [ ] 确认用户列表显示（3 个示例用户）
4. [ ] 测试添加用户功能
5. [ ] 检查浏览器控制台无错误

---

## 🔍 故障排除

### 如果 Railway 部署失败：
1. 查看构建日志
2. 确认 Java 21 版本正确
3. 检查 `railway.json` 配置
4. 查看错误信息并修复

### 如果前端 API 调用失败：
1. 检查 Vercel 环境变量是否正确设置
2. 确认后端 URL 可访问
3. 打开浏览器开发者工具查看网络请求
4. 检查 CORS 错误信息

### 如果前端页面显示空白：
1. 检查 Vercel 部署日志
2. 确认构建成功
3. 检查 `vercel.json` 配置
4. 查看浏览器控制台错误

---

## 💡 快速链接

- GitHub 仓库: https://github.com/Wangshou123/qqqqq-demo
- Railway Dashboard: https://railway.app/dashboard
- Vercel Dashboard: https://vercel.com/dashboard
- 前端预览: https://qqqqq-demo.vercel.app

---

## 🎉 完成后

当所有检查项都打勾后，您的全栈应用就成功部署了！

您现在拥有：
- ✅ 在线运行的 Vue 3 前端（Vercel）
- ✅ 在线运行的 Spring Boot 后端（Railway）
- ✅ 完整的用户管理功能
- ✅ 自动化的 CI/CD 流程
