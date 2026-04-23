@echo off
echo ========================================
echo Starting Portfolio Full-Stack Application
echo ========================================
echo.

REM Start backend in new window
echo Starting backend server...
start "Backend - Spring Boot" cmd /k "cd backend && mvn spring-boot:run"

REM Wait for backend to start
echo Waiting for backend to start...
timeout /t 15 /nobreak > nul

REM Start frontend
echo Starting frontend dev server...
cd portfolio
start "Frontend - Vite" cmd /k "npm run dev"

echo.
echo ========================================
echo Application started successfully!
echo ========================================
echo.
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
echo H2 Console: http://localhost:8080/h2-console
echo.
echo Press any key to exit...
pause > nul
