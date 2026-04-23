# Railway 后端部署指南

## 快速部署步骤

### 1. 访问 Railway
打开 https://railway.app/new

### 2. 选择项目
- 点击 "Deploy from GitHub repo"
- 选择 `Wangshou123/qqqqq-demo`

### 3. 配置环境变量
在项目设置中添加：
- `PORT` = `8080`

### 4. 部署
点击 "Deploy" 按钮，等待部署完成。

### 5. 获取域名
部署成功后，Railway 会分配一个域名：
- `https://xxxx.up.railway.app`

### 6. 测试 API
访问 `https://xxxx.up.railway.app/api/users` 测试后端是否正常。

### 7. 更新前端配置
将 Railway 域名告诉我，我会更新前端配置使其调用后端 API。
