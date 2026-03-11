# Jenkins Pipeline Deployment Checklist

## ✅ Pre-Deployment Checklist

### Infrastructure Prerequisites
- [ ] Jenkins server is installed and running (v2.400+)
- [ ] Jenkins agent has Docker installed and running
- [ ] Jenkins agent has AWS CLI installed
- [ ] Jenkins agent has npm/Node.js installed
- [ ] Jenkins agent has git installed
- [ ] Jenkins agent has internet access
- [ ] Jenkins agent has write permissions to workspace

### Accounts & Access
- [ ] GitHub account with repository access
- [ ] Docker Hub account with repository creation ability
- [ ] AWS Account with EC2/ECS/ECR permissions
- [ ] AWS IAM user created for Jenkins
- [ ] Docker Hub API token generated

### Jenkins Plugins
- [ ] Pipeline plugin installed
- [ ] GitHub plugin installed
- [ ] Docker Pipeline plugin installed
- [ ] AWS Steps plugin installed
- [ ] Credentials Binding plugin installed
- [ ] Pipeline: Stage View plugin installed (optional)

---

## 🔐 Credentials Setup Checklist

### Docker Hub Credentials
- [ ] Docker Hub username ready
- [ ] Docker Hub API token created (NOT password)
- [ ] Token saved securely
- [ ] Jenkins credential "docker" created
- [ ] Credential type: Username with password
- [ ] Test: `docker login -u USERNAME -p TOKEN`

### AWS Credentials
- [ ] AWS IAM user "jenkins-phoneshop-cicd" created
- [ ] Access Key ID generated
- [ ] Secret Access Key saved securely
- [ ] IAM policies attached:
  - [ ] AmazonEC2ContainerServiceFullAccess
  - [ ] AmazonEC2ContainerRegistryFullAccess
- [ ] Jenkins credential "aws-credentials" created
- [ ] Test: `aws sts get-caller-identity`

### Environment Variables
- [ ] Vite Backend URL determined (e.g., `http://api.phoneshop.com:5000`)
- [ ] Jenkins credential "vite-backend-url" created
- [ ] AWS Region determined (e.g., `us-east-1`)
- [ ] Jenkins credential "aws-region" created
- [ ] ECR Registry URL determined (e.g., `123456789012.dkr.ecr.us-east-1.amazonaws.com`)
- [ ] Jenkins credential "ecr-registry" created

---

## 🐳 AWS Infrastructure Setup Checklist

### AWS ECS Setup
- [ ] ECS Cluster created: `cluster-phoneshop-dev`
- [ ] EC2 instances available in cluster or Fargate capacity
- [ ] Cluster region matches AWS_REGION credential

### ECS Task Definitions
- [ ] Task definition "phoneshop-server" created
- [ ] Task definition "phoneshop-client" created
- [ ] Task definition "phoneshop-admin" created
- [ ] Each uses correct Docker image format

### ECS Services
- [ ] Service "server" created in cluster
  - [ ] Linked to "phoneshop-server" task definition
  - [ ] Port 5000 exposed
  - [ ] Desired count set (e.g., 1-2 tasks)
- [ ] Service "client" created in cluster
  - [ ] Linked to "phoneshop-client" task definition
  - [ ] Port 80 exposed (maps to 3000)
  - [ ] Desired count set
- [ ] Service "admin" created in cluster
  - [ ] Linked to "phoneshop-admin" task definition
  - [ ] Port 80 exposed (maps to 3001)
  - [ ] Desired count set

### AWS ECR Repositories (Optional)
- [ ] ECR repository for server (if using ECR)
- [ ] ECR repository for client (if using ECR)
- [ ] ECR repository for admin (if using ECR)

### IAM Permissions
- [ ] jenkins-phoneshop-cicd user can update ECS services
- [ ] jenkins-phoneshop-cicd user can describe ECS services
- [ ] jenkins-phoneshop-cicd user can access ECR (if using)
- [ ] jenkins-phoneshop-cicd user can access CloudWatch logs

---

## 🔗 GitHub Setup Checklist

