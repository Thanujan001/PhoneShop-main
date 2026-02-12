output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.main.name
}

output "resource_group_location" {
  description = "Location of the resource group"
  value       = azurerm_resource_group.main.location
}

output "container_registry_url" {
  description = "URL of the Container Registry"
  value       = azurerm_container_registry.main.login_server
}

output "container_registry_id" {
  description = "ID of the Container Registry"
  value       = azurerm_container_registry.main.id
}

output "application_insights_id" {
  description = "ID of Application Insights"
  value       = azurerm_application_insights.main.id
}

output "application_insights_instrumentation_key" {
  description = "Instrumentation key for Application Insights"
  value       = azurerm_application_insights.main.instrumentation_key
  sensitive   = true
}

output "cosmosdb_connection_string" {
  description = "Connection string for Cosmos DB"
  value       = azurerm_cosmosdb_account.mongodb.connection_strings[0]
  sensitive   = true
}

output "cosmosdb_primary_master_key" {
  description = "Primary master key for Cosmos DB"
  value       = azurerm_cosmosdb_account.mongodb.primary_key
  sensitive   = true
}

output "key_vault_id" {
  description = "ID of the Key Vault"
  value       = azurerm_key_vault.main.id
}

output "key_vault_uri" {
  description = "URI of the Key Vault"
  value       = azurerm_key_vault.main.vault_uri
}

output "container_app_environment_id" {
  description = "ID of the Container Apps Environment"
  value       = azurerm_container_app_environment.main.id
}

output "server_app_fqdn" {
  description = "FQDN of the Server Container App"
  value       = azurerm_container_app.server.ingress[0].fqdn
}

output "server_app_url" {
  description = "Full URL of the Server Container App"
  value       = "https://${azurerm_container_app.server.ingress[0].fqdn}"
}

output "client_app_fqdn" {
  description = "FQDN of the Client Container App"
  value       = azurerm_container_app.client.ingress[0].fqdn
}

output "client_app_url" {
  description = "Full URL of the Client Container App"
  value       = "https://${azurerm_container_app.client.ingress[0].fqdn}"
}

output "admin_app_fqdn" {
  description = "FQDN of the Admin Container App"
  value       = azurerm_container_app.admin.ingress[0].fqdn
}

output "admin_app_url" {
  description = "Full URL of the Admin Container App"
  value       = "https://${azurerm_container_app.admin.ingress[0].fqdn}"
}

output "log_analytics_workspace_id" {
  description = "ID of the Log Analytics Workspace"
  value       = azurerm_log_analytics_workspace.main.id
}
