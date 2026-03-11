# 🚀 PhoneShop Jenkins Pipeline - Quick Start Guide

Welcome! Your Jenkins pipeline is ready to go. This guide will get you started in 5 steps.

## 📚 Documentation Files

Your complete pipeline documentation is in the `docs/` folder:

| File | Purpose |
|------|---------|
| [Jenkins-Pipeline-Setup.md](Jenkins-Pipeline-Setup.md) | 📖 Complete setup guide with prerequisites |
| [Jenkins-Configuration-Guide.md](Jenkins-Configuration-Guide.md) | ⚙️ Detailed configuration examples |
| [Jenkins-Quick-Reference.md](Jenkins-Quick-Reference.md) | 📋 Quick lookup reference |
| [Jenkins-Troubleshooting.md](Jenkins-Troubleshooting.md) | 🔧 Common issues and solutions |
| [Jenkins-Deployment-Checklist.md](Jenkins-Deployment-Checklist.md) | ✅ Step-by-step deployment checklist |

## ⚡ 5-Minute Quick Start

### Step 1: Set Up Credentials (5 mins)
Go to **Jenkins Dashboard** → **Manage Jenkins** → **Credentials**

Create these 5 credentials:

1. **Docker Hub** (Credential ID: `docker`)
   - Type: Username with password
   - Username: Your Docker Hub username
   - Password: Docker Hub API token

2. **Vite Backend URL** (Credential ID: `vite-backend-url`)
   - Type: Secret text
   - Secret: `http://your-api-url:5000`

3. **AWS Region** (Credential ID: `aws-region`)
   - Type: Secret text
   - Secret: `us-east-1`

4. **ECR Registry** (Credential ID: `ecr-registry`)
   - Type: Secret text
   - Secret: `123456789012.dkr.ecr.us-east-1.amazonaws.com`

5. **AWS Credentials** (Credential ID: `aws-credentials`)
   - Type: Secret text
   - Secret: JSON format:
   ```json
   {
     "access_key": "AKIA...",
     "secret_key": "wJal..."
   }
   ```

### Step 2: Create Jenkins Job (3 mins)
1. **New Item** → Enter `PhoneShop-Pipeline` → Select **Pipeline**
2. **Configure:**
   - General → Check "GitHub project"
   - Project URL: `https://github.com/Thanujan001/PhoneShop-main/`
   - Build Triggers → Check "GitHub hook trigger for GITScm polling"
   - Pipeline:
     - Definition: `Pipeline script from SCM`
     - SCM: `Git`
     - Repository URL: `https://github.com/Thanujan001/PhoneShop-main.git`
     - Branch: `main`
     - Script Path: `Jenkinsfile`
3. **Save**

### Step 3: Configure GitHub Webhook (2 mins)
1. Go to your GitHub repo → **Settings** → **Webhooks**
2. **Add webhook:**
   - Payload URL: `http://your-jenkins-url:8080/github-webhook/`
   - Content type: `application/json`
   - Events: `Just the push event`
3. **Add webhook**

### Step 4: Prepare AWS Infrastructure (5 mins)
In AWS Console:
1. Create ECS Cluster: `cluster-phoneshop-dev`
2. Create Task Definitions:
   - `phoneshop-server`
   - `phoneshop-client`
   - `phoneshop-admin`
3. Create Services for each task definition

### Step 5: Run Your First Build
1. Jenkins Dashboard → **PhoneShop-Pipeline** → **Build Now**
2. Watch the pipeline execute in real-time
3. See your containers deployed to AWS ECS! 🎉

## 📊 What the Pipeline Does

```
┌─ Code Checkout
├─ 📦 Install Dependencies (all 3 services in parallel)
├─ 🔗 Linting & Tests (code quality checks)
├─ 🔨 Build Applications (compiles all services)
├─ 🐳 Build & Push Docker Images
├─ ☁️ Deploy to AWS ECS
└─ ✅ Verify Deployment
```

## 🔍 Pipeline Stages Explained

| Stage | What It Does | Time |
|-------|-------------|------|
| 🔍 Checkout Code | Pulls code from GitHub | 1-2 min |
| 📦 Install Dependencies | Installs npm packages for all 3 apps | 2-3 min |
| 🔗 Linting | Checks code quality | 1 min |
| 🧪 Unit Tests | Runs unit tests (if configured) | 1 min |
| 🔨 Build Applications | Compiles React apps and server | 3-5 min |
| 🐳 Build Docker Images | Creates Docker images | 2-3 min |
| 🔐 Docker Login & Push | Pushes images to Docker Hub | 2-3 min |
| ☁️ Deploy to AWS ECS | Updates ECS services | 2-3 min |
| ✅ Verify Deployment | Checks deployment status | 1 min |

**Total time: ~15-25 minutes per build**

## 🖼️ Pipeline Visualization

```
                    START
                      ↓
            🔍 Checkout Code ✅
                      ↓
      ┌───────────────────────────────┐
      │  📦 Install Dependencies      │
      │  ├─ Server      → ✅          │
      │  ├─ Client      → ✅          │ (Parallel)
      │  └─ Admin       → ✅          │
      └────────┬────────────────────┘
               ↓
      ┌───────────────────────────────┐
      │  🔗 Linting                   │
      │  ├─ Server → ✅              │
      │  ├─ Client → ✅              │ (Parallel)
      │  └─ Admin  → ✅              │
      └────────┬────────────────────┘
               ↓
      ┌───────────────────────────────┐
      │  🧪 Unit Tests                │
      │  ├─ Server → ✅              │
      │  └─ Client → ✅              │ (Parallel)
      └────────┬────────────────────┘
               ↓
      ┌───────────────────────────────┐
      │  🔨 Build Applications        │
      │  ├─ Server    → ✅            │
      │  ├─ Client    → ✅            │ (Parallel)
      │  └─ Admin     → ✅            │
      └────────┬────────────────────┘
               ↓
      🐳 Build Docker Images → ✅
               ↓
      🔐 Docker Login & Push → ✅
               ↓
      ☁️ Deploy to AWS ECS → ✅
               ↓
      ✅ Verify Deployment → ✅
               ↓
              END
              
    ✅ = Success | ❌ = Failure
```

