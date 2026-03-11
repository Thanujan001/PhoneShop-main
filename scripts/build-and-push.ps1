# PhoneShop Docker Build and Push Script (PowerShell)
# This script builds and pushes all three services to Docker Hub

param(
    [string]$DockerUsername = "thanujan001",
    [string]$BackendUrl = "http://localhost:5000",
    [string]$ImageTag = "latest"
)

Write-Host "`n╔════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   PhoneShop Docker Build & Push Script             ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  Docker Hub Username: $DockerUsername"
Write-Host "  Backend URL: $BackendUrl"
Write-Host "  Image Tag: $ImageTag`n"

# Check if Docker is running
Write-Host "[1/6] Checking Docker daemon..." -ForegroundColor Blue
$dockerCheck = docker info 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Docker daemon is running`n" -ForegroundColor Green
} else {
    Write-Host "✗ ERROR: Docker daemon not running!" -ForegroundColor Red
    exit 1
}

# Build Server Image
Write-Host "[2/6] Building server image..." -ForegroundColor Blue
Set-Location server
docker build -t "$DockerUsername/phoneshop-server:$ImageTag" .
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Server image built successfully`n" -ForegroundColor Green
} else {
    Write-Host "✗ ERROR: Failed to build server image" -ForegroundColor Red
    exit 1
}
Set-Location ..

# Build Client Image
Write-Host "[3/6] Building client image..." -ForegroundColor Blue
Set-Location client
docker build --build-arg VITE_BACKEND_URL="$BackendUrl" `
    -t "$DockerUsername/phoneshop-client:$ImageTag" .
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Client image built successfully`n" -ForegroundColor Green
} else {
    Write-Host "✗ ERROR: Failed to build client image" -ForegroundColor Red
    exit 1
}
Set-Location ..

# Build Admin Image
Write-Host "[4/6] Building admin image..." -ForegroundColor Blue
Set-Location admin
docker build --build-arg VITE_BACKEND_URL="$BackendUrl" `
    -t "$DockerUsername/phoneshop-admin:$ImageTag" .
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Admin image built successfully`n" -ForegroundColor Green
} else {
    Write-Host "✗ ERROR: Failed to build admin image" -ForegroundColor Red
    exit 1
}
Set-Location ..

# List built images
Write-Host "Images built:" -ForegroundColor Yellow
docker images | Select-String "phoneshop-"
Write-Host ""

# Check if logged in
Write-Host "[5/6] Checking Docker Hub login..." -ForegroundColor Blue
$loginCheck = docker info 2>&1 | Select-String "Username: $DockerUsername"
if ($loginCheck) {
    Write-Host "✓ Already logged in as $DockerUsername`n" -ForegroundColor Green
} else {
    Write-Host "Logging in to Docker Hub..." -ForegroundColor Yellow
    docker login -u "$DockerUsername"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ ERROR: Failed to login to Docker Hub" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
}

# Push images
Write-Host "[6/6] Pushing images to Docker Hub..." -ForegroundColor Blue
Write-Host ""

Write-Host "Pushing server image..." -ForegroundColor Yellow
docker push "$DockerUsername/phoneshop-server:$ImageTag"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Server image pushed successfully`n" -ForegroundColor Green
} else {
    Write-Host "✗ ERROR: Failed to push server image" -ForegroundColor Red
    exit 1
}

Write-Host "Pushing client image..." -ForegroundColor Yellow
docker push "$DockerUsername/phoneshop-client:$ImageTag"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Client image pushed successfully`n" -ForegroundColor Green
} else {
    Write-Host "✗ ERROR: Failed to push client image" -ForegroundColor Red
    exit 1
}

Write-Host "Pushing admin image..." -ForegroundColor Yellow
docker push "$DockerUsername/phoneshop-admin:$ImageTag"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Admin image pushed successfully`n" -ForegroundColor Green
} else {
    Write-Host "✗ ERROR: Failed to push admin image" -ForegroundColor Red
    exit 1
}

Write-Host "╔════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   ✓ ALL IMAGES PUSHED SUCCESSFULLY!               ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════╝`n" -ForegroundColor Green

Write-Host "Your images are now available on Docker Hub:" -ForegroundColor Yellow
Write-Host "  • https://hub.docker.com/r/$DockerUsername/phoneshop-server"
Write-Host "  • https://hub.docker.com/r/$DockerUsername/phoneshop-client"
Write-Host "  • https://hub.docker.com/r/$DockerUsername/phoneshop-admin`n"
