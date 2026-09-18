@echo off
title ZBM Beauty Matrix - Push to GitHub
color 0A
echo =======================================================
echo   ZANDRA BEAUTY MATRIX (ZBM) - GITHUB DEPLOYER
echo =======================================================
echo.
echo Target Repository:
echo https://github.com/santhoshadaikkappan-dev/ZBM-Beauty-Supplier
echo.
echo Pushing 202 product images, catalogue code, and Vercel setup...
echo.

cd /d "C:\Users\Admin\.gemini\antigravity\scratch\zbm-catalogue"

"C:\Users\Admin\.gemini\antigravity\scratch\git\cmd\git.exe" remote remove origin >nul 2>&1
"C:\Users\Admin\.gemini\antigravity\scratch\git\cmd\git.exe" remote add origin https://github.com/santhoshadaikkappan-dev/ZBM-Beauty-Supplier.git
"C:\Users\Admin\.gemini\antigravity\scratch\git\cmd\git.exe" branch -M main

echo If a browser window opens, please click "Sign in with your browser" to approve GitHub.
echo.

"C:\Users\Admin\.gemini\antigravity\scratch\git\cmd\git.exe" push -u origin main --force

echo.
if %ERRORLEVEL% equ 0 (
    echo =======================================================
    echo SUCCESS! All files are now in your GitHub repository!
    echo Refresh your GitHub page to see all 202 products.
    echo =======================================================
) else (
    echo =======================================================
    echo If GitHub asked for credentials, please enter your
    echo GitHub Username and Personal Access Token (PAT).
    echo =======================================================
)

echo.
pause
