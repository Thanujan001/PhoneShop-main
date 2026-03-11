# 🐳 Docker Build & Push Guide - PhoneShop

This guide will help you build Docker images for all three PhoneShop services and push them to Docker Hub.

## 📋 Prerequisites

Before starting, make sure you have:

1. **Docker Desktop Installed** - [Download Docker Desktop](https://www.docker.com/products/docker-desktop)
2. **Docker Hub Account** - [Create account](https://hub.docker.com)
3. **Docker Hub API Token** - [Generate token](https://hub.docker.com/settings/security)
4. **Terminal/PowerShell** - Ready to run commands

## 🚀 Quick Start (3 Steps)

### Step 1: Start Docker Desktop
- Open Docker Desktop application
- Wait for it to fully start (you'll see "Docker Desktop is running")

### Step 2: Log in to Docker Hub
```bash
docker login -u YOUR_USERNAME -p YOUR_TOKEN
```

Replace:
- `YOUR_USERNAME` with your Docker Hub username (e.g., `thanujan001`)
- `YOUR_TOKEN` with your Docker Hub Personal Access Token

### Step 3: Build and Push Images
Choose one method below:

#### Method A: Automated Script (Recommended)

**Windows (Batch):**
```bash
cd g:\Projects\PhoneShop-main
scripts\build-and-push.bat
```

**Linux/Mac (Bash):**
```bash
cd /path/to/PhoneShop-main
bash scripts/build-and-push.sh
```

#### Method B: Manual Commands

**Build Server Image:**
```bash
cd server
docker build -t thanujan001/phoneshop-server:latest .
cd ..
```

**Build Client Image:**
```bash
cd client
docker build --build-arg VITE_BACKEND_URL=http://localhost:3000 \
    -t thanujan001/phoneshop-client:latest .
cd ..
```

**Build Admin Image:**
```bash
cd admin
docker build --build-arg VITE_BACKEND_URL=http://localhost:3000 \
    -t thanujan001/phoneshop-admin:latest .
cd ..
```

**Push All Images:**
```bash
docker push thanujan001/phoneshop-server:latest
docker push thanujan001/phoneshop-client:latest
docker push thanujan001/phoneshop-admin:latest
```

---

## 📊 What Gets Built

### 1. Server Image
```
thanujan001/phoneshop-server:latest
```
- **Base:** Node.js 18 Alpine
- **Port:** 5000
- **Size:** ~300MB
- **Entrypoint:** `node index.js`

### 2. Client Image
```
thanujan001/phoneshop-client:latest
```
- **Base:** Nginx Alpine (multi-stage)
- **Port:** 80 (serves frontend on 3000)
- **Size:** ~50MB
- **Built with:** Vite
- **Arg:** `VITE_BACKEND_URL` - Backend API URL

### 3. Admin Image
```
thanujan001/phoneshop-admin:latest
```
- **Base:** Nginx Alpine (multi-stage)
- **Port:** 80 (serves admin on 3001)
- **Size:** ~50MB
- **Built with:** Vite
- **Arg:** `VITE_BACKEND_URL` - Backend API URL

---

## 🔧 Configuration Options

### Change Backend URL

When building client and admin images, change the `VITE_BACKEND_URL`:

**Development:**
```bash
docker build --build-arg VITE_BACKEND_URL=http://localhost:5000 \
    -t thanujan001/phoneshop-client:latest ./client
```

**Production:**
```bash
docker build --build-arg VITE_BACKEND_URL=https://api.phoneshop.com \
    -t thanujan001/phoneshop-client:latest ./client
```

**Staging:**
```bash
docker build --build-arg VITE_BACKEND_URL=https://staging-api.phoneshop.com \
    -t thanujan001/phoneshop-client:latest ./client
```

### Change Image Tag

Use different tags for different versions:

```bash
# Development
docker build -t thanujan001/phoneshop-server:dev ./server

# Production
docker build -t thanujan001/phoneshop-server:v1.0.0 ./server

# Specific build number
docker build -t thanujan001/phoneshop-server:build-42 ./server
```

---

## 📤 Pushing to Docker Hub

### Push to Default Tag
```bash
docker push thanujan001/phoneshop-server:latest
```

### Push All Tags
After building with multiple tags:
```bash
docker push thanujan001/phoneshop-server --all-tags
```

### Create Additional Tags
```bash
# After pushing 'latest'
docker tag thanujan001/phoneshop-server:latest thanujan001/phoneshop-server:v1.0
docker push thanujan001/phoneshop-server:v1.0
```

---

## 🔍 Verify Images

### List Local Images
```bash
docker images | grep phoneshop
```

Output should show:
```
thanujan001/phoneshop-server    latest    XXXXXXXXX    100MB
thanujan001/phoneshop-client    latest    YYYYYYYYY    50MB
thanujan001/phoneshop-admin     latest    ZZZZZZZZZ    50MB
```

### View Image Details
```bash
# Image size
docker images thanujan001/phoneshop-server

# Image info
docker inspect thanujan001/phoneshop-server:latest

# Image history
docker history thanujan001/phoneshop-server:latest
```

### Test Local Image
```bash
# Run server
docker run -p 5000:5000 thanujan001/phoneshop-server:latest

# Run client
docker run -p 3000:80 thanujan001/phoneshop-client:latest

# Run admin
docker run -p 3001:80 thanujan001/phoneshop-admin:latest
```

---

## 🆘 Troubleshooting

### Docker Daemon Not Running
**Error:** `Cannot connect to Docker daemon`

**Solution:**
1. Open Docker Desktop application
2. Wait for it to fully start
3. Check system tray for Docker icon - should show "Docker is running"
4. Try command again

### Login Failed
**Error:** `error during connect: denied: invalid username/password`

**Solution:**
```bash
# Try with username and password separately
docker login

# Or use token directly
docker login -u YOUR_USERNAME
# Paste token when prompted

# Or create new token
# Docker Hub → Account Settings → Security → New Access Token
```

### Image Build Failed
**Error:** `failed to solve with frontend dockerfile.v0`

**Possible causes:**
1. Dockerfile syntax error - check file formatting
2. Missing files - ensure all dependencies exist
3. Build argument issue - check VITE_BACKEND_URL format
4. Network issue - check internet connection

**Solution:**
```bash
# Build with verbose output
docker build --progress=plain -t test:1.0 ./server

# Check Dockerfile syntax
docker build --no-cache -t test:1.0 ./server

# Verify working directory
ls -la server/  # Check files exist
```

### Push Failed
**Error:** `denied: requested access to the resource is denied`

**Possible causes:**
1. Not logged in - run `docker login`
2. Low storage quota on Docker Hub - upgrade plan
3. Repository name wrong - should be lowercase
4. Rate limited - wait before retrying

**Solution:**
```bash
# Verify login
docker logout
docker login -u USERNAME

# Use lowercase username
docker tag image:latest username/image:latest

# Check Docker Hub quota
# Docker Hub → Account Settings → Billing
```

### Network Issues
**Error:** `error pulling image: ...`

**Solution:**
```bash
# Check internet connection
ping google.com

# Try different registry
docker info

# Restart Docker daemon
# Quit and reopen Docker Desktop
```

---

## 📈 Best Practices

### 1. Use Specific Tags
```bash
# Good
docker build -t thanujan001/phoneshop-server:v1.0.0 ./server

# Less good
docker build -t thanujan001/phoneshop-server:latest ./server
```

### 2. Include Build Date
```bash
docker build --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
    -t thanujan001/phoneshop-server:latest ./server
```

### 3. Minimize Image Size
- Use Alpine as base (vs full Ubuntu)
- Multi-stage builds (client and admin already do this)
- Remove unnecessary files
- Current sizes:
  - Server: ~300MB
  - Client: ~50MB
  - Admin: ~50MB

### 4. Security Scanning
```bash
# Scan image for vulnerabilities
docker scout cves thanujan001/phoneshop-server:latest

# Or in Docker Desktop:
# Images → Right-click → Scan for vulnerabilities
```

### 5. Automated Builds
Use the Jenkinsfile pipeline instead of manual builds:
- Automatic on every git push
- Consistent builds
- Better tracking
- See: `docs/Jenkins-Pipeline-Setup.md`

---

## 🎯 Next Steps

After pushing images to Docker Hub:

1. **Deploy to Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Deploy to AWS ECS**
   - Update task definitions with image URLs
   - Update services to use new images
   - See: `docs/Jenkins-Pipeline-Setup.md`

3. **Run Tests**
   ```bash
   # Server health check
   curl http://localhost:5000/health

   # Client health check
   curl http://localhost:3000

   # Admin health check
   curl http://localhost:3001
   ```

4. **Monitor Deployment**
   - Check container logs
   - Monitor CPU/memory usage
   - Check application health

---

## 📚 Related Documentation

- [Jenkinsfile Documentation](../docs/Jenkins-Pipeline-Setup.md)
- [Docker Compose Configuration](../docker-compose.yml)
- [Server Dockerfile](../server/Dockerfile)
- [Client Dockerfile](../client/Dockerfile)
- [Admin Dockerfile](../admin/Dockerfile)

---

## 📞 Common Commands Reference

```bash
# Build image
docker build -t username/imagename:tag ./path

# Push image
docker push username/imagename:tag

# Pull image
docker pull username/imagename:tag

# Run image
docker run -p HOST_PORT:CONTAINER_PORT imagename:tag

# List images
docker images

# Remove image
docker rmi imagename:tag

# Login
docker login -u username

# Logout
docker logout

# Check image info
docker inspect imagename:tag

# View build history
docker history imagename:tag
```

---

**Created:** 2026-02-23  
**Updated:** 2026-02-23  
**Version:** 1.0
