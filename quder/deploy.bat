@echo off
chcp 65001 >nul
echo ========================================
echo   全栈项目一键部署助手
echo ========================================
echo.
echo 此脚本将指导你完成部署流程
echo.
echo 部署架构：
echo   前端：Netlify (CDN 加速)
echo   后端：Render (免费托管)
echo.
pause

echo.
echo ========================================
echo   第一步：部署后端到 Render
echo ========================================
echo.
echo 请在浏览器中完成以下步骤：
echo.
echo 1. 访问 https://render.com
echo 2. 使用 GitHub 账号登录
echo 3. 点击 "New +" ^> "Web Service"
echo 4. 连接仓库: Wangshou123/qqqqq-demo
echo 5. 配置以下信息：
echo    - Root Directory: backend
echo    - Build Command: mvn clean package -DskipTests
echo    - Start Command: java -jar target/*.jar
echo    - 环境变量:
echo      PORT=8080
echo      JAVA_OPTS=-Xmx512m
echo    - 健康检查路径: /api/portfolio/health
echo 6. 点击 "Create Web Service"
echo 7. 等待 3-5 分钟部署完成
echo.
echo 部署成功后，复制你的后端 URL
echo 格式：https://portfolio-backend-xxxx.onrender.com
echo.
pause

echo.
echo ========================================
echo   第二步：配置前端环境变量
echo ========================================
echo.
set /p BACKEND_URL="请输入你的后端 URL (例如 https://portfolio-backend-xxxx.onrender.com): "
echo.

:: 创建 .env.production 文件
echo # Production environment variables > portfolio\.env.production
echo VITE_API_URL=%BACKEND_URL%/api >> portfolio\.env.production
echo VITE_WS_URL=%BACKEND_URL%/ws >> portfolio\.env.production

echo ✓ 已创建 portfolio\.env.production
echo.
echo 内容如下：
type portfolio\.env.production
echo.
pause

echo.
echo ========================================
echo   第三步：提交环境变量配置
echo ========================================
echo.
echo 请在命令行中执行以下命令：
echo.
echo cd c:\Users\17988\Desktop\quder
echo git add portfolio\.env.production
echo git commit -m "update: 配置生产环境 API 和 WebSocket URL"
echo git push
echo.
echo 是否现在执行？(Y/N)
set /p EXECUTE=
if /i "%EXECUTE%"=="Y" (
    cd portfolio
    git add .env.production
    git commit -m "update: 配置生产环境 API 和 WebSocket URL"
    git push
    cd ..
    echo.
    echo ✓ 代码已推送
) else (
    echo 请手动执行上述命令
)
echo.
pause

echo.
echo ========================================
echo   第四步：部署前端到 Netlify
echo ========================================
echo.
echo 请在浏览器中完成以下步骤：
echo.
echo 1. 访问 https://netlify.com
echo 2. 使用 GitHub 账号登录
echo 3. 点击 "Add new site" ^> "Import an existing project"
echo 4. 选择仓库: Wangshou123/qqqqq-demo
echo 5. Netlify 会自动读取 netlify.toml 配置
echo 6. 确认配置：
echo    - Build command: cd portfolio ^&^& npm install ^&^& npm run build
echo    - Publish directory: portfolio/dist
echo 7. 点击 "Deploy site"
echo 8. 等待 1-2 分钟
echo.
echo 部署成功后，你的网站 URL 为：
echo https://your-site-name.netlify.app
echo.
pause

echo.
echo ========================================
echo   部署完成！
echo ========================================
echo.
echo 你的网站已经部署到互联网
echo.
echo 访问地址：
echo   前台展示: https://your-site-name.netlify.app
echo   管理后台: https://your-site-name.netlify.app/#/admin
echo.
echo 测试实时同步功能：
echo   1. 打开两个浏览器窗口
echo   2. 一个访问前台，一个访问管理后台
echo   3. 在管理后台修改内容并保存
echo   4. 前台应该自动更新
echo.
echo 如需帮助，请查看 DEPLOYMENT_GUIDE.md 文件
echo.
pause
