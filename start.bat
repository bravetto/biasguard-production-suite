@echo off
REM BiasGuard Code Development Server Startup Script (Windows)
REM Cross-platform development server launcher for Windows

echo 🚀 Starting BiasGuard Code Development Environment
echo =================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed
    echo Please install Node.js 16+ from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if package.json exists
if not exist "package.json" (
    echo ❌ package.json not found
    echo Please run this script from the project root directory
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing development dependencies...
    call npm run setup
    if %errorlevel% neq 0 (
        echo ⚠️  Failed to install WebSocket dependency, falling back to basic server
    )
) else if not exist "node_modules\ws\package.json" (
    echo 📦 Installing WebSocket dependency...
    call npm run setup
)

REM Check if index.html exists
if not exist "index.html" (
    echo ❌ index.html not found
    echo Please ensure the landing page file exists
    pause
    exit /b 1
)

REM Display system information
echo 📋 System Information:
node --version | findstr /C:"v" >nul && (
    for /f "tokens=*" %%i in ('node --version') do echo    Node.js: %%i
)
npm --version | findstr /R "[0-9]" >nul && (
    for /f "tokens=*" %%i in ('npm --version') do echo    NPM: %%i
)
echo    OS: Windows
echo    Directory: %cd%
echo.

REM Start the development server
echo 🔄 Starting development server with live reload...
echo Press Ctrl+C to stop the server
echo.

REM Try to start the Node.js dev server
call npm run dev
if %errorlevel% neq 0 (
    echo ⚠️  Node.js dev server failed, trying alternatives...
    
    REM Try npx serve
    where npx >nul 2>&1
    if %errorlevel% equ 0 (
        echo 🔄 Trying npx serve...
        npx serve -s . -l 3000
    ) else (
        REM Try Python 3
        where python >nul 2>&1
        if %errorlevel% equ 0 (
            echo 🔄 Trying Python server...
            echo ⚠️  Live reload not available with Python server
            python -m http.server 3000
        ) else (
            echo ❌ No suitable server found
            echo Please install Node.js or Python
            echo Or install serve globally: npm install -g serve
            pause
            exit /b 1
        )
    )
)

pause 