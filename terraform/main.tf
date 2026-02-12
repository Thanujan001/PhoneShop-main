locals {
  resource_name = "${var.project_name}-${var.environment}"
  
  common_tags = merge(
    var.tags,
    {
      Project     = var.project_name
      Environment = var.environment
    }
  )
}

# Resource Group
resource "azurerm_resource_group" "main" {
  name     = "rg-${local.resource_name}"
  location = var.location

  tags = local.common_tags
}

# Application Insights
resource "azurerm_application_insights" "main" {
  name                = "appinsights-${local.resource_name}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  application_type    = "web"

  tags = local.common_tags
}

# Log Analytics Workspace
resource "azurerm_log_analytics_workspace" "main" {
  name                = "law-${local.resource_name}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                 = "PerGB2018"
  retention_in_days   = 30

  tags = local.common_tags
}

# Container Registry
resource "azurerm_container_registry" "main" {
  name                = replace("${var.container_registry_name}${var.environment}", "-", "")
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                 = "Basic"
  admin_enabled       = true

  tags = local.common_tags
}

# Azure Cosmos DB for MongoDB
resource "azurerm_cosmosdb_account" "mongodb" {
  name                      = "cosmosdb-${local.resource_name}"
  location                  = azurerm_resource_group.main.location
  resource_group_name       = azurerm_resource_group.main.name
  offer_type                = "Standard"
  kind                      = "MongoDB"
  consistency_policy {
    consistency_level       = "Session"
    max_interval_in_seconds = 5
    max_staleness_prefix    = 100
  }

  capabilities {
    name = "EnableMongo"
  }

  geo_location {
    location          = azurerm_resource_group.main.location
    failover_priority = 0
  }

  tags = local.common_tags
}

# Cosmos DB MongoDB Database
resource "azurerm_cosmosdb_mongo_database" "main" {
  account_name        = azurerm_cosmosdb_account.mongodb.name
  resource_group_name = azurerm_resource_group.main.name
  name                = var.mongodb_database_name
}

# Key Vault
resource "azurerm_key_vault" "main" {
  name                = "kv-${replace(local.resource_name, "-", "")}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  tenant_id           = data.azurerm_client_config.current.tenant_id
  sku_name            = "standard"

  enable_for_deployment          = true
  enable_for_template_deployment = true
  enable_for_disk_encryption     = false
  purge_protection_enabled       = false

  tags = local.common_tags
}

# Key Vault Access Policy
resource "azurerm_key_vault_access_policy" "main" {
  key_vault_id = azurerm_key_vault.main.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = data.azurerm_client_config.current.object_id

  secret_permissions = [
    "Backup",
    "Delete",
    "Get",
    "List",
    "Purge",
    "Recover",
    "Restore",
    "Set"
  ]
}

# Store MongoDB connection string in Key Vault
resource "azurerm_key_vault_secret" "mongo_uri" {
  name            = "mongo-uri"
  value           = "mongodb+srv://${var.mongodb_admin_username}:${var.mongodb_admin_password}@${azurerm_cosmosdb_account.mongodb.name}.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000"
  key_vault_id    = azurerm_key_vault.main.id
  depends_on      = [azurerm_key_vault_access_policy.main]
}

# Store Stripe API Key in Key Vault
resource "azurerm_key_vault_secret" "stripe_key" {
  count       = var.stripe_api_key != "" ? 1 : 0
  name        = "stripe-api-key"
  value       = var.stripe_api_key
  key_vault_id = azurerm_key_vault.main.id
  depends_on  = [azurerm_key_vault_access_policy.main]
}

# Store JWT Secret in Key Vault
resource "azurerm_key_vault_secret" "jwt_secret" {
  count       = var.jwt_secret != "" ? 1 : 0
  name        = "jwt-secret"
  value       = var.jwt_secret
  key_vault_id = azurerm_key_vault.main.id
  depends_on  = [azurerm_key_vault_access_policy.main]
}

