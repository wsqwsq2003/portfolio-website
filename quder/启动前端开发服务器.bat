@echo off
chcp 65001 >nul
echo ==========================================
echo   Portfolio Website - 本地开发服务器
echo ==========================================
echo.
echo 正在启动前端开发服务器...
echo.
echo 访问地址:
echo   - 首页: http://localhost:5173/
echo   - 管理后台: http://localhost:5173/admin
echo.
echo 提示: 需要同时启动后端服务 (localhost:8080)
echo       运行: cd backend ^&^& mvn spring-boot:run
echo.
echo 按 Ctrl+C 停止服务器
echo ==========================================
echo.

cd portfolio
npm run dev
