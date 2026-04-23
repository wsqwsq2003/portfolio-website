# 后端部署指南 - Railway

## 方案 1：Railway（推荐）

### 步骤：

1. **注册 Railway**
   - 访问：https://railway.app/
   - 使用 GitHub 账号登录

2. **创建新项目**
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 选择 `Wangshou123/qqqqq-demo` 仓库

3. **配置项目**
   - Railway 会自动检测到 Java + Maven 项目
   - 设置 Root Directory 为 `backend`
   - 或在环境变量中设置：`RAILWAY_PROJECT_ROOT=backend`

4. **环境变量配置**
   - PORT: Railway 会自动设置
   - 不需要其他特殊配置

5. **部署**
   - Railway 会自动构建和部署
   - 部署完成后会获得一个 URL，例如：`https://your-app-production.up.railway.app`

6. **更新前端环境变量**
   - 在 Vercel Dashboard 中设置环境变量：
     - `VITE_API_BASE_URL=https://your-app-production.up.railway.app/api`
   - 重新部署前端

---

## 方案 2：Render

### 步骤：

1. **注册 Render**
   - 访问：https://render.com/
   - 使用 GitHub 账号登录

2. **创建 Web Service**
   - 点击 "New" → "Web Service"
   - 连接 GitHub 仓库
   - 选择 `qqqqq-demo`

3. **配置**
   - Name: `qqqqq-backend`
   - Root Directory: `backend`
   - Runtime: `Java`
   - Build Command: `mvn clean package -DskipTests`
   - Start Command: `java -jar target/demo-0.0.1-SNAPSHOT.jar`

4. **环境变量**
   - 设置 `PORT=8080`（Render 可能会自动设置）

5. **部署**
   - 点击 "Create Web Service"
   - 等待部署完成

---

## 方案 3：Heroku

### 步骤：

1. **安装 Heroku CLI**
   ```bash
   # Windows
   # 下载：https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **登录 Heroku**
   ```bash
   heroku login
   ```

3. **创建应用**
   ```bash
   heroku create qqqqq-backend
   ```

4. **添加 Java buildpack**
   ```bash
   heroku buildpacks:set heroku/java
   ```

5. **部署**
   ```bash
   git push heroku main
   ```

---

## 部署后配置

### 更新前端 API 地址

在 Vercel Dashboard 中：
1. 进入项目 Settings → Environment Variables
2. 更新 `VITE_API_BASE_URL` 为后端 URL：
   ```
   VITE_API_BASE_URL=https://your-backend-url.railway.app/api
   ```
3. 重新部署前端

### 测试 API

部署完成后，访问：
- `https://your-backend-url.railway.app/api/users` (GET)
- 应该返回用户列表 JSON 数据
