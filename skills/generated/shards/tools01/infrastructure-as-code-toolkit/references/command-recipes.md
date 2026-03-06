# Infrastructure as Code Toolkit Command Recipes

Use these as starting points. Adapt paths, namespaces, and credentials to the task context.

## 1. Terraform init/plan

```bash
terraform init && terraform plan -out=tfplan
```

Create reproducible plan artifact.

## 2. Terragrunt run-all plan

```bash
terragrunt run-all plan
```

Plan all modules in dependency order.

## 3. OpenTofu plan

```bash
tofu plan
```

Plan with Terraform-compatible OpenTofu CLI.

## 4. Run Checkov scan

```bash
checkov -d .
```

Scan IaC for policy/security issues.

## 5. Lint CloudFormation

```bash
cfn-lint template.yaml
```

Catch CloudFormation issues early.

