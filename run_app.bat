@echo off
setlocal
cd /d "%~dp0"

echo Starting TweetVerse...

:: 1. Start Backend
echo Starting Backend on port 8000...
cd backend
start "TweetVerse Backend" cmd /k ".\\venv\\Scripts\\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

:: 2. Wait for backend to initialize
timeout /t 6 /nobreak > nul

:: 3. Start Frontend
echo Starting Frontend...
cd ..\frontend
start "TweetVerse Frontend" cmd /k "npm run dev -- --port 5173"

:: 4. Wait for Vite to compile, then open browser
echo Opening browser...
timeout /t 7 /nobreak > nul
start http://localhost:5173

echo Done! Backend at http://localhost:8000 - Frontend at http://localhost:5173
pause
