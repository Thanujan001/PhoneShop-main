#!/bin/bash

# Phone Shop Terraform Deployment Script for WSL

echo "========================================"
echo "Phone Shop Terraform Deployment"
echo "========================================"
echo ""

# Step 1: Navigate to terraform directory
cd /mnt/g/Projects/PhoneShop-main/terraform
echo "✓ Changed to terraform directory"
echo ""

# Step 2: Check if terraform.tfvars exists
if [ ! -f "terraform.tfvars" ]; then
    echo "📋 Creating terraform.tfvars from example..."
    cp terraform.tfvars.example terraform.tfvars
    echo "✓ File created. Edit with your values:"
    echo "  - subscription_id"
    echo "  - mongodb_admin_password"
    echo "  - server_image, client_image, admin_image"
    echo ""
    echo "  Run: nano terraform.tfvars"
    exit 0
fi

# Step 3: Verify Azure login
echo "🔐 Checking Azure authentication..."
if ! az account show > /dev/null 2>&1; then
    echo "❌ Not authenticated with Azure"
    echo "Please run: az login --use-device-code"
    echo "Then visit: https://microsoft.com/devicelogin"
    exit 1
fi

SUBSCRIPTION=$(az account show --query id -o tsv)
echo "✓ Authenticated as: $SUBSCRIPTION"
echo ""

# Step 4: Terraform Init
echo "🔨 Initializing Terraform..."
terraform init
if [ $? -ne 0 ]; then
    echo "❌ Terraform init failed"
    exit 1
fi
echo "✓ Terraform initialized"
echo ""

# Step 5: Validate
echo "✅ Validating Terraform configuration..."
terraform validate
if [ $? -ne 0 ]; then
    echo "❌ Configuration validation failed"
    exit 1
fi
echo "✓ Configuration is valid"
echo ""

# Step 6: Plan
echo "📊 Creating deployment plan..."
terraform plan -out=tfplan
if [ $? -ne 0 ]; then
    echo "❌ Terraform plan failed"
    exit 1
fi
echo "✓ Plan created successfully"
echo ""

# Step 7: Apply
echo ""
read -p "Ready to deploy? (yes/no): " response
if [ "$response" = "yes" ]; then
    echo "🚀 Deploying to Azure..."
    terraform apply tfplan
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Deployment completed successfully!"
        echo ""
        echo "📍 Application URLs:"
        terraform output -json | grep -E "url|fqdn"
    fi
else
    echo "❌ Deployment cancelled"
fi
