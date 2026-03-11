@echo off
REM PhoneShop Docker Build and Push Script (Batch)

setlocal enabledelayedexpansion

set DOCKER_USERNAME=thanujan001
set BACKEND_URL=http://localhost:3000
set IMAGE_TAG=latest

echo.
echo ════════════════════════════════════════════════════
echo    PhoneShop Docker Build ^& Push Script
echo ════════════════════════════════════════════════════
echo.
echo Configuration:
echo   Docker Hub Username: %DOCKER_USERNAME%
echo   Backend URL: %BACKEND_URL%
echo   Image Tag: %IMAGE_TAG%
echo.

REM Check if Docker is running
echo [1/6] Checking Docker daemon...
docker info >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERROR: Docker daemon not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)
echo ✓ Docker daemon is running
echo.

REM Build Server Image
echo [2/6] Building server image...
cd server
docker build -t "%DOCKER_USERNAME%/phoneshop-server:%IMAGE_TAG%" .
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to build server image
    pause
    exit /b 1
)
echo ✓ Server image built successfully
cd ..
echo.

REM Build Client Image
echo [3/6] Building client image...
cd client
docker build --build-arg VITE_BACKEND_URL="%BACKEND_URL%" ^
    -t "%DOCKER_USERNAME%/phoneshop-client:%IMAGE_TAG%" .
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to build client image
    pause
    exit /b 1
)
echo ✓ Client image built successfully
cd ..
echo.

REM Build Admin Image
echo [4/6] Building admin image...
cd admin
docker build --build-arg VITE_BACKEND_URL="%BACKEND_URL%" ^
    -t "%DOCKER_USERNAME%/phoneshop-admin:%IMAGE_TAG%" .
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to build admin image
    pause
    exit /b 1
)
echo ✓ Admin image built successfully
cd ..
echo.

REM List built images
echo Images built:
docker images | find "phoneshop-"
echo.

REM Login to Docker Hub
echo [5/6] Logging in to Docker Hub...
docker login -u "%DOCKER_USERNAME%"
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to login to Docker Hub
    pause
    exit /b 1
)
echo.

REM Push images
echo [6/6] Pushing images to Docker Hub...
echo.

echo Pushing server image...
docker push "%DOCKER_USERNAME%/phoneshop-server:%IMAGE_TAG%"
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to push server image
    pause
    exit /b 1
)
echo ✓ Server image pushed successfully
echo.

echo Pushing client image...
docker push "%DOCKER_USERNAME%/phoneshop-client:%IMAGE_TAG%"
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to push client image
    pause
    exit /b 1
)
echo ✓ Client image pushed successfully
echo.

echo Pushing admin image...
docker push "%DOCKER_USERNAME%/phoneshop-admin:%IMAGE_TAG%"
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to push admin image
    pause
    exit /b 1
)
echo ✓ Admin image pushed successfully
echo.

echo ════════════════════════════════════════════════════
echo    ALL IMAGES PUSHED SUCCESSFULLY!
echo ════════════════════════════════════════════════════
echo.
echo Your images are now available on Docker Hub:
echo   • hub.docker.com/r/%DOCKER_USERNAME%/phoneshop-server
echo   • hub.docker.com/r/%DOCKER_USERNAME%/phoneshop-client
echo   • hub.docker.com/r/%DOCKER_USERNAME%/phoneshop-admin
echo.
pause
