# Jenkins Pipeline Setup Guide - PhoneShop

This guide explains how to set up and configure the Jenkins pipeline for the PhoneShop project.

## 📋 Prerequisites

- Jenkins server (v2.400+)
- Docker installed on Jenkins agent
- AWS CLI configured
- GitHub repository access
- Docker Hub account
- AWS ECR repository

## 🔧 Required Jenkins Plugins

Install the following plugins in Jenkins:

1. **Pipeline** - For pipeline support
2. **GitHub Plugin** - For GitHub integration
3. **Docker Pipeline** - For Docker operations
4. **AWS Steps** - For AWS operations
5. **Credentials Binding Plugin** - For credential handling
6. **Pipeline: Stage View** - For visualization

To install: Manage Jenkins → Plugin Manager → Available Plugins

## 🔐 Required Jenkins Credentials

Create the following credentials in Jenkins (Manage Jenkins → Credentials):

### 1. Docker Hub Credentials
- **Type:** Username with password
- **ID:** `docker`
- **Username:** Your Docker Hub username
- **Password:** Docker Hub access token
- **Path:** Dashboard → Manage Jenkins → Credentials → System → Global credentials

```bash
# To create a Docker Hub token:
# 1. Go to hub.docker.com
# 2. Account Settings → Security → New Access Token
# 3. Name it and store securely
```

### 2. Vite Backend URL
- **Type:** Secret text
- **ID:** `vite-backend-url`
- **Secret:** `http://your-api-domain:5000` (or your backend URL)

### 3. AWS Region
- **Type:** Secret text
- **ID:** `aws-region`
- **Secret:** `us-east-1` (or your AWS region)

### 4. ECR Registry
- **Type:** Secret text
- **ID:** `ecr-registry`
- **Secret:** `ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com`

Example: `123456789012.dkr.ecr.us-east-1.amazonaws.com`

### 5. AWS Credentials
- **Type:** Secret text
- **ID:** `aws-credentials`
- **Secret:** JSON format with access key and secret key

```json
{
  "access_key": "AKIAIOSFODNN7EXAMPLE",
  "secret_key": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
}
```

**Or use AWS Secret Manager Plugin for better security**

## 📝 Pipeline Stages Explained

The Jenkinsfile includes the following stages:

### 1. 🔍 Checkout Code
- Clones the repository from GitHub
- Checks out the `main` branch
- Displays git information

### 2. 📦 Install Dependencies (Parallel)
- **Server:** Installs Node.js dependencies with `npm ci`
- **Client:** Installs React client dependencies
- **Admin:** Installs admin panel dependencies

### 3. 🔗 Linting (Parallel)
- Runs ESLint on all three applications
- Flags code quality issues
- Non-blocking (continues even with warnings)

### 4. 🧪 Unit Tests (Parallel)
- Runs available unit tests for server and client
- Validates code functionality

### 5. 🔨 Build Applications (Parallel)
- **Server:** Validates configuration
- **Client:** Builds Vite production bundle
- **Admin:** Builds Vite production bundle

### 6. 🐳 Build Docker Images
- Creates Docker images for all three services
- Tags with build number and git commit hash
- Also tags with `latest`

### 7. 🔐 Docker Login & Push
- Authenticates to Docker Hub
- Pushes all three images with both tags
- Example tags:
  - `phoneshop-server:42-abc1234`
  - `phoneshop-server:latest`

### 8. ☁️ Deploy to AWS ECS
- Authenticates to AWS ECR
- Updates three ECS services:
  - `phoneshop-server`
  - `phoneshop-client`
  - `phoneshop-admin`
- Forces new deployment to pick up latest images

### 9. ✅ Verify Deployment
- Checks ECS service status
- Displays running vs desired task count
- Confirms deployment success

## 🚀 Creating the Pipeline Job

1. **In Jenkins Dashboard:**
   ```
   New Item → Enter job name (e.g., "PhoneShop-Pipeline")
   → Select "Pipeline" → OK
   ```

