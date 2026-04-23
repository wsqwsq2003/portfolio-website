# 实时数据同步功能

## 功能概述

现在，当你在管理后台修改数据时，所有访问网站的用户都会**实时看到更新**！

### ✨ 核心特性

1. **即时响应** - 修改后立即在本地显示
2. **云端同步** - 自动保存到服务器数据库
3. **实时更新** - 通过 WebSocket 推送给所有在线用户
4. **离线支持** - 无网络时仍可编辑，恢复后自动同步

---

## 架构说明

### 后端技术栈

- **Spring Boot 3.2.0** - Web 框架
- **H2 Database** - 嵌入式数据库
- **WebSocket (STOMP)** - 实时通信
- **JPA** - 数据持久化

### 前端技术栈

- **React 18** - UI 框架
- **SockJS + STOMP** - WebSocket 客户端
- **localStorage** - 本地缓存

---

## 启动方式

### 方法 1: 一键启动（推荐）

```bash
# Windows
start-fullstack.bat
```

这会自动启动前后端服务。

### 方法 2: 手动启动

**启动后端：**
```bash
cd backend
mvn spring-boot:run
```

**启动前端：**
```bash
cd portfolio
npm run dev
```

---

## API 接口

### 内容管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/portfolio/content` | 获取所有语言内容 |
| GET | `/api/portfolio/content/{locale}` | 获取特定语言内容 |
| POST | `/api/portfolio/content` | 保存/更新内容 |
| DELETE | `/api/portfolio/content/{locale}` | 删除内容 |

### WebSocket

- **端点**: `/ws`
- **订阅**: `/topic/content/{locale}`
- **功能**: 实时接收内容更新

### 健康检查

- **GET** `/api/portfolio/health`

---

## 数据流程

### 保存流程

```
用户编辑 → AdminPanel 更新
  ↓
updateContent() 调用
  ↓
立即更新 React 状态 (本地显示)
  ↓
保存到 localStorage (持久化)
  ↓
异步 POST 到后端 API
  ↓
后端保存到 H2 数据库
  ↓
通过 WebSocket 广播更新
  ↓
所有连接的客户端收到更新
  ↓
自动刷新页面内容
```

### 加载流程

```
应用启动
  ↓
从 localStorage 加载 (快速显示)
  ↓
后台检查服务器是否可用
  ↓
如果可用，从服务器拉取最新数据
  ↓
建立 WebSocket 连接
  ↓
订阅内容更新频道
  ↓
服务器有新数据时自动更新
```

---

## 数据库

### H2 数据库

- **文件位置**: `backend/data/portfolio.mv.db`
- **控制台**: http://localhost:8080/h2-console
- **JDBC URL**: `jdbc:h2:file:./data/portfolio`
- **用户名**: `sa`
- **密码**: (空)

### 数据表结构

```sql
CREATE TABLE portfolio_content (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  locale VARCHAR(10) UNIQUE NOT NULL,
  content TEXT,
  updated_at TIMESTAMP
);
```

---

## 使用场景

### 场景 1: 单用户编辑

1. 访问管理后台: `/#/admin`
2. 修改任意内容
3. 点击"保存"
4. ✅ 数据立即保存并显示

### 场景 2: 多用户实时同步

1. 用户 A 打开网站
2. 用户 B 打开管理后台并修改内容
3. 用户 B 点击保存
4. ✅ 用户 A 的页面自动更新（无需刷新）

### 场景 3: 离线编辑

1. 用户断开网络
2. 在管理后台修改内容
3. 数据保存到 localStorage
4. 恢复网络后自动同步到服务器

---

## 环境变量

### 前端 (.env.production)

```env
VITE_API_URL=https://your-backend-url.onrender.com/api
VITE_WS_URL=https://your-backend-url.onrender.com/ws
```

### 后端 (application.yml)

```yaml
server:
  port: ${PORT:8080}

cors:
  allowed-origins: "*"  # 生产环境应改为具体域名
```

---

## 部署配置

### 前端 (Netlify)

已配置 `netlify.toml`:
```toml
[build]
  command = "cd portfolio && npm install && npm run build"
  publish = "portfolio/dist"
```

### 后端 (Render)

已配置 `render.yaml`:
```yaml
services:
  - type: web
    name: wangshouqing-backend
    runtime: java
    buildCommand: cd backend && mvn clean package -DskipTests
    startCommand: cd backend && java -jar target/*.jar
```

---

## 测试同步功能

### 测试步骤

1. **启动前后端**
   ```bash
   start-fullstack.bat
   ```

2. **打开两个浏览器窗口**
   - 窗口 A: http://localhost:5173 (前台展示)
   - 窗口 B: http://localhost:5173/#/admin (管理后台)

3. **在窗口 B 修改内容**
   - 进入管理后台（密码: admin123）
   - 修改任意字段
   - 点击"保存"

4. **观察窗口 A**
   - ✅ 内容应立即更新（无需刷新）

---

## 故障排查

### WebSocket 连接失败

**症状**: 控制台显示 WebSocket 连接错误

**解决**:
1. 确认后端服务正在运行
2. 检查端口是否正确 (8080)
3. 检查 CORS 配置

### 数据未同步

**症状**: 修改后其他用户看不到更新

**解决**:
1. 检查浏览器控制台是否有错误
2. 确认网络连接正常
3. 查看后端日志确认收到请求

### 数据库为空

**症状**: 重启后端后数据丢失

**解决**:
1. 检查 `backend/data/` 目录是否存在
2. 确认 JPA `ddl-auto` 配置为 `update`
3. 查看 H2 控制台确认数据

---

## 性能优化建议

1. **生产环境数据库**: 使用 PostgreSQL 或 MySQL 替代 H2
2. **WebSocket 集群**: 使用 Redis Pub/Sub 支持多实例
3. **数据压缩**: 对大文本内容启用 gzip 压缩
4. **缓存策略**: 使用 Redis 缓存热点数据

---

## 安全注意事项

1. **认证**: 当前管理后台使用简单密码，生产环境应使用 JWT 或 OAuth
2. **CORS**: 生产环境应限制允许的域名
3. **HTTPS**: 部署时应启用 HTTPS
4. **数据加密**: 敏感数据应加密存储

---

## 后续优化方向

- [ ] 添加用户认证系统
- [ ] 支持多管理员权限
- [ ] 添加内容版本控制
- [ ] 实现数据备份和恢复
- [ ] 添加操作日志
- [ ] 支持图片上传到云存储

---

现在，你的个人网站支持**实时数据同步**了！🎉
