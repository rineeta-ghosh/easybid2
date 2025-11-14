@echo off
setlocal EnableDelayedExpansion

echo.
echo =============================================
echo    EasyBid Platform Deployment Script
echo =============================================
echo.

if "%1"=="" (
    echo Usage: deploy.bat [railway^|vercel^|docker^|heroku]
    echo.
    echo Available deployment methods:
    echo   railway - Deploy to Railway ^(Recommended^)
    echo   vercel  - Deploy to Vercel
    echo   docker  - Run with Docker locally
    echo   heroku  - Deploy to Heroku
    echo.
    pause
    exit /b 1
)

set DEPLOYMENT_METHOD=%1

if "%DEPLOYMENT_METHOD%"=="railway" (
    echo [INFO] Deploying to Railway...
    
    rem Check if Railway CLI is installed
    railway --version >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] Railway CLI not found. Installing...
        npm install -g @railway/cli
    )
    
    rem Deploy backend
    echo [INFO] Deploying backend...
    cd backend
    call railway login
    call railway init --name easybid-backend
    call railway add mongodb
    call railway deploy
    
    rem Deploy frontend
    echo [INFO] Deploying frontend...
    cd ..\frontend
    call railway init --name easybid-frontend
    call railway deploy
    
    echo [SUCCESS] Deployment to Railway completed!
    
) else if "%DEPLOYMENT_METHOD%"=="vercel" (
    echo [INFO] Deploying to Vercel...
    
    rem Check if Vercel CLI is installed
    vercel --version >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] Vercel CLI not found. Installing...
        npm install -g vercel
    )
    
    rem Deploy backend
    echo [INFO] Deploying backend...
    cd backend
    call vercel --prod
    
    rem Deploy frontend
    echo [INFO] Deploying frontend...
    cd ..\frontend
    call vercel --prod
    
    echo [SUCCESS] Deployment to Vercel completed!
    
) else if "%DEPLOYMENT_METHOD%"=="docker" (
    echo [INFO] Deploying with Docker...
    
    rem Check if Docker is installed
    docker --version >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] Docker not found. Please install Docker first.
        pause
        exit /b 1
    )
    
    rem Build and run with Docker Compose
    echo [INFO] Building and starting containers...
    docker-compose down
    docker-compose up --build -d
    
    echo [SUCCESS] Docker deployment completed!
    echo [INFO] Application available at:
    echo [INFO] Frontend: http://localhost:3000
    echo [INFO] Backend: http://localhost:5000
    
) else if "%DEPLOYMENT_METHOD%"=="heroku" (
    echo [INFO] Deploying to Heroku...
    
    rem Check if Heroku CLI is installed
    heroku --version >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] Heroku CLI not found. Please install Heroku CLI first.
        pause
        exit /b 1
    )
    
    rem Deploy backend
    echo [INFO] Deploying backend...
    cd backend
    set /a TIMESTAMP=%RANDOM% * 32768 + %RANDOM%
    call heroku create easybid-backend-!TIMESTAMP!
    call heroku addons:create mongolab:sandbox
    git init
    git add .
    git commit -m "Initial backend deployment"
    git push heroku main
    
    rem Deploy frontend
    echo [INFO] Deploying frontend...
    cd ..\frontend
    set /a TIMESTAMP=%RANDOM% * 32768 + %RANDOM%
    call heroku create easybid-frontend-!TIMESTAMP!
    call heroku buildpacks:set mars/create-react-app
    git init
    git add .
    git commit -m "Initial frontend deployment"
    git push heroku main
    
    echo [SUCCESS] Deployment to Heroku completed!
    
) else (
    echo [ERROR] Unknown deployment method: %DEPLOYMENT_METHOD%
    echo Available methods: railway, vercel, docker, heroku
    pause
    exit /b 1
)

echo.
echo =============================================
echo   EasyBid Platform deployment completed!
echo =============================================
echo.
echo Don't forget to:
echo 1. Configure environment variables
echo 2. Set up your database
echo 3. Update CORS settings
echo 4. Test all features
echo.

pause