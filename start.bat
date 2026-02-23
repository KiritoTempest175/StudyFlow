@echo off
title StudyFlow - Starting All Services
color 0A

echo ============================================================
echo          StudyFlow - AI Study Companion Launcher
echo ============================================================
echo.

:: ---------------------------------------------------------------
:: 1. Resolve project root (wherever this .bat lives)
:: ---------------------------------------------------------------
set "PROJECT_ROOT=%~dp0"
cd /d "%PROJECT_ROOT%"

:: ---------------------------------------------------------------
:: 2. Create Python virtual-env if it doesn't exist yet
:: ---------------------------------------------------------------
if not exist "%PROJECT_ROOT%venv" (
    echo [1/5] Creating Python virtual environment ...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Could not create venv. Make sure Python is installed and on PATH.
        pause
        exit /b 1
    )
    echo       Virtual environment created successfully.
) else (
    echo [1/5] Virtual environment already exists - skipping creation.
)

echo.

:: ---------------------------------------------------------------
:: 3. Activate venv and install Python requirements
:: ---------------------------------------------------------------
echo [2/5] Installing Python dependencies ...
call "%PROJECT_ROOT%venv\Scripts\activate.bat"
pip install -r "%PROJECT_ROOT%backend\requirements.txt" --quiet
if errorlevel 1 (
    echo ERROR: pip install failed. Check requirements.txt for issues.
    pause
    exit /b 1
)
echo       Python dependencies installed.
echo.

:: ---------------------------------------------------------------
:: 4. Install Node dependencies for frontend & video-generation
:: ---------------------------------------------------------------
echo [3/5] Installing Node.js dependencies ...

cd /d "%PROJECT_ROOT%frontend"
if not exist "node_modules" (
    echo       Installing frontend dependencies ...
    call npm install --silent
) else (
    echo       Frontend node_modules found - skipping install.
)

cd /d "%PROJECT_ROOT%video-generation"
if not exist "node_modules" (
    echo       Installing video-generation dependencies ...
    call npm install --silent
) else (
    echo       Video-generation node_modules found - skipping install.
)

cd /d "%PROJECT_ROOT%"
echo       Node.js dependencies ready.
echo.

:: ---------------------------------------------------------------
:: 5. Launch all four services in separate windows
:: ---------------------------------------------------------------
echo [4/5] Starting all services ...
echo.

:: Service 1 - FastAPI Backend (port 8000)
echo       Starting Backend API on port 8000 ...
start "StudyFlow - Backend API (8000)" cmd /k "cd /d "%PROJECT_ROOT%" && call venv\Scripts\activate.bat && cd backend && python main.py"

:: Service 2 - Asset Microservice (port 5000)
echo       Starting Asset Microservice on port 5000 ...
start "StudyFlow - Asset Service (5000)" cmd /k "cd /d "%PROJECT_ROOT%" && call venv\Scripts\activate.bat && cd backend && python -m members.member3.service"

:: Service 3 - Next.js Frontend (port 3000)
echo       Starting Frontend on port 3000 ...
start "StudyFlow - Frontend (3000)" cmd /k "cd /d "%PROJECT_ROOT%frontend" && npm run dev"

:: Service 4 - Video Generation Server (port 3001)
echo       Starting Video Generation on port 3001 ...
start "StudyFlow - Video Engine (3001)" cmd /k "cd /d "%PROJECT_ROOT%video-generation" && npm run server"

echo.
echo ============================================================
echo   [5/5] All services launched!
echo ============================================================
echo.
echo   Backend API        : http://127.0.0.1:8000
echo   Asset Microservice : http://127.0.0.1:5000
echo   Frontend           : http://127.0.0.1:3000
echo   Video Engine       : http://127.0.0.1:3001
echo.
echo   Each service runs in its own window.
echo   Close this window or press any key to exit the launcher.
echo ============================================================
pause
