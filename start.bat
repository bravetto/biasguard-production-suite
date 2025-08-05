@echo off
REM BiasGuard Code Development Server (Windows)

echo 🚀 Starting BiasGuard Code
echo ========================

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found
    echo Install from https://nodejs.org/
    pause
    exit /b 1
)

REM Install dependencies
if not exist "node_modules\ws" (
    echo 📦 Installing dependencies...
    call npm run setup
)

REM Start server
echo 🔄 Starting server...
call npm run dev
if %errorlevel% neq 0 (
    echo ⚠️  Trying fallback...
        npx serve -s . -l 3009 || python -m http.server 3009
)

pause 