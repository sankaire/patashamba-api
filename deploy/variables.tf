variable "prefix" {
  default = "patashamba"
}

variable "dns_zone_name" {
  description = "Domain name"
  default     = "credistock.net"
}

variable "subdomain" {
  description = "Subdomain per environment"
  type        = map(string)
  default = {
    default = "patashamba"
  }
}

variable "ecr_image_api" {
  description = "ECR image for API"
  default     = "public.ecr.aws/g5p0u0h0/patashamba"
}

variable "ecs_memory" {
  description = "Memory Value for ECS cluster"
  type        = map(number)
  default = {
    # production = 4096
    default = 2048
  }
}

variable "ecs_cpu" {
  description = "CPU value for ECS cluster"
  type        = map(number)
  default = {
    default = 512
  }
}

variable "ecs_container_definition" {
  description = "Path to ECS container definition based on environment"
  type        = map(string)
  default = {
    # production = "./templates/ecs/container-definitions-prod.json.tpl"
    default = "./templates/container-definition.json.tpl"
  }
}

variable "ecs_instance_count" {
  description = "Number of ECS tasks to run"
  type        = map(number)
  default = {
    default = 2
  }
}

variable "api_port" {
  description = "API Port"
  default     = "5000"
}

variable "API_KEY" {
  description = "Africa's Talking API KEY"
}
variable "USERNAME" {
  description = "Africa's Talking Username"
}

variable "DB_URI" {
  description = "mongo DB URI"
}