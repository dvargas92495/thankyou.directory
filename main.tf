terraform {
  backend "remote" {
    hostname = "app.terraform.io"
    organization = "VargasArts"
    workspaces {
      prefix = "thankyou-directory"
    }
  }
  required_providers {
    github = {
      source = "integrations/github"
      version = "4.2.0"
    }
  }
}

variable "aws_access_token" {
  type = string
}

variable "aws_secret_token" {
  type = string
}

variable "github_token" {
  type = string
}

variable "secret" {
  type = string
}

variable "mysql_password" {
  type = string
}

variable "clerk_api_key" {
    type = string
}

locals {
  paths = fileset("${path.module}/functions", "[^_]**.ts")
}

data "aws_iam_role" "roamjs_lambda_role" {
  name = "roam-js-extensions-lambda-execution"
}

data "archive_file" "dummy" {
  type        = "zip"
  output_path = "./dummy.zip"

  source {
    content   = "${join(" | ", local.paths)}"
    filename  = "dummy.js"
  }
}

resource "aws_lambda_function" "lambda_function" {
  function_name = "dummy_function"
  handler       = "dummy_function.handler"
   role          = data.aws_iam_role.roamjs_lambda_role.arn
  filename      = data.archive_file.dummy.output_path
  runtime       = "nodejs12.x"
}

provider "aws" {
  region = "us-east-1"
  access_key = var.aws_access_token
  secret_key = var.aws_secret_token
}

provider "github" {
  owner = "dvargas92495"
  token = var.github_token
}

module "aws_static_site" {
  source  = "dvargas92495/static-site/aws"
  version = "3.1.3"

  domain = "thankyou.directory"
  secret = var.secret
  tags = {
      Application = "thankyou-directory"
  }

  providers = {
    aws.us-east-1 = aws
  }
}

module "aws-serverless-backend" {
    source  = "dvargas92495/serverless-backend/aws"
    version = "1.5.15"

    api_name = "thankyou-directory"
    domain = "thankyou.directory"
    paths = [
      "applications/delete",
      "applications/get",
      "applications/post",
      "applications/put",
      "sponsors/get",
      "sponsors/post"
    ]

    tags = {
        Application = "thankyou-directory"
    }
}

module "aws_clerk" {
  source   = "dvargas92495/clerk/aws"
  version = "1.0.1"

  zone_id  = module.aws_static_site.route53_zone_id
  clerk_id = "auitknq6b0p7"
}

resource "github_actions_secret" "deploy_aws_access_key" {
  repository       = "thankyou.directory"
  secret_name      = "DEPLOY_AWS_ACCESS_KEY"
  plaintext_value  = module.aws_static_site.deploy-id
}

resource "github_actions_secret" "deploy_aws_access_secret" {
  repository       = "thankyou.directory"
  secret_name      = "DEPLOY_AWS_ACCESS_SECRET"
  plaintext_value  = module.aws_static_site.deploy-secret
}

resource "github_actions_secret" "lambda_aws_access_key" {
  repository       = "thankyou.directory"
  secret_name      = "LAMBDA_AWS_ACCESS_KEY"
  plaintext_value  = module.aws-serverless-backend.access_key
}

resource "github_actions_secret" "lambda_aws_access_secret" {
  repository       = "thankyou.directory"
  secret_name      = "LAMBDA_AWS_ACCESS_SECRET"
  plaintext_value  = module.aws-serverless-backend.secret_key
}

resource "github_actions_secret" "mysql_password" {
  repository       = "thankyou.directory"
  secret_name      = "MYSQL_PASSWORD"
  plaintext_value  = var.mysql_password
}

resource "github_actions_secret" "clerk_api_key" {
  repository       = "thankyou.directory"
  secret_name      = "CLERK_API_KEY"
  plaintext_value  = var.clerk_api_key
}
