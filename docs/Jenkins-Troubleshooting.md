# Jenkins Pipeline Troubleshooting Guide

## Common Issues and Solutions

### 🔴 Pipeline Failures on Checkout Stage

#### Error: "Can't connect to repository"

**Cause:** Jenkins can't reach GitHub repository

**Solutions:**
```bash
# 1. Test GitHub connectivity from Jenkins agent
ssh jenkins-agent-ip
ping github.com

# 2. Test Git clone
git clone https://github.com/Thanujan001/PhoneShop-main.git

# 3. Check Jenkins network settings
# Manage Jenkins → Configure System → GitHub → Test connection

# 4. Verify SSH key if using SSH
ssh-keygen -t rsa -f ~/.ssh/id_rsa
cat ~/.ssh/id_rsa.pub  # Add to GitHub Deploy Keys
```

#### Error: "Repository branch 'main' does not exist"

**Cause:** Branch name is incorrect or doesn't exist

**Solution:**
```bash
# Verify branch exists
git branch -a

# Update Jenkinsfile with correct branch name
# Currently uses: 'main'
# Check your GitHub repo for actual branch name
```

---

### 🔴 Dependencies Installation Failures

#### Error: npm install fails with "Cannot find module"

**Cause:** npm registry is unreachable or package doesn't exist

**Solutions:**
```bash
# 1. Clear npm cache
npm cache clean --force

# 2. Try installing with offline mode (if cached)
npm ci --offline

# 3. Check network from Jenkins agent
curl https://registry.npmjs.org

# 4. Use npm mirror for speed
npm config set registry https://registry.npm.taobao.org  # Alternative mirror

# 5. Locally test package.json
npm install --verbose
```

#### Error: "peer dep missing" or "version conflict"

**Cause:** Incompatible package versions in lock file

**Solution:**
```bash
# Delete lock files and reinstall
rm package-lock.json
npm install

# Commit updated lock file to git
git add package-lock.json
git commit -m "Update dependencies"
```

---

### 🔴 Linting and Testing Failures

#### Error: "ESLint errors found"

**Cause:** Code style violations

**Solutions:**
```bash
# Fix linting errors automatically
npm run lint -- --fix

# Review specific errors
npm run lint | head -20

# Disable specific rule if necessary (in .eslintrc)
"rules": {
  "rule-name": "off"
}
```

#### Error: "Unit tests are failing"

**Cause:** Broken tests or missing test setup

**Solutions:**
```bash
# Run tests locally
npm test

# Run tests with verbose output
npm test -- --verbose

# Generate coverage report
npm test -- --coverage

# Fix test issues locally before pushing
# The pipeline will continue even if tests fail (non-blocking)
```

---

### 🔴 Docker Build Failures

#### Error: "dockerfile: line XX command not found"

**Cause:** Invalid Dockerfile syntax or missing binary

**Solutions:**
```bash
# Validate Dockerfile syntax
docker build --no-cache -t test:1.0 .  # This will show syntax errors

# Check if required tools are installed in base image
# Verify the base image contains necessary packages

# Example fix for missing tools:
# FROM node:20
# RUN apt-get update && apt-get install -y git  # Install missing packages
```

#### Error: "COPY failed: stat: no such file or directory"

**Cause:** File doesn't exist in build context

**Solutions:**
```bash
# Check file exists:
ls -la ./server/package.json

# Verify working directory in Dockerfile:
# WORKDIR /app
# COPY ./server /app/  # Correct path

# Rebuild with increased verbosity:
docker build --progress=plain -t test:1.0 .
```

#### Error: "Docker build command timed out"

**Cause:** Large dependencies or network issues

**Solutions:**
```bash
# Check Docker resources
docker system df

# Clean up unused images/containers
docker system prune -a

# Increase Jenkins pipeline timeout
# In Jenkinsfile, under options:
timeout(time: 2, unit: 'HOURS')  # Increase from 1 hour

# Check if npm install is slow
npm install --verbose 2>&1 | tail -20
```

---

### 🔴 Docker Push Failures

#### Error: "Invalid username/password in Docker login"

**Cause:** Docker credentials are wrong or token expired

