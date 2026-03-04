# Git & Repo Collaboration Toolkit Command Recipes

Use these as starting points. Adapt paths, namespaces, and credentials to the task context.

## 1. Create branch and push

```bash
git switch -c feature/my-change && git push -u origin HEAD
```

Start isolated feature workflow.

## 2. Open PR with gh

```bash
gh pr create --fill
```

Create GitHub PR using commit metadata.

## 3. Review PR diff

```bash
gh pr diff 123
```

Inspect pending PR changes quickly.

## 4. Scan for leaked secrets

```bash
gitleaks detect --source .
```

Audit repository content for secrets.

## 5. Rewrite sensitive history

```bash
git filter-repo --path secret.txt --invert-paths
```

Remove sensitive file from history.

