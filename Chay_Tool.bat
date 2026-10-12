@echo off
title Tool Luyen Nghe & Transcript Tieng Anh
chcp 65001 >nul
echo ========================================================
echo   🎧 ĐANG KHỞI ĐỘNG TOOL TRANSCRIPT TIẾNG ANH
echo ========================================================
echo.
echo [1/2] Đang chuẩn bị mở trình duyệt...
start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:5173"

echo [2/2] Đang chạy Web Dev Server (Vite)...
echo Link truy cập: http://localhost:5173
echo.
npm run dev
pause
