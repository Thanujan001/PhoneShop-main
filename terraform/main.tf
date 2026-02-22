locals {
  resource_name = "phoneshop-${var.environment}"
  
  common_tags = merge(
    var.tags,
    {
      Project     = "phoneshop"
      Environment = var.environment
    }
  )
}

# --- Networking ---

resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = merge(local.common_tags, { Name = "vpc-${local.resource_name}" })
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = merge(local.common_tags, { Name = "igw-${local.resource_name}" })
}

data "aws_availability_zones" "available" {}

resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 8, count.index)
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = merge(local.common_tags, { Name = "public-subnet-${count.index}-${local.resource_name}" })
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = merge(local.common_tags, { Name = "public-rt-${local.resource_name}" })
}

resource "aws_route_table_association" "public" {
  count          = 2
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# --- Security Groups ---

resource "aws_security_group" "alb" {
  name        = "alb-sg-${local.resource_name}"
  description = "Allow HTTP inbound traffic"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = local.common_tags
}

resource "aws_security_group" "ecs_tasks" {
  name        = "ecs-tasks-sg-${local.resource_name}"
  description = "Allow inbound access from ALB only"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = local.common_tags
}

# --- Load Balancer ---

resource "aws_lb" "main" {
  name               = "alb-${local.resource_name}"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id

  tags = local.common_tags
}

# Server Target Group & Listener Rule
resource "aws_lb_target_group" "server" {
  name        = "server-tg-${local.resource_name}"
  port        = var.server_port
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    path = "/"
    port = var.server_port
  }
}

# Client Target Group
resource "aws_lb_target_group" "client" {
  name        = "client-tg-${local.resource_name}"
  port        = var.client_port
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    path = "/"
    port = var.client_port
  }
}

# Admin Target Group
resource "aws_lb_target_group" "admin" {
  name        = "admin-tg-${local.resource_name}"
  port        = var.admin_port
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    path = "/"
    port = var.admin_port
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "fixed-response"
    fixed_response {
      content_type = "text/plain"
      message_body = "Not Found"
      status_code  = "404"
    }
  }
}

# Routing rules (simplified for first pass)
resource "aws_lb_listener_rule" "client" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.client.arn
  }

  condition {
    host_header {
      values = ["client.*"]
    }
  }
}

resource "aws_lb_listener_rule" "admin" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 200

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.admin.arn
  }

  condition {
    host_header {
      values = ["admin.*"]
    }
  }
}

resource "aws_lb_listener_rule" "server" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 300

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.server.arn
  }

  condition {
    host_header {
      values = ["api.*"]
    }
  }
}

# --- ECR Repositories ---

resource "aws_ecr_repository" "server" {
  name = "phoneshop-server"
  tags = local.common_tags
}

resource "aws_ecr_repository" "client" {
  name = "phoneshop-client"
  tags = local.common_tags
}

resource "aws_ecr_repository" "admin" {
  name = "phoneshop-admin"
  tags = local.common_tags
}

# --- ECS Cluster ---

resource "aws_ecs_cluster" "main" {
  name = "cluster-${local.resource_name}"
  tags = local.common_tags
}

# IAM Roles for ECS
resource "aws_iam_role" "ecs_execution" {
  name = "ecsExecutionRole-${local.resource_name}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution" {
  role       = aws_iam_role.ecs_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# --- ECS Services (Server) ---

resource "aws_ecs_task_definition" "server" {
  family                   = "server"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 512
  memory                   = 1024
  execution_role_arn       = aws_iam_role.ecs_execution.arn

  container_definitions = jsonencode([{
    name      = "server"
    image     = "${aws_ecr_repository.server.repository_url}:latest"
    essential = true
    portMappings = [{
      containerPort = var.server_port
      hostPort      = var.server_port
    }]
    environment = [
      { name = "PORT", value = tostring(var.server_port) },
      { name = "JWT_SECRET", value = var.jwt_secret },
      { name = "STRIPE_SECRET_KEY", value = var.stripe_api_key }
    ]
  }])
}

resource "aws_ecs_service" "server" {
  name            = "server"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.server.arn
  launch_type     = "FARGATE"
  desired_count   = var.server_replicas

  network_configuration {
    subnets          = aws_subnet.public[*].id
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.server.arn
    container_name   = "server"
    container_port   = var.server_port
  }

  depends_on = [aws_lb_listener.http]
}

# --- ECS Services (Client) ---

resource "aws_ecs_task_definition" "client" {
  family                   = "client"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.ecs_execution.arn

  container_definitions = jsonencode([{
    name      = "client"
    image     = "${aws_ecr_repository.client.repository_url}:latest"
    essential = true
    portMappings = [{
      containerPort = var.client_port
      hostPort      = var.client_port
    }]
    environment = [
       { name = "VITE_BACKEND_URL", value = "http://${aws_lb.main.dns_name}" }
    ]
  }])
}

resource "aws_ecs_service" "client" {
  name            = "client"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.client.arn
  launch_type     = "FARGATE"
  desired_count   = var.client_replicas

  network_configuration {
    subnets          = aws_subnet.public[*].id
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.client.arn
    container_name   = "client"
    container_port   = var.client_port
  }

  depends_on = [aws_lb_listener.http]
}

# --- ECS Services (Admin) ---

resource "aws_ecs_task_definition" "admin" {
  family                   = "admin"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.ecs_execution.arn

  container_definitions = jsonencode([{
    name      = "admin"
    image     = "${aws_ecr_repository.admin.repository_url}:latest"
    essential = true
    portMappings = [{
      containerPort = var.admin_port
      hostPort      = var.admin_port
    }]
    environment = [
       { name = "VITE_BACKEND_URL", value = "http://${aws_lb.main.dns_name}" }
    ]
  }])
}

resource "aws_ecs_service" "admin" {
  name            = "admin"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.admin.arn
  launch_type     = "FARGATE"
  desired_count   = var.admin_replicas

  network_configuration {
    subnets          = aws_subnet.public[*].id
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.admin.arn
    container_name   = "admin"
    container_port   = var.admin_port
  }

  depends_on = [aws_lb_listener.http]
}
