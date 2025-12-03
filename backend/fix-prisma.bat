@echo off
echo ========================================
echo Fixing Prisma Client Generation Error
echo ========================================
echo.
echo Step 1: Stopping all Node processes...
taskkill /F /IM node.exe 2>nul
if %errorlevel% equ 0 (
    echo Node processes stopped successfully.
) else (
    echo No Node processes found or already stopped.
)
echo.
timeout /t 2 /nobreak >nul
echo Step 2: Running Prisma database push...
call npx prisma db push
if %errorlevel% neq 0 (
    echo Database push failed. Please check the error above.
    pause
    exit /b 1
)
echo.
echo Step 3: Generating Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo Prisma client generation failed. Please check the error above.
    pause
    exit /b 1
)
echo.
echo ========================================
echo Success! Prisma setup complete.
echo ========================================
echo.
echo You can now start the server with: npm run dev
pause

