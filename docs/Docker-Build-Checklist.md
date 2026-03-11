# 🐳 Docker Images Build Checklist

## Prerequisites Checklist

### Software Installation
- [ ] Docker Desktop installed (https://www.docker.com/products/docker-desktop)
- [ ] Docker running and accessible
- [ ] Command line (PowerShell, Terminal, Bash) ready

### Docker Hub Account
- [ ] Docker Hub account created (https://hub.docker.com)
- [ ] Logged into Docker Hub account
- [ ] Personal Access Token created
  - [ ] Saved securely
  - [ ] Has read/write permissions

### Repository Setup
- [ ] 3 public repositories created on Docker Hub:
  - [ ] phoneshop-server
  - [ ] phoneshop-client
  - [ ] phoneshop-admin

---

## Pre-Build Verification

### System Requirements
- [ ] At least 10GB free disk space
- [ ] 4GB RAM available
- [ ] Internet connection working
- [ ] Can reach Docker Hub

### Code Ready
- [ ] All code committed to repository
- [ ] No uncommitted changes
- [ ] All Dockerfiles present:
  - [ ] server/Dockerfile exists
  - [ ] client/Dockerfile exists
  - [ ] admin/Dockerfile exists
- [ ] All package.json files exist:
  - [ ] server/package.json
  - [ ] client/package.json
  - [ ] admin/package.json

### Docker Login
```bash
docker login -u YOUR_USERNAME
# Enter Personal Access Token when prompted
```
- [ ] Login successful
- [ ] Logged in as `thanujan001`

---

## Build Process Checklist

### Option A: Automated Script (Recommended)

**Windows:**
```bash
cd g:\Projects\PhoneShop-main
scripts\build-and-push.bat
```
- [ ] Script started
- [ ] No errors displayed
- [ ] Waited for all builds to complete

**Linux/Mac:**
```bash
cd /path/to/PhoneShop-main
bash scripts/build-and-push.sh
```
- [ ] Script started
- [ ] No errors displayed
- [ ] Waited for all builds to complete

### Option B: Manual Build Commands

**Build Server Image:**
```bash
cd server
docker build -t thanujan001/phoneshop-server:latest .
cd ..
```
- [ ] Server build completed successfully
- [ ] No errors shown

**Build Client Image:**
```bash
cd client
docker build --build-arg VITE_BACKEND_URL=http://localhost:3000 \
    -t thanujan001/phoneshop-client:latest .
cd ..
```
- [ ] Client build completed successfully
- [ ] No errors shown
- [ ] Backend URL set correctly

**Build Admin Image:**
```bash
cd admin
docker build --build-arg VITE_BACKEND_URL=http://localhost:3000 \
    -t thanujan001/phoneshop-admin:latest .
cd ..
```
- [ ] Admin build completed successfully
- [ ] No errors shown
- [ ] Backend URL set correctly

---

## Image Verification

### Verify Local Images
```bash
docker images | grep phoneshop
```
- [ ] Server image listed
- [ ] Client image listed
- [ ] Admin image listed
- [ ] All tagged as `latest`
- [ ] Sizes look reasonable:
  - [ ] Server: ~250-350MB
  - [ ] Client: ~40-60MB
  - [ ] Admin: ~40-60MB

### Check Image Details
```bash
docker inspect thanujan001/phoneshop-server:latest
```
- [ ] Image configuration looks correct
- [ ] Exposed ports correct:
  - [ ] Server: 5000
  - [ ] Client: 80
  - [ ] Admin: 80

### View Build History
```bash
docker history thanujan001/phoneshop-server:latest
```
- [ ] Shows build layers
- [ ] No obvious errors in history

---

## Push to Docker Hub

### Push Images
```bash
# Push server
docker push thanujan001/phoneshop-server:latest
```
- [ ] Server image pushed successfully
- [ ] Upload completed without errors

```bash
# Push client
docker push thanujan001/phoneshop-client:latest
```
- [ ] Client image pushed successfully
- [ ] Upload completed without errors

```bash
# Push admin
docker push thanujan001/phoneshop-admin:latest
```
- [ ] Admin image pushed successfully
- [ ] Upload completed without errors

### Verify on Docker Hub
Visit https://hub.docker.com/u/thanujan001

- [ ] Server repository shows:
  - [ ] Image exists
  - [ ] Latest tag visible
  - [ ] Image size displayed

- [ ] Client repository shows:
  - [ ] Image exists
  - [ ] Latest tag visible
  - [ ] Image size displayed

- [ ] Admin repository shows:
  - [ ] Image exists
  - [ ] Latest tag visible
  - [ ] Image size displayed

---

## Post-Build Testing

### Test Server Image
```bash
docker run -p 5000:5000 thanujan001/phoneshop-server:latest
```
- [ ] Container starts without errors
- [ ] Port 5000 accessible
- [ ] Application logs show normal startup
- [ ] Stop container: `Ctrl+C`

### Test Client Image
```bash
docker run -p 3000:80 thanujan001/phoneshop-client:latest
```
- [ ] Container starts without errors
- [ ] Can access http://localhost:3000
- [ ] Frontend loads in browser
- [ ] Stop container: `Ctrl+C`

### Test Admin Image
```bash
docker run -p 3001:80 thanujan001/phoneshop-admin:latest
```
- [ ] Container starts without errors
- [ ] Can access http://localhost:3001
- [ ] Admin panel loads in browser
- [ ] Stop container: `Ctrl+C`

---

## Docker Compose Testing (Optional)

```bash
docker-compose up -d
docker-compose ps
```
- [ ] All services started
- [ ] All containers running
- [ ] No error messages

```bash
# Access services
curl http://localhost:5000
curl http://localhost:3000
curl http://localhost:3001
```
- [ ] All services responding
- [ ] No connection errors

```bash
docker-compose down
```
- [ ] Services stopped cleanly
- [ ] No error messages

---

## Jenkins Pipeline Integration (Optional)

If using Jenkins:
- [ ] Jenkinsfile configured
- [ ] Jenkins credentials set up
- [ ] Docker Hub repository in Jenkinsfile
- [ ] AWS ECS configuration ready
- [ ] First build triggered successfully

See: [Jenkins-Pipeline-Setup.md](Jenkins-Pipeline-Setup.md)

---

## Documentation Review

- [ ] Read [Docker-Build-Guide.md](Docker-Build-Guide.md)
- [ ] Understand build process
- [ ] Know how to troubleshoot
- [ ] Have Docker commands reference
- [ ] Can explain to team

---

## Success Criteria

All of these should be true:

✅ 3 images built locally  
✅ 3 images pushed to Docker Hub  
✅ All images accessible via Docker Hub website  
✅ Can pull and run images locally without errors  
✅ Services respond on correct ports  
✅ No security warnings or errors  
✅ Docker Hub storage quota sufficient  

---

## Troubleshooting Checklist

If something failed:

- [ ] Docker daemon running
- [ ] Internet connection working
- [ ] Docker Hub login valid
- [ ] Sufficient disk space
- [ ] Sufficient storage quota on Docker Hub
- [ ] No firewall blocking Docker
- [ ] No corrupted local images
- [ ] All required files present

See full troubleshooting: [Docker-Build-Guide.md](Docker-Build-Guide.md#troubleshooting)

---

## Next Steps After Successful Build

1. **Update Jenkins Pipeline** (if using)
   - [ ] Pipeline configured with new image names
   - [ ] AWS ECS task definitions updated
   - [ ] Tested first automated deployment

2. **Deploy to Production**
   - [ ] Images tested in staging
   - [ ] Performance verified
   - [ ] Security scanning done
   - [ ] Deployment plan created

3. **Monitor After Deployment**
   - [ ] Container health checked
   - [ ] Logs reviewed
   - [ ] Performance metrics collected
   - [ ] User testing completed

4. **Document & Archive**
   - [ ] Build notes recorded
   - [ ] Image tags documented
   - [ ] Version history maintained
   - [ ] Team notified

---

## Sign-Off

| Item | Status | Completed By | Date |
|------|--------|-------------|------|
| Prerequisites checked | ☐ | | |
| Images built | ☐ | | |
| Images pushed | ☐ | | |
| Images tested | ☐ | | |
| Docker Hub verified | ☐ | | |
| Jenkins integration | ☐ | | |
| Team notified | ☐ | | |

---

## Quick Reference

**View built images:**
```bash
docker images | grep phoneshop
```

**View pushed images:**
```bash
curl -s https://hub.docker.com/v2/repositories/thanujan001/phoneshop-server/tags | grep -o '"name":"[^"]*"'
```

**View image layers:**
```bash
docker history thanujan001/phoneshop-server:latest
```

**View image config:**
```bash
docker inspect thanujan001/phoneshop-server:latest | grep -E '"ExposedPorts|"WorkingDir|"Entrypoint'
```

---

**Completed Date:** ________________  
**Completed By:** ________________  
**Build Time:** ________________ minutes  

---

For questions or issues, refer to [Docker-Build-Guide.md](Docker-Build-Guide.md)
