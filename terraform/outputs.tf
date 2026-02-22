output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "ecr_repository_server_url" {
  description = "URL of the Server ECR Repository"
  value       = aws_ecr_repository.server.repository_url
}

output "ecr_repository_client_url" {
  description = "URL of the Client ECR Repository"
  value       = aws_ecr_repository.client.repository_url
}

output "ecr_repository_admin_url" {
  description = "URL of the Admin ECR Repository"
  value       = aws_ecr_repository.admin.repository_url
}

output "alb_dns_name" {
  description = "DNS name of the Load Balancer"
  value       = aws_lb.main.dns_name
}

output "server_service_name" {
  description = "Name of the Server ECS Service"
  value       = aws_ecs_service.server.name
}

output "client_service_name" {
  description = "Name of the Client ECS Service"
  value       = aws_ecs_service.client.name
}

output "admin_service_name" {
  description = "Name of the Admin ECS Service"
  value       = aws_ecs_service.admin.name
}

output "ecs_cluster_name" {
  description = "Name of the ECS Cluster"
  value       = aws_ecs_cluster.main.name
}