# Container Apps Environment
resource "azurerm_container_app_environment" "main" {
  name                            = "cae-${local.resource_name}"
  location                        = azurerm_resource_group.main.location
  resource_group_name             = azurerm_resource_group.main.name
  log_analytics_workspace_id      = azurerm_log_analytics_workspace.main.id

  tags = local.common_tags
}

# Backend Server Container App
resource "azurerm_container_app" "server" {
  name                         = "server-${local.resource_name}"
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name          = azurerm_resource_group.main.name
  revision_mode                = "Single"

  template {
    container {
      name   = "server"
      image  = var.server_image
      memory = "${var.server_memory}Gi"
      cpu    = var.server_cpu

      env {
        name  = "MONGO_URI"
        secret_ref = "mongo-uri"
      }

      env {
        name  = "PORT"
        value = var.server_port
      }

      dynamic "env" {
        for_each = var.stripe_api_key != "" ? [1] : []
        content {
          name  = "STRIPE_API_KEY"
          secret_ref = "stripe-key"
        }
      }

      dynamic "env" {
        for_each = var.jwt_secret != "" ? [1] : []
        content {
          name       = "JWT_SECRET"
          secret_ref = "jwt-secret"
        }
      }

      port {
        container_port = var.server_port
        protocol       = "TCP"
      }
    }

    min_replicas = 1
    max_replicas = var.server_replicas
  }

  secret {
    name  = "mongo-uri"
    value = azurerm_key_vault_secret.mongo_uri.value
  }

  dynamic "secret" {
    for_each = var.stripe_api_key != "" ? [1] : []
    content {
      name  = "stripe-key"
      value = var.stripe_api_key
    }
  }

  dynamic "secret" {
    for_each = var.jwt_secret != "" ? [1] : []
    content {
      name  = "jwt-secret"
      value = var.jwt_secret
    }
  }

  ingress {
    allow_insecure_connections = false
    external_enabled           = true
    target_port                = var.server_port
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  tags = local.common_tags

  depends_on = [
    azurerm_cosmosdb_mongo_database.main,
    azurerm_key_vault_secret.mongo_uri
  ]
}

# Client Container App
resource "azurerm_container_app" "client" {
  name                         = "client-${local.resource_name}"
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name          = azurerm_resource_group.main.name
  revision_mode                = "Single"

  template {
    container {
      name   = "client"
      image  = var.client_image
      memory = "${var.client_memory}Gi"
      cpu    = var.client_cpu

      env {
        name  = "VITE_API_URL"
        value = azurerm_container_app.server.ingress[0].fqdn
      }

      port {
        container_port = var.client_port
        protocol       = "TCP"
      }
    }

    min_replicas = 1
    max_replicas = var.client_replicas
  }

  ingress {
    allow_insecure_connections = false
    external_enabled           = true
    target_port                = var.client_port
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  tags = local.common_tags

  depends_on = [azurerm_container_app.server]
}

# Admin Dashboard Container App
resource "azurerm_container_app" "admin" {
  name                         = "admin-${local.resource_name}"
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name          = azurerm_resource_group.main.name
  revision_mode                = "Single"

  template {
    container {
      name   = "admin"
      image  = var.admin_image
      memory = "${var.admin_memory}Gi"
      cpu    = var.admin_cpu

      env {
        name  = "VITE_API_URL"
        value = azurerm_container_app.server.ingress[0].fqdn
      }

      port {
        container_port = var.admin_port
        protocol       = "TCP"
      }
    }

    min_replicas = 1
    max_replicas = var.admin_replicas
  }

  ingress {
    allow_insecure_connections = false
    external_enabled           = true
    target_port                = var.admin_port
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  tags = local.common_tags

  depends_on = [azurerm_container_app.server]
}

# Data source for current Azure client config
data "azurerm_client_config" "current" {}
