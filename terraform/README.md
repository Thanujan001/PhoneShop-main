# Phone Shop Terraform Configuration

This directory contains Terraform configuration files for deploying the Phone Shop application to Azure.

## Architecture

The Terraform configuration deploys the following services to Azure:

- **Container Registry**: Stores Docker images
- **Container Apps**: Hosts the three microservices (server, client, admin)
- **Cosmos DB (MongoDB)**: Database for application data
- **Application Insights**: Monitoring and logging
- **Key Vault**: Secrets management
- **Log Analytics Workspace**: Centralized logging

## Prerequisites

1. **Azure Account**: Active Azure subscription
2. **Terraform**: Version 1.0 or higher
3. **Azure CLI**: Installed and logged in
4. **Docker Images**: Built and pushed to container registry

## Setup Instructions

### 1. Authenticate with Azure

```bash
az login
az account set --subscription <your-subscription-id>
```

### 2. Create Configuration File

```bash
cp terraform.tfvars.example terraform.tfvars
```

### 3. Edit terraform.tfvars

Update the following required values:

- `subscription_id`: Your Azure subscription ID
- `server_image`: Full path to server image (e.g., `acr.azurecr.io/server:latest`)
- `client_image`: Full path to client image (e.g., `acr.azurecr.io/client:latest`)
- `admin_image`: Full path to admin image (e.g., `acr.azurecr.io/admin:latest`)
- `mongodb_admin_password`: Strong password for MongoDB

### 4. Initialize Terraform

```bash
terraform init
```

### 5. Plan Deployment

```bash
terraform plan -out=tfplan
```

### 6. Apply Configuration

```bash
terraform apply tfplan
```

## Building and Pushing Docker Images

Before deploying, ensure your Docker images are built and pushed to Azure Container Registry:

```bash
# Set ACR variables
ACR_NAME="phoneshopacr"
ACR_URL="${ACR_NAME}.azurecr.io"
IMAGE_TAG="latest"

# Login to ACR
az acr login --name $ACR_NAME

# Build images
docker build -t ${ACR_URL}/server:${IMAGE_TAG} ./server
docker build -t ${ACR_URL}/client:${IMAGE_TAG} ./client
docker build -t ${ACR_URL}/admin:${IMAGE_TAG} ./admin

# Push images
docker push ${ACR_URL}/server:${IMAGE_TAG}
docker push ${ACR_URL}/client:${IMAGE_TAG}
docker push ${ACR_URL}/admin:${IMAGE_TAG}
```

## Configuration Variables

### Core Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `subscription_id` | Azure subscription ID | - | Yes |
| `project_name` | Project name for resources | `phoneshop` | No |
| `environment` | Environment name (dev, staging, prod) | `dev` | No |
| `location` | Azure region | `eastus` | No |

### Service Configuration

#### Server (Backend)
- `server_image`: Docker image URL
- `server_memory`: Memory in Gi (default: 1)
- `server_cpu`: CPU allocation (default: 0.5)
- `server_replicas`: Number of replicas (default: 2)

#### Client (Frontend)
- `client_image`: Docker image URL
- `client_memory`: Memory in Gi (default: 0.5)
- `client_cpu`: CPU allocation (default: 0.25)
- `client_replicas`: Number of replicas (default: 2)

#### Admin (Dashboard)
- `admin_image`: Docker image URL
- `admin_memory`: Memory in Gi (default: 0.5)
- `admin_cpu`: CPU allocation (default: 0.25)
- `admin_replicas`: Number of replicas (default: 1)

### Database Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `mongodb_admin_username` | MongoDB admin username | `mongodbadmin` |
| `mongodb_admin_password` | MongoDB admin password | - |
| `mongodb_database_name` | Database name | `mydatabase` |

### Optional Application Secrets

| Variable | Description |
|----------|-------------|
| `stripe_api_key` | Stripe API key for payments |
| `jwt_secret` | JWT secret for authentication |

## Accessing the Application

After deployment, Terraform outputs will provide the URLs:

- **Server API**: `https://<server-fqdn>`
- **Client App**: `https://<client-fqdn>`
- **Admin Dashboard**: `https://<admin-fqdn>`

## Managing Resources

### View Outputs

```bash
terraform output
```

### Update Configuration

Edit `terraform.tfvars` and run:

```bash
terraform plan
terraform apply
```

### Destroy Resources

```bash
terraform destroy
```

## Environment Variables

The Container Apps will have the following environment variables automatically set:

- `MONGO_URI`: Connection string to Cosmos DB (from Key Vault)
- `PORT`: Service port (5000 for server)
- `VITE_API_URL`: API endpoint URL (for frontend services)
- `STRIPE_API_KEY`: Stripe key (if configured)
- `JWT_SECRET`: JWT secret (if configured)

## Monitoring

### View Logs

```bash
az monitor log-analytics query \
  --workspace <workspace-id> \
  --analytics-query "ContainerAppConsoleLogs_CL | take 100"
```

### View Application Insights

Access Application Insights through Azure Portal for:
- Request traces
- Performance metrics
- Exception tracking
- Dependency analysis

## Security Best Practices

1. **Key Vault**: All secrets are stored in Azure Key Vault
2. **Network**: Container Apps run with secure networking
3. **SSL/TLS**: All ingress endpoints use HTTPS
4. **Credentials**: Never commit credentials to version control

## Troubleshooting

### Container apps not starting

Check logs:
```bash
az containerapp logs show \
  -n <app-name> \
  -g <resource-group> \
  --follow
```

### Database connection issues

Verify connection string in Key Vault:
```bash
az keyvault secret show \
  --vault-name <vault-name> \
  --name mongo-uri
```

### Authentication errors

Verify Service Principal permissions:
```bash
az role assignment list --output table
```

## Support

For issues or questions:
1. Check Container App logs
2. Review Application Insights
3. Verify terraform.tfvars configuration
4. Check Azure resource quotas

## License

See LICENSE file in project root
