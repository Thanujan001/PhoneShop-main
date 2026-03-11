# Jenkins Pipeline Quick Reference - PhoneShop

## 🎯 Pipeline Overview

```
┌─────────────────┐
│  Code Checkout  │
└────────┬────────┘
         │
    ┌────▼────────────────────────┐
    │  Install Dependencies       │
    │  ├─ Server                  │
    │  ├─ Client                  │
    │  └─ Admin                   │
    └────┬───────────────────────┘
         │
    ┌────▼────────────────────────┐
    │  Code Quality Checks        │
    │  ├─ Linting (parallel)      │
    │  └─ Unit Tests (parallel)   │
    └────┬───────────────────────┘
         │
    ┌────▼────────────────────────┐
    │  Build Applications         │
    │  ├─ Server Build            │
    │  ├─ Client Build (Vite)     │
    │  └─ Admin Build (Vite)      │
    └────┬───────────────────────┘
         │
    ┌────▼────────────────────────┐
    │  Docker Build & Push        │
    │  ├─ Build Images            │
    │  └─ Push to Docker Hub      │
    └────┬───────────────────────┘
         │
    ┌────▼────────────────────────┐
    │  Deploy to AWS ECS          │
    │  └─ Update Services         │
    └────┬───────────────────────┘
         │
    ┌────▼───────────┐
    │  Verify Deploy  │
    └────────────────┘
```

## 📊 Stage Status Indicators

| Icon | Meaning |
|------|---------|
| ✅ | Success |
| ❌ | Failed |
| ⚠️ | Warning/Unstable |
| 🔄 | In Progress |
| ⏸️ | Aborted |

## 🚀 How to Run Pipeline

### Manual Trigger
Jenkins Dashboard → PhoneShop-Pipeline → **Build Now**

### Automatic Trigger
Push to `main` branch on GitHub → Webhook triggers pipeline automatically

## 📝 Required Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_BACKEND_URL` | Frontend API endpoint | `http://api.phoneshop.com:5000` |
| `AWS_REGION` | AWS deployment region | `us-east-1` |
| `ECR_REGISTRY` | AWS ECR endpoint | `123456789012.dkr.ecr.us-east-1.amazonaws.com` |
| `DOCKER_USERNAME` | Docker Hub username | `yourname` |
| `DOCKER_PASSWORD` | Docker Hub token | From credentials |

## 🐳 Docker Images Generated

After successful build:

```
Docker Hub:
├── yourname/phoneshop-server:BUILD_NUMBER-COMMIT
├── yourname/phoneshop-server:latest
├── yourname/phoneshop-client:BUILD_NUMBER-COMMIT
├── yourname/phoneshop-client:latest
├── yourname/phoneshop-admin:BUILD_NUMBER-COMMIT
└── yourname/phoneshop-admin:latest
```

## 🔗 Services Deployed

| Service | ECS Cluster | Port | Image |
|---------|------------|------|-------|
| server | cluster-phoneshop-dev | 5000 | phoneshop-server |
| client | cluster-phoneshop-dev | 3000 | phoneshop-client |
| admin | cluster-phoneshop-dev | 3001 | phoneshop-admin |

## 📋 Failure Troubleshooting

### If Checkout Fails
```
Check:
└─ GitHub repository URL is correct
└─ Jenkins has internet access
└─ GitHub token/SSH key is valid
└─ Branch 'main' exists
```

### If Dependency Install Fails
```
Check:
└─ npm registry is accessible
└─ package.json files are valid
└─ No conflicting dependency versions
└─ Internet connectivity
```

### If Linting/Tests Fail (Non-blocking)
```
Action:
└─ Pipeline continues (warnings only)
└─ Check logs for details
└─ Fix code quality issues locally
└─ Push fixes to trigger new build
```

### If Docker Build Fails
```
Check:
└─ Dockerfile syntax is correct
└─ Build context contains required files
└─ Docker daemon is running
└─ Sufficient disk space available
```

### If Docker Push Fails
```
Check:
└─ Docker Hub credentials are valid
└─ Docker Hub account has storage quota
└─ Internet connectivity to Docker Hub
└─ Repository exists in Docker Hub
```

### If AWS Deployment Fails
```
Check:
└─ AWS credentials are valid
└─ IAM user has ECS permissions
└─ ECS cluster exists and is running
└─ ECS services are properly configured
└─ Task definitions are up-to-date
```

## 🔍 Viewing Logs

### Build Logs
```
Dashboard → PhoneShop-Pipeline → Build # → Console Output
```

### Specific Stage Logs
```
1. Open build
2. Click "Stage View" (if plugin installed)
3. Click on failing stage
4. View detailed logs
```

### Docker Logs (If deployed)
```bash
# SSH into Jenkins agent
docker logs <container_id>
```

### AWS ECS Logs
```bash
# Via AWS CLI
aws logs tail /ecs/phoneshop-server --follow

# Via AWS Console
Services → ECS → Clusters → cluster-phoneshop-dev → Tasks
```

## 🆘 Quick Fix Commands

### Clear Docker credentials from Jenkins agent
```bash
rm -f ~/.docker/config.json
docker logout
```

### Force rebuild all images
```bash
docker rmi $(docker images | grep phoneshop | awk '{print $3}')
# Then trigger new build
```

### Check Docker Hub login
```bash
docker login -u USERNAME -p TOKEN
```

### Test AWS credentials
```bash
aws sts get-caller-identity
```

### Check ECS service status
```bash
aws ecs describe-services \
  --cluster cluster-phoneshop-dev \
  --services server client admin \
  --region us-east-1
```

## 📊 Key Metrics

| Metric | Typical Value | Alert If |
|--------|---------------|----------|
| Full pipeline time | 5-15 min | > 30 min |
| Docker build time | 2-5 min | > 10 min |
| ECS deployment time | 2-5 min | > 10 min |
| Success rate | > 95% | < 80% |

## 🔐 Security Checklist

- [ ] All credentials stored in Jenkins secrets manager
- [ ] Docker credentials use tokens, not passwords
- [ ] AWS credentials use IAM user (not root)
- [ ] GitHub webhook is HTTPS
- [ ] Jenkins updates are current
- [ ] Plugins are updated
- [ ] Jenkins URL is HTTPS (for production)
- [ ] Role-based access control enabled
- [ ] Audit logs are enabled

## 📈 Performance Tips

1. **Use Docker layer caching** - Keep Dockerfiles consistent
2. **Parallel stages** - Dependencies already run in parallel
3. **Limit history** - Builds are auto-cleaned after 10 builds
4. **Local testing** - Test locally before pushing
5. **Scheduled cleanup** - Clean old images regularly

## 🎓 Learning Resources

- [Jenkins Pipeline Documentation](https://www.jenkins.io/doc/book/pipeline/)
- [Docker Hub Pushing](https://docs.docker.com/get-started/sharing-apps/)
- [AWS ECS Deployment](https://docs.aws.amazon.com/ecs/latest/developerguide/ecs-cd.html)
- [GitHub Webhooks](https://docs.github.com/en/developers/webhooks-and-events/webhooks)

---

**Version:** 2.0 | **Last Updated:** 2026-02-23
