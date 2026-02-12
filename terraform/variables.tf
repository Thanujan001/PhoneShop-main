variable "subscription_id" {
  description = "Azure Subscription ID"
  type        = string
  sensitive   = true
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "phoneshop"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "eastus"
}

variable "container_registry_name" {
  description = "Name of the Azure Container Registry"
  type        = string
  default     = "phoneshopacr"
}

variable "docker_image_tag" {
  description = "Docker image tag/version"
  type        = string
  default     = "latest"
}

# Server Configuration
variable "server_image" {
  description = "Docker image for backend server"
  type        = string
}

variable "server_memory" {
  description = "Memory allocation for server (Gi)"
  type        = string
  default     = "1"
}

variable "server_cpu" {
  description = "CPU allocation for server"
  type        = string
  default     = "0.5"
}

variable "server_port" {
  description = "Port for backend server"
  type        = number
  default     = 5000
}

variable "server_replicas" {
  description = "Number of server replicas"
  type        = number
  default     = 2
}

# Client Configuration
variable "client_image" {
  description = "Docker image for client frontend"
  type        = string
}

variable "client_memory" {
  description = "Memory allocation for client (Gi)"
  type        = string
  default     = "0.5"
}

variable "client_cpu" {
  description = "CPU allocation for client"
  type        = string
  default     = "0.25"
}

variable "client_port" {
  description = "Port for client"
  type        = number
  default     = 3000
}

variable "client_replicas" {
  description = "Number of client replicas"
  type        = number
  default     = 2
}

# Admin Configuration
variable "admin_image" {
  description = "Docker image for admin dashboard"
  type        = string
}

variable "admin_memory" {
  description = "Memory allocation for admin (Gi)"
  type        = string
  default     = "0.5"
}

variable "admin_cpu" {
  description = "CPU allocation for admin"
  type        = string
  default     = "0.25"
}

variable "admin_port" {
  description = "Port for admin"
  type        = number
  default     = 3000
}

variable "admin_replicas" {
  description = "Number of admin replicas"
  type        = number
  default     = 1
}

# Database Configuration
variable "mongodb_admin_username" {
  description = "MongoDB admin username"
  type        = string
  default     = "mongodbadmin"
  sensitive   = true
}

variable "mongodb_admin_password" {
  description = "MongoDB admin password"
  type        = string
  sensitive   = true
}

variable "mongodb_database_name" {
  description = "MongoDB database name"
  type        = string
  default     = "mydatabase"
}

variable "mongodb_storage_gb" {
  description = "MongoDB storage in GB"
  type        = number
  default     = 10
}

# Application Configuration
variable "stripe_api_key" {
  description = "Stripe API key"
  type        = string
  sensitive   = true
  default     = ""
}

variable "jwt_secret" {
  description = "JWT secret for authentication"
  type        = string
  sensitive   = true
  default     = ""
}

variable "tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
  default = {
    Environment = "PhoneShop"
    ManagedBy   = "Terraform"
  }
}
