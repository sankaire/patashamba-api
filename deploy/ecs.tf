resource "aws_ecs_cluster" "cluster" {
  name = "${local.prefix}-cluster"
  tags = local.common_tags
}

resource "aws_iam_policy" "task_execution_role_policy" {
  name        = "${local.prefix}-task-exec-role-policy"
  path        = "/"
  description = "Allow retrieving of images and adding to logs"
  policy      = file("./templates/task-exec-role.json")
}

resource "aws_iam_role" "task_execution_role" {
  name               = "${local.prefix}-task-exec-role"
  assume_role_policy = file("./templates/assume-role-policy.json")

  tags = local.common_tags
}

resource "aws_iam_role_policy_attachment" "task_execution_role" {
  role       = aws_iam_role.task_execution_role.name
  policy_arn = aws_iam_policy.task_execution_role_policy.arn
}

resource "aws_iam_role" "app_iam_role" {
  name               = "${local.prefix}-api-task"
  assume_role_policy = file("./templates/assume-role-policy.json")

  tags = local.common_tags
}

resource "aws_cloudwatch_log_group" "ecs_task_logs" {
  name = "${local.prefix}-api"

  tags = local.common_tags
}
# template for container definition
data "template_file" "api_container_definitions" {
  template = file(lookup(var.ecs_container_definition, terraform.workspace))

  vars = {
    api_image        = var.ecr_image_api
    log_group_name   = aws_cloudwatch_log_group.ecs_task_logs.name
    log_group_region = data.aws_region.current.name
    API_KEY          = var.API_KEY
    USERNAME         = var.USERNAME
    DB_URI           = var.DB_URI
  }
}

resource "aws_ecs_task_definition" "api" {
  family                   = "${local.prefix}-api"
  container_definitions    = data.template_file.api_container_definitions.rendered
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = lookup(var.ecs_cpu, terraform.workspace)
  memory                   = lookup(var.ecs_memory, terraform.workspace)
  execution_role_arn       = aws_iam_role.task_execution_role.arn
  task_role_arn            = aws_iam_role.app_iam_role.arn
  volume {
    name = "static"
  }

  tags = local.common_tags
}

resource "aws_security_group" "ecs_service" {
  description = "Access for the ECS service"
  name        = "${local.prefix}-ecs-service"
  vpc_id      = aws_vpc.main.id
  # outbound access on port 443
  egress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # public access from internet to API
  ingress {
    from_port = 5000
    to_port   = 5000
    protocol  = "tcp"
    security_groups = [
      aws_security_group.lb.id,
    ]
  }

  tags = local.common_tags
}
# runs container
resource "aws_ecs_service" "api" {
  name             = "${local.prefix}-api"
  cluster          = aws_ecs_cluster.cluster.name
  task_definition  = aws_ecs_task_definition.api.family
  desired_count    = lookup(var.ecs_instance_count, terraform.workspace) # no.of tasks (instances) to run 
  launch_type      = "FARGATE"                                           #serverless docker deployment
  platform_version = "1.4.0"

  network_configuration {
    subnets = [
      aws_subnet.public_a.id,
      aws_subnet.public_b.id,
    ]
    security_groups = [aws_security_group.ecs_service.id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.api.arn
    container_name   = "api"
    container_port   = 5000
  }
}