**Solutions:**
```bash
# 1. Test Docker credentials locally
echo "TOKEN" | docker login -u USERNAME --password-stdin

# 2. Regenerate Docker Hub token
# Docker Hub → Account Settings → Security → New Access Token

# 3. Update Jenkins credentials
# Manage Jenkins → Credentials → docker → Update

# 4. Verify token format
# Should be a 36+character string, not your actual password
```

#### Error: "denied: requested access to the resource is denied"

**Cause:** Repository doesn't exist or no permission

**Solutions:**
```bash
# 1. Create repository on Docker Hub first
# Docker Hub → Create → Create Repository

# 2. Use correct username
# Image should be: USERNAME/phoneshop-server
# NOT: phoneshop-server (unless it's your solo account)

# 3. Check permissions
docker push yourusername/photoshop-server:latest
# This should work if auth is successful

# 4. Verify image was built
docker images | grep phoneshop
```

#### Error: "network error: toomanyrequests: too many requests"

**Cause:** Rate limiting from Docker Hub

**Solutions:**
```bash
# 1. Wait before retrying (15-30 minutes)

# 2. Upgrade Docker Hub subscription for higher limits

# 3. Use Docker layer caching to avoid rebuilds
# Ensure Dockerfile doesn't change frequently
```

---

### 🔴 AWS Deployment Failures

#### Error: "invalid credentials provided"

**Cause:** AWS credentials are incorrect or expired

**Solutions:**
```bash
# 1. Test AWS credentials locally
aws sts get-caller-identity --region us-east-1

# 2. Verify IAM user still exists
aws iam get-user --user-name jenkins-phoneshop-cicd

# 3. Regenerate access keys
# AWS IAM → Users → jenkins-phoneshop-cicd → Create Access Key

# 4. Update Jenkins credentials
# Manage Jenkins → Credentials → aws-credentials → Update
```

#### Error: "InvalidParameterException: Invalid cluster"

**Cause:** ECS cluster doesn't exist or different region

**Solutions:**
```bash
# 1. List available clusters
aws ecs list-clusters --region us-east-1

# 2. Verify cluster name matches Jenkinsfile
# Jenkinsfile uses: cluster-phoneshop-dev
# AWS ECS should have a cluster with this exact name

# 3. Check region setting
# Jenkinsfile: AWS_REGION = credentials('aws-region')
# Should match where your ECS cluster is deployed

# 4. Create cluster if missing
aws ecs create-cluster --cluster-name cluster-phoneshop-dev --region us-east-1
```

#### Error: "Service not found"

**Cause:** ECS service doesn't exist

**Solutions:**
```bash
# 1. List services in cluster
aws ecs list-services --cluster cluster-phoneshop-dev --region us-east-1

# 2. Create services if missing
aws ecs create-service \
  --cluster cluster-phoneshop-dev \
  --service-name server \
  --task-definition phoneshop-server:1 \
  --desired-count 1 \
  --region us-east-1

# 3. Verify service names match
# Jenkinsfile expects: server, client, admin
```

#### Error: "No running tasks"

**Cause:** Task failed to start or insufficient resources

**Solutions:**
```bash
# 1. Check task status
aws ecs describe-tasks \
  --cluster cluster-phoneshop-dev \
  --tasks <task-arn> \
  --region us-east-1

# 2. Check CloudWatch logs
aws logs tail /ecs/phoneshop-server --follow

# 3. Verify task definition is valid
aws ecs describe-task-definition \
  --task-definition phoneshop-server:1 \
  --region us-east-1

# 4. Check container logs
aws ecs describe-container-instances \
  --cluster cluster-phoneshop-dev \
  --region us-east-1
```

---

### 🔴 Jenkins Configuration Issues

#### Error: "Jenkinsfile not found"

**Cause:** Wrong script path or file not in repo root

**Solutions:**
```bash
# 1. Verify Jenkinsfile exists in repo
ls -la Jenkinsfile

# 2. Check Jenkins configuration
# Job → Configure → Pipeline → Script Path
# Should be: Jenkinsfile (not /Jenkinsfile)

# 3. Verify file is committed to git
git log --oneline -- Jenkinsfile
```

#### Error: Credentials not available in pipeline

