@echo off
title Tool Luyen Nghe & Transcript Tieng Anh (Kem Whisper AI)
chcp 65001 >nul
echo ========================================================
echo   🎧 ĐANG KHỞI ĐỘNG FULL HỆ THỐNG (WEB + WHISPER AI)
echo ========================================================
echo.
echo [1/3] Đang khởi động AI Server Whisper (Port 5001)...
start "Whisper AI Engine" cmd /k "python server\transcribe_server.py"

echo [2/3] Đang chuẩn bị mở trình duyệt...
start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:5173"

echo [3/3] Đang chạy Web Dev Server (Vite)...
echo Link truy cập: http://localhost:5173
echo.
npm run dev
pause
