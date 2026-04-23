@echo off
chcp 65001 >nul
cls
echo.
echo ================================================
echo          Netlify 前端部署助手
echo ================================================
echo.
echo 部署前请确认：
echo   ✓ 代码已推送到 GitHub
echo   ✓ Render 后端已部署（或已有后端 URL）
echo   ✓ portfolio/.env.production 已配置后端 URL
echo.
echo ================================================
echo.
echo 请在浏览器中完成以下步骤：
echo.
echo 1. 访问: https://app.netlify.com/start
echo.
echo 2. 点击 "Let's deploy" 或 "New site from Git"
echo.
echo 3. 选择 GitHub 作为 Git provider
echo    - 点击 GitHub 图标
echo    - 授权 Netlify 访问你的 GitHub 账号
echo.
echo 4. 选择仓库
echo    - 搜索: portfolio-website
echo    - 选择: wsqwsq2003/portfolio-website
echo.
echo 5. 配置构建设置
echo    Netlify 会自动读取 netlify.toml，确认：
echo    - Build command: cd portfolio ^&^& npm install ^&^& npm run build
echo    - Publish directory: portfolio/dist
echo.
echo 6. 点击 "Deploy site"
echo.
echo 7. 等待 1-2 分钟完成部署
echo.
echo 8. 复制你的网站 URL
echo    格式：https://your-site-name.netlify.app
echo.
echo ================================================
echo.

set /p OPEN_NETLIFY="是否现在打开 Netlify？(Y/N): "
if /i "%OPEN_NETLIFY%"=="Y" (
    start https://app.netlify.com/start
    echo.
    echo ✓ Netlify 已在浏览器中打开
    echo.
    echo 按照上述步骤完成部署
    echo.
    echo 部署完成后，告诉我你的网站 URL
    echo 我会帮你测试实时同步功能
)

echo.
pause