### GitHub Repository
- [ ] Repository is public or Jenkins has access
- [ ] Main branch exists and is protected (optional)
- [ ] Jenkinsfile exists in repository root
- [ ] All source code is committed

### GitHub Webhook
- [ ] Go to repository Settings → Webhooks
- [ ] Webhook created with:
  - [ ] Payload URL: `http://JENKINS_URL:8080/github-webhook/`
  - [ ] Content type: `application/json`
  - [ ] Events: `Just the push event`
  - [ ] Active: Checked
- [ ] Test webhook from GitHub (Recent Deliveries)
- [ ] Jenkins received successful webhook ping

### GitHub SSH (if using SSH)
- [ ] SSH key generated on Jenkins agent
- [ ] Public key added to GitHub Deploy Keys
- [ ] SSH key has required permissions

---

## 🏗️ Jenkins Job Setup Checklist

### Create Pipeline Job
- [ ] New Pipeline job created: "PhoneShop-Pipeline"
- [ ] Job description added
- [ ] GitHub project URL configured

### Pipeline Configuration
- [ ] Definition: "Pipeline script from SCM"
- [ ] SCM: "Git"
- [ ] Repository URL: `https://github.com/Thanujan001/PhoneShop-main.git`
- [ ] Branch: `main`
- [ ] Script Path: `Jenkinsfile`

### Build Triggers
- [ ] GitHub hook trigger enabled: "GitHub hook trigger for GITScm polling"

### Advanced Options
- [ ] Lightweight checkout: unchecked (for full history)
- [ ] Credentials: set to GitHub SSH key (if using SSH)

### Save Configuration
- [ ] All settings saved
- [ ] Job appears in dashboard

---

## 🧪 Pre-Flight Tests Checklist

### Test Connectivity
- [ ] Jenkins can reach GitHub: `ping github.com`
- [ ] Jenkins can reach Docker Hub: `curl https://registry.npmjs.org`
- [ ] Jenkins can reach AWS: `aws sts get-caller-identity`
- [ ] AWS CLI configured: `aws configure`

### Test Credentials
- [ ] Docker Hub login works: `docker login -u USERNAME -p TOKEN`
- [ ] AWS credentials work: `aws sts get-caller-identity`
- [ ] ECS cluster accessible: `aws ecs list-clusters`
- [ ] Services exist: `aws ecs list-services --cluster cluster-phoneshop-dev`

### Test Docker Build
- [ ] `docker build -t test:1.0 ./server` succeeds
- [ ] `docker build -t test:1.0 ./client` succeeds
- [ ] `docker build -t test:1.0 ./admin` succeeds

### Test Repository
- [ ] Jenkinsfile exists: `git log --oneline -- Jenkinsfile`
- [ ] Main branch exists: `git branch -a`
- [ ] All services have package.json: 
  - [ ] server/package.json
  - [ ] client/package.json
  - [ ] admin/package.json

---

## ▶️ First Build Checklist

### Manual Trigger
- [ ] Dashboard → PhoneShop-Pipeline → "Build Now"
- [ ] Build starts and shows in queue

### Monitor Building
- [ ] Build number increments
- [ ] Console output shows stage progression
- [ ] No immediate errors in early stages

### Expected Output
Each stage should show:
```
✅ Checkout Code
✅ Install Dependencies
  ✅ Server Dependencies
  ✅ Client Dependencies
  ✅ Admin Dependencies
✅ Linting
✅ Unit Tests (may be skipped)
✅ Build Applications
✅ Build Docker Images
✅ Docker Login & Push
✅ Deploy to AWS ECS
✅ Verify Deployment
```

### Success Indicators
- [ ] All stages show green checkmarks
- [ ] Build log ends with: "✅ Pipeline completed successfully!"
- [ ] Docker images pushed to Docker Hub
- [ ] ECS services updated

### Verification After Build
- [ ] Docker Hub shows new images:
  - [ ] yourname/phoneshop-server:BUILD_NUMBER-HASH
  - [ ] yourname/phoneshop-server:latest
  - [ ] yourname/phoneshop-client:BUILD_NUMBER-HASH
  - [ ] yourname/phoneshop-admin:BUILD_NUMBER-HASH
