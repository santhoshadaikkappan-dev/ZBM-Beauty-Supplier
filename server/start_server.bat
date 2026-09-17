@echo off
title ZANDRA BEAUTY MATRIX (ZBM) - B2B Auth Server
cd /d "%~dp0"

echo ========================================================
echo   ZANDRA BEAUTY MATRIX (ZBM) - B2B AUTHENTICATION SERVER
echo ========================================================

set "NODE_EXE=C:\Users\Admin\.gemini\antigravity\scratch\nodejs\node.exe"
set "NPM_CMD=C:\Users\Admin\.gemini\antigravity\scratch\nodejs\npm.cmd"

if not exist "%NODE_EXE%" (
    where node >nul 2>&1
    if %errorlevel% equ 0 (
        set "NODE_EXE=node"
        set "NPM_CMD=npm"
    ) else (
        echo [ERROR] Node.js executable not found!
        pause
        exit /b 1
    )
)

if not exist "node_modules" (
    echo [INFO] Installing backend dependencies (express, bcryptjs, sqlite3, cors, jsonwebtoken)...
    call "%NPM_CMD%" install --no-audit --no-fund
)

echo [INFO] Starting ZBM Authentication Server on http://localhost:5000...
"%NODE_EXE%" server.js

pause