2. **Configure the Pipeline:**
   - Definition: `Pipeline script from SCM`
   - SCM: `Git`
   - Repository URL: `https://github.com/Thanujan001/PhoneShop-main.git`
   - Branch: `main`
   - Script Path: `Jenkinsfile`

3. **Build Triggers:**
   - Check: `GitHub hook trigger for GITScm polling`

4. **Save and run**

## 🔗 GitHub Webhook Setup

To enable automatic builds on push:

1. **Go to GitHub Repository Settings:**
   - Settings → Webhooks → Add webhook

2. **Configure Webhook:**
   - Payload URL: `http://JENKINS_URL/github-webhook/`
   - Content type: `application/json`
   - Events: `Just the push event`
   - Active: ✓ Checked

3. **Jenkins Configuration:**
   - Manage Jenkins → Configure System
   - GitHub → API URL: `https://api.github.com`
   - Test connection

## 🐳 Docker Image Naming Convention

Images follow this pattern:
```
{DOCKER_USERNAME}/phoneshop-{service}:{tag}

Examples:
- yourusername/phoneshop-server:42-abc1234
- yourusername/phoneshop-server:latest
- yourusername/phoneshop-client:42-abc1234
- yourusername/phoneshop-admin:latest
```

## ☁️ AWS ECS Configuration

Your ECS cluster should have:

```
Cluster: cluster-phoneshop-dev
Services:
  - server (running server image)
  - client (running client image)
  - admin (running admin image)
```

Each service should be configured to:
1. Use the latest task definition
2. Accept auto-updates
3. Have proper IAM permissions

## 📊 Viewing Pipeline Execution

1. **Main Dashboard:**
   - Click on the job to see all builds

2. **Build Details:**
   - Click on a build number to see stages
   - Use "Stage View" plugin for visual overview

3. **Logs:**
   - Click "Console Output" to see detailed logs
   - Each stage is clearly marked with emojis

## 🔍 Troubleshooting

### Docker Login Fails
```bash
# Verify credentials
# Check Docker Hub token hasn't expired
# Ensure credentials ID matches Jenkinsfile
```

### AWS Authentication Fails
```bash
# Verify AWS credentials are correct
# Check IAM user has ECS permissions
# Verify region matches your ECS resources
```

### Git Checkout Fails
```bash
# Verify GitHub URL is correct
# Check SSH/HTTPS credentials
# Ensure Jenkins has internet access
```

### Docker Build Fails
```bash
# Check Dockerfile syntax
# Verify build dependencies are installed
# Check docker daemon is running on Jenkins agent
```

## 🔒 Security Best Practices

1. **Credentials:**
   - Use Jenkins credentials manager, never hardcode secrets
   - Rotate credentials regularly
   - Use AWS IAM roles when possible

2. **Docker:**
   - Use multi-stage builds to minimize image size
   - Scan images for vulnerabilities
   - Use private Docker registry for sensitive images

3. **Access Control:**
   - Limit who can trigger pipeline
   - Use role-based access control
   - Enable pipeline audit logs

## 📈 Pipeline Optimization Tips

1. **Parallel Stages:** Dependencies are installed in parallel for faster builds
2. **Caching:** Docker layer caching speeds up builds
3. **Clean Workspace:** Reduces storage usage and prevents side effects
4. **Conditional Deployment:** Consider adding environment checks before ECS deployment

## 🎯 Next Steps

1. Set up the Jenkins credentials
2. Create the pipeline job
3. Configure GitHub webhook
4. Run first build manually
5. Monitor logs and fix any issues
6. Set up notifications (email/Slack)

## 📞 Support

For issues with:
- **Jenkins:** Check Jenkins logs at `JENKINS_HOME/logs/`
- **Docker:** Run `docker logs <container_id>`
- **AWS ECS:** Check CloudWatch logs for your ECS tasks
- **GitHub Webhook:** Check recent deliveries in GitHub webhook settings

---

**Last Updated:** 2026-02-23
**Pipeline Version:** 2.0
