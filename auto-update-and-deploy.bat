@echo off
echo ========================================
echo   Skills Assistant - 自動化更新部署流程
echo ========================================
echo.

cd /d "C:\Users\ntpud\.claude\projects\skills-assistant"

echo [Step 1/5] 掃描所有專案並生成索引...
node scan-all-projects.js
if %errorlevel% neq 0 (
    echo ❌ 掃描失敗！
    pause
    exit /b 1
)
echo ✅ 掃描完成

echo.
echo [Step 2/5] 檢查 Git 狀態...
git status
if %errorlevel% neq 0 (
    echo ❌ Git 狀態檢查失敗！
    pause
    exit /b 1
)

echo.
echo [Step 3/5] 提交變更到 Git...
git add all-projects-index.json
git add project-detail.html
git add all-projects-progress.html
git commit -m "auto: update project data %date:~0,4%-%date:~5,2%-%date:~8,2% %time:~0,2%:%time:~3,2%"
if %errorlevel% neq 0 (
    echo ⚠️ 沒有新變更需要提交，或提交失敗
) else (
    echo ✅ 變更已提交
)

echo.
echo [Step 4/5] 推送到 GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo ❌ 推送失敗！請檢查網絡連接或 Git 設置
    pause
    exit /b 1
)
echo ✅ 推送完成

echo.
echo [Step 5/5] 等待 Vercel 自動部署...
echo 📦 Vercel 將自動檢測到變更並重新部署
echo 🔗 查看部署狀態: https://vercel.com/dashboard
echo 🌐 訪問更新後的網站: https://skills-assistant.vercel.app
echo.
echo ✅ 自動化流程完成！
echo.
pause