- [ ] ECS services show new task definitions
- [ ] ECS tasks are running (or ramping up)
- [ ] CloudWatch shows no critical errors

---

## 🔧 Post-Build Checklist

### If Build Succeeded ✅
1. [ ] Review console output for any warnings
2. [ ] Verify Docker images are on Docker Hub
3. [ ] Check ECS services are updating
4. [ ] Monitor CloudWatch logs for application startup
5. [ ] Test application endpoints (if deployed)
6. [ ] Commit celebration (you earned it! 🎉)

### If Build Failed ❌
1. [ ] Check console output for error message
2. [ ] Note which stage failed
3. [ ] Review troubleshooting guide: [Jenkins-Troubleshooting.md](Jenkins-Troubleshooting.md)
4. [ ] Fix issue locally
5. [ ] Commit fix to git
6. [ ] Retry build

---

## 📊 Ongoing Maintenance Checklist (Weekly)

- [ ] Review Jenkins logs for errors
- [ ] Check Docker Hub storage usage
- [ ] Verify AWS costs are reasonable
- [ ] Check ECS task health in CloudWatch
- [ ] Review security credentials (not accessed inappropriately)
- [ ] Update Jenkins plugins (if available)

---

## 📊 Ongoing Maintenance Checklist (Monthly)

- [ ] Rotate credentials (AWS, Docker Hub)
- [ ] Review IAM permissions (least privilege)
- [ ] Clean up old Docker images (disk space)
- [ ] Review pipeline performance
- [ ] Update Jenkins version (if available)
- [ ] Backup Jenkins configuration

---

## 🚨 Emergency Procedures

### If Pipeline Keeps Failing
1. [ ] Check network connectivity
2. [ ] Verify credentials haven't expired
3. [ ] Check AWS service quota limits
4. [ ] Review recent code changes
5. [ ] Restart Jenkins agent (last resort)

### If Docker Hub Runs Out of Space
1. [ ] Delete old image tags from Docker Hub
2. [ ] Increase storage plan if needed
3. [ ] Consider using AWS ECR instead

### If ECS Deployment Fails
1. [ ] Verify task definition is correct
2. [ ] Check insufficient IAM permissions
3. [ ] Review CloudWatch logs
4. [ ] Verify service capacity (CPU/memory)

### If GitHub Webhook Stops Working
1. [ ] Verify GitHub webhook still exists
2. [ ] Check Jenkins URL is accessible from GitHub
3. [ ] Review webhook recent deliveries
4. [ ] Re-create webhook if necessary

---

## 📝 Documentation Files Created

- [Jenkins-Pipeline-Setup.md](Jenkins-Pipeline-Setup.md) - Complete setup guide
- [Jenkins-Configuration-Guide.md](Jenkins-Configuration-Guide.md) - Configuration examples
- [Jenkins-Quick-Reference.md](Jenkins-Quick-Reference.md) - Quick lookup reference
- [Jenkins-Troubleshooting.md](Jenkins-Troubleshooting.md) - Common issues and fixes
- Jenkins-Deployment-Checklist.md (this file)

---

## 🎓 Quick Command Reference

```bash
# Test Docker Hub login
docker login -u USERNAME -p TOKEN

# Test AWS credentials
aws sts get-caller-identity --region us-east-1

# Check ECS cluster
aws ecs list-clusters --region us-east-1

# View ECS services
aws ecs list-services --cluster cluster-phoneshop-dev --region us-east-1

# View ECS task status
aws ecs describe-services \
  --cluster cluster-phoneshop-dev \
  --services server client admin \
  --region us-east-1

# Check CloudWatch logs
aws logs tail /ecs/phoneshop-server --follow

# Test local Docker build
docker build -t test:1.0 ./server
```

---

**Start Date:** [TODAY'S DATE]
**First Build Date:** ________________
**Go-Live Date:** ________________
**Version:** 1.0
**Status:** ☐ Not Started | ☑ In Progress | ☐ Completed

---

**Next Steps:**
1. Complete all checkboxes above
2. Run first build
3. Monitor ECS deployment
4. Test application endpoints
5. Celebrate successful deployment! 🎉
