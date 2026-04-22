# 全栈项目 - Vue 3 + Spring Boot

这是一个前后端分离的全栈项目示例，后端使用 Spring Boot 3.x + Java 21，前端使用 Vue 3 + TypeScript + Element Plus。

## 项目结构

```
quder/
├── backend/                 # Spring Boot 后端
│   ├── src/main/java/com/example/demo/
│   │   ├── controller/      # REST控制器
│   │   ├── model/           # 数据模型
│   │   ├── service/         # 业务逻辑层
│   │   └── DemoApplication.java
│   ├── src/main/resources/
│   │   └── application.yml
│   └── pom.xml
└── frontend/                # Vue 3 前端
    ├── src/
    │   ├── api/             # API调用封装
    │   ├── components/      # Vue组件
    │   ├── views/           # 页面视图
    │   ├── App.vue
    │   └── main.ts
    ├── public/
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    └── index.html
```

## 快速开始

### 后端启动 (Spring Boot)

1. 确保已安装 Java 21 和 Maven
2. 进入后端目录：
   ```bash
   cd backend
   ```
3. 运行项目：
   ```bash
   mvn spring-boot:run
   ```
4. 后端将在 http://localhost:8080 启动

### 前端启动 (Vue 3)

1. 确保已安装 Node.js (推荐 v18+)
2. 进入前端目录：
   ```bash
   cd frontend
   ```
3. 安装依赖：
   ```bash
   npm install
   ```
4. 运行开发服务器：
   ```bash
   npm run dev
   ```
5. 前端将在 http://localhost:5173 启动

## 功能特性

- [x] RESTful API (用户管理)
- [x] CORS 跨域配置
- [x] Vue 3 Composition API
- [x] TypeScript 类型安全
- [x] Element Plus UI 组件库
- [x] 用户列表展示
- [x] 添加用户功能

## API 接口

### 获取用户列表
```
GET http://localhost:8080/api/users
```

### 添加用户
```
POST http://localhost:8080/api/users
Content-Type: application/json

{
  "name": "用户姓名",
  "email": "用户邮箱"
}
```

## 技术栈

### 后端
- Java 21
- Spring Boot 3.2.0
- Spring Web
- Maven

### 前端
- Vue 3.4
- TypeScript 5.3
- Vite 5.0
- Element Plus 2.4
- Axios 1.6

## 开发说明

- 前端开发服务器配置了代理，`/api` 请求会自动转发到后端
- 后端已配置 CORS，允许前端 `http://localhost:5173` 访问
- 使用 TypeScript 确保类型安全
- 使用 Element Plus 提供美观的 UI 组件

## 注意事项

1. 先启动后端，再启动前端
2. 确保 8080 和 5173 端口未被占用
3. 首次运行前端需要执行 `npm install` 安装依赖
