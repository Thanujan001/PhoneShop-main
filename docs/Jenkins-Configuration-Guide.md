# Jenkins Configuration Examples

## Docker Hub Credentials Setup

### Create Docker Hub Access Token

1. Go to [Docker Hub](https://hub.docker.com)
2. Click on your username → Account Settings → Security
3. Click "New Access Token"
4. Fill in:
   - Token name: `jenkins-cicd`
   - Permissions: `Read, Write`
5. Click "Generate" and copy the token

### Add Credentials to Jenkins

1. Jenkins Dashboard → Manage Jenkins → Credentials
2. Click "System" → "Global credentials (unrestricted)"
3. Click "Add Credentials" → Select "Username with password"
4. Fill in:
   ```
   Username: your-docker-hub-username
   Password: [paste the token from Docker Hub]
   ID: docker
   Description: Docker Hub credentials for PhoneShop CI/CD
   ```
5. Click "Create"

---

## AWS Credentials Setup

### Option 1: Using IAM User (Recommended)

1. **Create IAM User in AWS Console:**
   - Go to AWS IAM Dashboard
   - Users → Create user
   - Username: `jenkins-phoneshop-cicd`
   - Uncheck "Provide user access to AWS Management Console"
   - Next

2. **Set Permissions:**
   - Attach policy: `AmazonEC2ContainerServiceFullAccess`
   - Attach policy: `AmazonEC2ContainerRegistryFullAccess`
   - Review and create

3. **Create Access Key:**
   - Go to the new user
   - Security credentials → Create access key
   - Select "Command Line Interface (CLI)"
   - Copy Access Key ID and Secret Access Key

4. **Add to Jenkins:**
   - Jenkins Dashboard → Manage Jenkins → Credentials
   - Click "System" → "Global credentials (unrestricted)"
   - Click "Add Credentials" → Select "Secret text"
   - Paste as JSON:
   ```json
   {
     "access_key": "AKIAIOSFODNN7EXAMPLE",
     "secret_key": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
   }
   ```
   - ID: `aws-credentials`
   - Click "Create"

### Option 2: Using AWS Credentials Plugin (More Secure)

1. Install plugin: Manage Jenkins → Plugin Manager → Search "AWS Credentials"
2. Install "AWS Credentials" plugin
3. Go to Credentials → Global credentials
4. Add Credentials → AWS Credentials
5. Fill in:
   - Access Key ID: `AKIA...`
   - Secret Access Key: `wJal...`
   - ID: `aws-credentials`

---

## Environment Variable Credentials

### Add Vite Backend URL

1. Jenkins Dashboard → Manage Jenkins → Credentials
2. Click "System" → "Global credentials (unrestricted)"
3. Click "Add Credentials" → Select "Secret text"
4. Fill in:
   ```
   Secret: http://your-backend-url.com:5000
   ID: vite-backend-url
   Description: Backend API URL for Vite frontend builds
   ```
5. Click "Create"

### Add AWS Region

1. Click "Add Credentials" → Select "Secret text"
2. Fill in:
   ```
   Secret: us-east-1
   ID: aws-region
   Description: AWS region for ECS deployment
   ```
3. Click "Create"

### Add ECR Registry URL

1. Click "Add Credentials" → Select "Secret text"
2. Fill in:
   ```
   Secret: 123456789012.dkr.ecr.us-east-1.amazonaws.com
   ID: ecr-registry
   Description: AWS ECR registry URL
   ```
3. Click "Create"

---

## Jenkins Job Configuration (via UI)

### Step 1: Create New Pipeline Job

```
Dashboard → New Item
Name: PhoneShop-Pipeline
Type: Pipeline
Click OK
```

### Step 2: General Settings

Check these options:
- ☑ GitHub project
  - Project url: `https://github.com/Thanujan001/PhoneShop-main/`
- ☑ This project is parameterized (Optional - for advanced setup)

### Step 3: Build Triggers

Check these options:
- ☑ GitHub hook trigger for GITScm polling
  - This enables automatic builds when code is pushed

### Step 4: Pipeline Configuration

```
Definition: Pipeline script from SCM
SCM: Git
  Repository URL: https://github.com/Thanujan001/PhoneShop-main.git
  Branch: main
  Script Path: Jenkinsfile
```

### Step 5: Additional Options

```
Lightweight checkout: ☑ (unchecked for full history)
Submodules: ☑ Recursively update submodules
```

### Step 6: Save

Click "Save" button at the bottom

---

## GitHub Webhook Configuration

### Step 1: Jenkins Setup

1. Jenkins Dashboard → Manage Jenkins → Configure System
2. GitHub section:
   - API URL: `https://api.github.com` (for public GitHub)
   - Click "Test connection"
   - Should show your GitHub username

### Step 2: GitHub Webhook

1. Go to your GitHub repo
2. Settings → Webhooks → Add webhook
3. Fill in:
   ```
   Payload URL: http://your-jenkins-url:8080/github-webhook/
   Content type: application/json
   Events: Just the push event
   Active: ☑ Checked
   ```
4. Click "Add webhook"

### Step 3: Test Webhook

1. In GitHub, go to Settings → Webhooks
2. Click on the webhook you just created
3. Scroll down to "Recent Deliveries"
4. Click the latest delivery
5. Check the Response tab - should see success

---

## Docker Credentials Configuration

### Add Docker Hub Registry

1. Jenkins Dashboard → Manage Jenkins → Configure System
2. Scroll to "Docker" section
3. Add Docker configuration:
   ```
   Docker Host URI: unix:///var/run/docker.sock
   Server credentials: select your docker credential
   ```

---

## AWS ECS Task Definition Example

Create in AWS Console before deploying:

### For Server Service

```json
{
  "family": "phoneshop-server",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["EC2"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "server",
      "image": "yourusername/phoneshop-server:latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 5000,
          "hostPort": 5000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "PORT",
          "value": "5000"
        },
        {
          "name": "MONGODB",
          "value": "mongodb://mongo-host:27017/Phone"
        }
      ]
    }
  ]
}
```

### For Client Service

```json
{
  "family": "phoneshop-client",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["EC2"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "client",
      "image": "yourusername/phoneshop-client:latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 80,
          "hostPort": 3000,
          "protocol": "tcp"
        }
      ]
    }
  ]
}
```

---

## Verification Commands

### Verify Docker Hub Access

```bash
# Test Docker Hub login
docker login -u YOUR_USERNAME -p YOUR_TOKEN

# Result should be:
# Login Succeeded
```

### Verify AWS Credentials

```bash
# Test AWS credentials
aws sts get-caller-identity --region us-east-1

# Should return:
# {
#   "UserId": "AIDAI...",
#   "Account": "123456789012",
#   "Arn": "arn:aws:iam::123456789012:user/jenkins-phoneshop-cicd"
# }
```

### Verify ECS Access

```bash
# List ECS clusters
aws ecs list-clusters --region us-east-1

# Should show:
# cluster-phoneshop-dev
```

### Verify ECR Access

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin YOUR_ECR_REGISTRY

# Result should be:
# Login Succeeded
```

---

## Jenkins Configuration as Code (JCasC)

### Setup Jenkins with YAML Configuration

Create `jenkins.yaml`:

```yaml
jenkins:
  securityRealm:
    saml: {}
  authorizationStrategy:
    roleBased:
      roles:
        global:
          - name: admin
            permissions:
              - Overall/Administer
          - name: developer
            permissions:
              - Overall/Read
              - Job/Build
              - Job/Read
credentials:
  system:
    domainCredentials:
      - credentials:
          - basic:
              scope: GLOBAL
              id: docker
              username: ${DOCKER_USERNAME}
              password: ${DOCKER_PASSWORD}
          - vaultString:
              scope: GLOBAL
              id: vite-backend-url
              secret: ${VITE_BACKEND_URL}
          - vaultString:
              scope: GLOBAL
              id: aws-region
              secret: ${AWS_REGION}
          - vaultString:
              scope: GLOBAL
              id: ecr-registry
              secret: ${ECR_REGISTRY}
unclassified:
  location:
    url: http://jenkins.example.com/
  github:
    apiUrl: https://api.github.com
    clientID: ${GITHUB_CLIENT_ID}
    clientSecret: ${GITHUB_CLIENT_SECRET}
```

---

## Troubleshooting Credential Issues

### Issue: "Invalid credentials for Docker Hub"

**Solution:**
1. Verify credentials in Jenkins: Credentials → docker
2. Test token validity: `docker login -u USERNAME -p TOKEN`
3. Ensure token hasn't expired (create new one if needed)

### Issue: "AWS access denied"

**Solution:**
1. Verify IAM user permissions: AWS Console → IAM → Users
2. Check credentials: `aws sts get-caller-identity`
3. Verify region setting matches your ECS cluster region

### Issue: "ECR login failed"

**Solution:**
1. Verify ECR registry URL format: `ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com`
2. Test ECR login: `aws ecr get-login-password | docker login ...`
3. Ensure IAM user has ECR permissions

### Issue: "GitHub webhook not triggering"

**Solution:**
1. Verify Jenkins URL is accessible from GitHub
2. Check webhook delivery in GitHub: Settings → Webhooks → Recent Deliveries
3. Ensure pipeline job has GitHub trigger enabled

---

## Security Best Practices

1. **Use Short-lived Credentials:** Rotate access keys every 90 days
2. **Limit Permissions:** Use IAM policies with minimal required permissions
3. **Use Secrets Manager:** Consider AWS Secrets Manager for advanced setups
4. **Enable Audit Logs:** Track all credential access and pipeline executions
5. **HTTPS Only:** Use HTTPS for GitHub webhook and Jenkins URL
6. **Mask Secrets:** Ensure sensitive data is masked in logs
7. **Review Logs:** Regularly review Jenkins logs for suspicious activity

---

**Last Updated:** 2026-02-23
**Version:** 1.0
