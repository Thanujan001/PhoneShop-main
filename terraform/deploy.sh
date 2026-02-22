#!/bin/bash

# Phone Shop Terraform Deployment Script for AWS

echo "========================================"
echo "Phone Shop Terraform Deployment (AWS)"
echo "========================================"
echo ""

# Step 1: Navigate to terraform directory
# Adjust path if needed
cd "$(dirname "$0")"
echo "✓ Changed to terraform directory"
echo ""

# Step 2: Check if terraform.tfvars exists
if [ ! -f "terraform.tfvars" ]; then
    echo "📋 Creating terraform.tfvars from example..."
    cp terraform.tfvars.example terraform.tfvars
    echo "✓ File created. Edit with your values:"
    echo "  - aws_region"
    echo "  - mongodb_admin_password"
    echo ""
    exit 0
fi

# Step 3: Verify AWS login
echo "🔐 Checking AWS authentication..."
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ Not authenticated with AWS"
    echo "Please run: aws configure"
    exit 1
fi

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output tsv)
echo "✓ Authenticated as Account: $ACCOUNT_ID"
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
read -p "Ready to deploy to AWS? (yes/no): " response
if [ "$response" = "yes" ]; then
    echo "🚀 Deploying to AWS..."
    terraform apply tfplan
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Deployment completed successfully!"
        echo ""
        echo "📍 Resource Info:"
        terraform output
    fi
else
    echo "❌ Deployment cancelled"
fi
