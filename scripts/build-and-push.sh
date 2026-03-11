#!/bin/bash

# PhoneShop Docker Build and Push Script
# This script builds and pushes all three services to Docker Hub

# Configuration
DOCKER_USERNAME="${1:-thanujan001}"
BACKEND_URL="${2:-http://localhost:5000}"
IMAGE_TAG="latest"

echo "╔════════════════════════════════════════════════════╗"
echo "║   PhoneShop Docker Build & Push Script             ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""
echo "Configuration:"
echo "  Docker Hub Username: $DOCKER_USERNAME"
echo "  Backend URL: $BACKEND_URL"
echo "  Image Tag: $IMAGE_TAG"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Docker is running
echo -e "${BLUE}[1/6]${NC} Checking Docker daemon..."
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}ERROR: Docker daemon not running!${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker daemon is running${NC}"
echo ""

# Build Server Image
echo -e "${BLUE}[2/6]${NC} Building server image..."
cd server
if docker build -t "$DOCKER_USERNAME/phoneshop-server:$IMAGE_TAG" .; then
    echo -e "${GREEN}✓ Server image built successfully${NC}"
else
    echo -e "${RED}ERROR: Failed to build server image${NC}"
    exit 1
fi
cd ..
echo ""

# Build Client Image
echo -e "${BLUE}[3/6]${NC} Building client image..."
cd client
if docker build --build-arg VITE_BACKEND_URL="$BACKEND_URL" \
    -t "$DOCKER_USERNAME/phoneshop-client:$IMAGE_TAG" .; then
    echo -e "${GREEN}✓ Client image built successfully${NC}"
else
    echo -e "${RED}ERROR: Failed to build client image${NC}"
    exit 1
fi
cd ..
echo ""

# Build Admin Image
echo -e "${BLUE}[4/6]${NC} Building admin image..."
cd admin
if docker build --build-arg VITE_BACKEND_URL="$BACKEND_URL" \
    -t "$DOCKER_USERNAME/phoneshop-admin:$IMAGE_TAG" .; then
    echo -e "${GREEN}✓ Admin image built successfully${NC}"
else
    echo -e "${RED}ERROR: Failed to build admin image${NC}"
    exit 1
fi
cd ..
echo ""

# List built images
echo -e "${YELLOW}Images built:${NC}"
docker images | grep "phoneshop-"
echo ""

# Check if logged in
echo -e "${BLUE}[5/6]${NC} Checking Docker Hub login..."
if docker info 2>/dev/null | grep -q "Username: $DOCKER_USERNAME"; then
    echo -e "${GREEN}✓ Already logged in as $DOCKER_USERNAME${NC}"
else
    echo -e "${YELLOW}Not logged in. Please log in:${NC}"
    docker login -u "$DOCKER_USERNAME"
    if [ $? -ne 0 ]; then
        echo -e "${RED}ERROR: Failed to login to Docker Hub${NC}"
        exit 1
    fi
fi
echo ""

# Push images
echo -e "${BLUE}[6/6]${NC} Pushing images to Docker Hub..."
echo ""

echo "Pushing server image..."
if docker push "$DOCKER_USERNAME/phoneshop-server:$IMAGE_TAG"; then
    echo -e "${GREEN}✓ Server image pushed successfully${NC}"
else
    echo -e "${RED}ERROR: Failed to push server image${NC}"
    exit 1
fi
echo ""

echo "Pushing client image..."
if docker push "$DOCKER_USERNAME/phoneshop-client:$IMAGE_TAG"; then
    echo -e "${GREEN}✓ Client image pushed successfully${NC}"
else
    echo -e "${RED}ERROR: Failed to push client image${NC}"
    exit 1
fi
echo ""

echo "Pushing admin image..."
if docker push "$DOCKER_USERNAME/phoneshop-admin:$IMAGE_TAG"; then
    echo -e "${GREEN}✓ Admin image pushed successfully${NC}"
else
    echo -e "${RED}ERROR: Failed to push admin image${NC}"
    exit 1
fi
echo ""

echo "╔════════════════════════════════════════════════════╗"
echo -e "║   ${GREEN}✓ ALL IMAGES PUSHED SUCCESSFULLY!${NC}         ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""
echo "Your images are now available on Docker Hub:"
echo "  • https://hub.docker.com/r/$DOCKER_USERNAME/phoneshop-server"
echo "  • https://hub.docker.com/r/$DOCKER_USERNAME/phoneshop-client"
echo "  • https://hub.docker.com/r/$DOCKER_USERNAME/phoneshop-admin"
echo ""