**Cause:** Credentials ID doesn't match or not visible to job

**Solutions:**
```bash
# 1. Verify credential IDs in Jenkinsfile
# Look for: credentials('docker')
# Must match Jenkins Credential ID exactly

# 2. Check credential scope
# Manage Jenkins → Credentials
# Credentials must be in "Global" domain

# 3. Test credential binding
# In Jenkinsfile, add:
withCredentials([...]){
    echo "Credentials loaded"
}

# 4. Rebuild after updating credentials
```

#### Error: GitHub webhook not triggering builds

**Cause:** Webhook misconfigured or Jenkins not reachable

**Solutions:**
```bash
# 1. Verify webhook is configured
# GitHub → Settings → Webhooks
# Should show recent successful deliveries

# 2. Check Jenkins URL
# GitHub Webhook Payload URL: http://JENKINS_URL:8080/github-webhook/
# Verify JENKINS_URL is accessible from GitHub

# 3. Test webhook locally
curl -X POST http://your-jenkins:8080/github-webhook/ \
  -H "Content-Type: application/json" \
  -d '{"action":"opened"}'

# 4. Enable GitHub plugin debug logs
# Manage Jenkins → System Log
# Add logger: com.cloudbees.jenkins.GitHubWebhook → DEBUG
```

---

## Debugging Commands

### Check Jenkins Logs
```bash
# On Jenkins server
tail -f /var/log/jenkins/jenkins.log

# Or in Jenkins UI
Manage Jenkins → System Log → All Logs
```

### Check Agent Logs
```bash
# SSH into Jenkins agent
ssh jenkins-agent

# View Docker daemon logs
journalctl -u docker -f

# View Jenkins agent logs
tail -f /var/log/jenkins-agent.log
```

### Monitor Pipeline Execution
```bash
# In pipeline console:
# Look for:
# - Blue Ocean: Better visualization
# - Classic console: Raw output with timestamps

# Each stage shows:
# ✅ (Success) / ❌ (Failed) / ⏭️ (Skipped)
```

### Docker Debugging
```bash
# List all images
docker images

# List running containers
docker ps -a

# View container logs
docker logs <container_id>

# Inspect image
docker inspect <image_id>

# Build with verbose logging
docker build --progress=plain -t test:1.0 .
```

### AWS Debugging
```bash
# Check IAM permissions
aws iam get-user-policy --user-name jenkins-phoneshop-cicd --policy-name policy-name

# List ECS resources
aws ecs list-clusters
aws ecs describe-services --cluster cluster-phoneshop-dev --services server

# Monitor CloudWatch logs
aws logs tail /ecs/phoneshop-server --follow --start 1h
```

---

## Prevention Tips

1. **Test Locally First**
   ```bash
   cd server && npm ci && npm test
   cd ../client && npm ci && npm run build
   cd ../admin && npm ci && npm run build
   ```

2. **Validate Docker Builds**
   ```bash
   docker build -t test:1.0 ./server
   docker build -t test:1.0 ./client
   docker build -t test:1.0 ./admin
   ```

3. **Check Configuration**
   ```bash
   # Before pushing
   git diff Jenkinsfile
   git diff docker-compose.yml
   ```

4. **Monitor Pipeline Runs**
   - Check console output after each build
   - Set up email/Slack notifications
   - Review logs regularly

5. **Keep Secrets Secure**
   - Never log credentials
   - Use Jenkins mask logs feature
   - Rotate credentials every 90 days

---

## Getting Help

If issues persist:

1. **Check Jenkins Logs:**
   - Manage Jenkins → System Log → All Logs

2. **Review Build Console:**
   - Job → Build # → Console Output

3. **Check Documentation:**
   - Jenkins Pipeline docs: https://www.jenkins.io/doc/book/pipeline/
   - Docker docs: https://docs.docker.com/
   - AWS ECS docs: https://docs.aws.amazon.com/ecs/

4. **Common Solutions Checklist:**
   - [ ] Test network connectivity
   - [ ] Verify credentials are correct
   - [ ] Check file permissions
   - [ ] Ensure required tools are installed
   - [ ] Review recent changes to code/config

---

**Last Updated:** 2026-02-23
**Version:** 1.0
