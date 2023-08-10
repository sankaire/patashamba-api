terraform {
  backend "s3" {
    bucket         = "patashamba-backend-tf-state"
    key            = "patashamba-backend.tfstate"
    region         = "eu-west-3"
    encrypt        = true
    dynamodb_table = "patashamba-backend-tf-state-log"
  }
  required_providers {
    aws = {
      version = "~> 2.50.0"
    }
  }
}


provider "aws" {
  region = "eu-west-3"
}

locals {
  prefix = "${var.prefix}-${terraform.workspace}"
  common_tags = {
    Environment = terraform.workspace
    ManagedBy   = "Terraform"
  }
}
# resource we can use to access region we are applying terraform to
data "aws_region" "current" {}