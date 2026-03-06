# Quality, Lint & Testing Toolkit Command Recipes

Use these as starting points. Adapt paths, namespaces, and credentials to the task context.

## 1. Run pre-commit hooks

```bash
pre-commit run --all-files
```

Execute repository quality hooks consistently.

## 2. Run Ruff checks

```bash
ruff check .
```

Fast Python lint and import checks.

## 3. Format shell scripts

```bash
shfmt -w .
```

Normalize shell formatting.

## 4. Lint GitHub Actions

```bash
actionlint
```

Catch workflow syntax and logic issues.

## 5. Load test service

```bash
k6 run loadtest.js
```

Run scriptable performance test.

