@echo off
chcp 65001 >nul
echo ==========================================
echo   Portfolio Website - Netlify 部署指南
echo ==========================================
echo.
echo 你的代码已推送到 GitHub:
echo   https://github.com/wsqwsq2003/portfolio-website
echo.
echo 部署步骤:
echo.
echo 1. 打开 https://app.netlify.com/start
echo.
echo 2. 点击 "New site from Git"
echo.
echo 3. 选择 "GitHub" 并授权
echo.
echo 4. 选择仓库: portfolio-website
echo.
echo 5. 配置构建设置:
echo    - Build command: cd portfolio ^&^& npm install ^&^& npm run build
echo    - Publish directory: portfolio/dist
echo.
echo 6. 点击 "Deploy site"
echo.
echo 7. 部署完成后,复制你的 Netlify URL
echo    (格式: https://your-site-name.netlify.app)
echo.
echo ==========================================
echo 提示: 部署后需要更新后端 URL
echo ==========================================
echo.
echo 完成后告诉我你的 Netlify URL,我会帮你配置后端连接!
echo.
pause