## 🐳 Docker Images Created

```
Node: yourname/phoneshop-server:42-abc1234
      yourname/phoneshop-server:latest

React: yourname/phoneshop-client:42-abc1234
       yourname/phoneshop-client:latest

React: yourname/phoneshop-admin:42-abc1234
       yourname/phoneshop-admin:latest
```

## 🎯 Key Features

✅ **Automated CI/CD** - Builds on every push to main branch  
✅ **Parallel Execution** - Dependencies installed 3x faster  
✅ **Code Quality** - Linting checks for all apps  
✅ **Docker Multi-Container** - Server, Client, Admin all containerized  
✅ **AWS Cloud Deployment** - Auto-deploys to ECS on successful build  
✅ **Instant Feedback** - See results within 15-25 minutes  
✅ **Production Ready** - Enterprise-grade pipeline configuration  

## 🆘 Common Issues

### Build Failed?
1. Check the **Console Output** for error details
2. Refer to [Jenkins-Troubleshooting.md](Jenkins-Troubleshooting.md)
3. Most issues are credential-related - verify all 5 credentials are correct

### Webhook Not Triggering?
1. Verify webhook in GitHub: Settings → Webhooks → Recent Deliveries
2. Check Jenkins URL is accessible from GitHub
3. Verify GitHub hook trigger is enabled in Jenkins job

### Docker Push Failed?
1. Check Docker Hub token hasn't expired
2. Verify Docker Hub credential in Jenkins
3. Ensure repository exists in Docker Hub

### ECS Deployment Failed?
1. Verify ECS cluster exists: `cluster-phoneshop-dev`
2. Check services exist: server, client, admin
3. Verify AWS credentials have correct permissions

## 📞 Need Help?

### Quick Resources
- **Troubleshooting:** [Jenkins-Troubleshooting.md](Jenkins-Troubleshooting.md)
- **Configuration:** [Jenkins-Configuration-Guide.md](Jenkins-Configuration-Guide.md)
- **Quick Lookup:** [Jenkins-Quick-Reference.md](Jenkins-Quick-Reference.md)
- **Full Setup:** [Jenkins-Pipeline-Setup.md](Jenkins-Pipeline-Setup.md)
- **Checklists:** [Jenkins-Deployment-Checklist.md](Jenkins-Deployment-Checklist.md)

### Testing Commands

```bash
# Test Docker Hub
docker login -u USERNAME -p TOKEN

# Test AWS
aws sts get-caller-identity

# Test local build
docker build -t test:1.0 ./server
```

## 🎓 Next Steps After First Build

1. **Monitor Deployment**
   - Check ECS service status
   - Verify containers are running
   - Review CloudWatch logs

2. **Set Up Notifications (Optional)**
   - Email alerts for build failures
   - Slack integration for real-time updates
   - GitHub status checks

3. **Optimize Pipeline (Optional)**
   - Add vulnerability scanning
   - Add performance tests
   - Add security scanning

4. **Maintenance**
   - Review logs weekly
   - Rotate credentials monthly
   - Update dependencies regularly

## 💡 Pro Tips

1. **Always test locally before pushing**
   ```bash
   cd server && npm ci
   cd client && npm run build
   docker build -t test:1.0 ./server
   ```

2. **Watch the pipeline in action**
   - Use Jenkins Blue Ocean plugin for visual display
   - Enable email notifications for failures

3. **Keep credentials secure**
   - Use Jenkins credentials manager (never in code)
   - Rotate access keys every 90 days
   - Use IAM roles when possible

4. **Monitor costs**
   - Review AWS ECS running costs
   - Clean up old Docker images regularly
   - Consider spot instances for cost savings

## 📊 Pipeline Statistics

- **Services Deployed:** 3 (Server, Client, Admin)
- **Parallel Stages:** Dependencies, Linting, Testing, Building
- **Build Time:** ~15-25 minutes
- **Build Retention:** Last 10 builds
- **Timeout:** 1 hour

## 🎯 Success Criteria

Your pipeline is working correctly when:

✅ Builds trigger automatically on push to main branch  
✅ All 9 stages complete successfully  
✅ Docker images appear on Docker Hub  
✅ ECS services update with new versions  
✅ No console errors or warnings  
✅ Application endpoints respond correctly  

## 🚀 Go Live Checklist

- [ ] First build completed successfully
- [ ] Docker images in Docker Hub
- [ ] ECS services running
- [ ] Application endpoints tested
- [ ] Credentials secured
- [ ] Monitoring/alerts configured
- [ ] Team trained on pipeline
- [ ] Documentation reviewed

---

## 📈 Performance Expectations

- **Full Build:** 15-25 minutes
- **Docker Build:** 2-3 minutes each
- **ECS Deployment:** 2-3 minutes
- **Success Rate:** 95%+
- **Parallel Speedup:** 3x faster dependency installation

---

## 🔐 Security Best Practices

- Never commit credentials to git
- Rotate credentials every 90 days
- Use IAM roles instead of access keys when possible
- Enable audit logging
- Review logs regularly for suspicious activity

---

**Status:** 🟢 Ready for deployment  
**Version:** 2.0  
**Created:** 2026-02-23  

👉 **Ready to build?** Go to Jenkins and click "Build Now"! 🎉
