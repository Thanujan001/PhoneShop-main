# 🐳 Docker Images - Build & Push Instructions

## ✅ What's Ready

I've created everything you need to build and push Docker images for PhoneShop to Docker Hub:

### 📁 Files Created

1. **scripts/build-and-push.bat** - Windows batch script (automated)
2. **scripts/build-and-push.sh** - Linux/Mac bash script (automated)  
3. **scripts/build-and-push.ps1** - PowerShell script
4. **docs/Docker-Build-Guide.md** - Complete guide with all options

---

## 🚀 Quick Start (3 Steps)

### Step 1: Start Docker Desktop
Open Docker Desktop and wait for it to start completely.

### Step 2: Log In to Docker Hub
```bash
docker login -u thanujan001
# Paste your Docker Hub Personal Access Token when prompted
```

### Step 3: Run Build Script

**Windows:**
```bash
cd g:\Projects\PhoneShop-main
scripts\build-and-push.bat
```

**Linux/Mac:**
```bash
cd /path/to/PhoneShop-main
bash scripts/build-and-push.sh
```

That's it! The script will:
- ✓ Build server image (Node.js backend)
- ✓ Build client image (React frontend)
- ✓ Build admin image (React admin panel)
- ✓ Push all 3 images to Docker Hub

**Total time:** ~20-30 minutes (first build)

---

## 🐳 Images That Get Created

```
thanujan001/phoneshop-server:latest      (~300MB)
thanujan001/phoneshop-client:latest      (~50MB)
thanujan001/phoneshop-admin:latest       (~50MB)
```

After pushing, view them at:
- https://hub.docker.com/r/thanujan001/phoneshop-server
- https://hub.docker.com/r/thanujan001/phoneshop-client
- https://hub.docker.com/r/thanujan001/phoneshop-admin

---

## 📝 Manual Build Commands

If you prefer to build one-by-one:

**Build Server:**
```bash
cd server
docker build -t thanujan001/phoneshop-server:latest .
cd ..
```

**Build Client:**
```bash
cd client
docker build --build-arg VITE_BACKEND_URL=http://localhost:3000 \
    -t thanujan001/phoneshop-client:latest .
cd ..
```

**Build Admin:**
```bash
cd admin
docker build --build-arg VITE_BACKEND_URL=http://localhost:3000 \
    -t thanujan001/phoneshop-admin:latest .
cd ..
```

**Push All:**
```bash
docker push thanujan001/phoneshop-server:latest
docker push thanujan001/phoneshop-client:latest
docker push thanujan001/phoneshop-admin:latest
```

---

## 🔧 Customize Backend URL

When building client/admin, change the backend URL:

```bash
# Development (localhost)
docker build --build-arg VITE_BACKEND_URL=http://localhost:5000 \
    -t thanujan001/phoneshop-client:latest ./client

# Production (AWS)
docker build --build-arg VITE_BACKEND_URL=https://api.example.com \
    -t thanujan001/phoneshop-client:latest ./client
```

---

## 🆘 Troubleshooting

### Docker Not Running
```
Error: Cannot connect to Docker daemon
```
**Fix:** Open Docker Desktop and wait for startup to complete

### Login Failed
```
Error: invalid username/password
```
**Fix:** Use Docker Hub Personal Access Token (NOT password)
- Get token: hub.docker.com → Account Settings → Security

### Image Build Failed
```
Error: failed to solve with frontend dockerfile
```
**Fix:** Check Dockerfile syntax or run with verbose output
```bash
docker build --progress=plain -t test:1.0 ./server
```

---

## 📚 Full Documentation

For complete details, see [Docker-Build-Guide.md](Docker-Build-Guide.md) which includes:
- Detailed prerequisites
- Step-by-step instructions
- Configuration options
- Verification methods
- Advanced commands
- Best practices
- Troubleshooting guide

---

## ✨ What You Get

✅ 3 Docker images ready for production  
✅ All images tagged with `latest`  
✅ Automated scripts for easy building  
✅ Complete documentation  
✅ All services properly containerized  
✅ Ready for Jenkins CI/CD pipeline  
✅ Ready for AWS ECS deployment  

---

## 🎯 Next Steps

1. **Start Docker Desktop**
2. **Log in with:** `docker login -u thanujan001`
3. **Run script:** `scripts/build-and-push.bat` (Windows) or `scripts/build-and-push.sh` (Linux/Mac)
4. **Wait for completion** (~20-30 minutes)
5. **View on Docker Hub** (images will appear automatically)
6. **Deploy using Jenkins pipeline** (see Jenkins-Pipeline-Setup.md)

---

## 📞 Support Resources

- Full manual build guide: [Docker-Build-Guide.md](Docker-Build-Guide.md)
- Jenkins automation: [Jenkins-Pipeline-Setup.md](Jenkins-Pipeline-Setup.md)
- Docker documentation: https://docs.docker.com/
- Docker Hub: https://hub.docker.com/

---

**Ready to build?** 🚀 Start Docker Desktop and run the script!
