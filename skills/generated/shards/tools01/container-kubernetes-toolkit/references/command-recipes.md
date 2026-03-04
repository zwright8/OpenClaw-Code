# Container & Kubernetes Toolkit Command Recipes

Use these as starting points. Adapt paths, namespaces, and credentials to the task context.

## 1. Build image with Buildx

```bash
docker buildx build --platform linux/amd64,linux/arm64 -t app:latest .
```

Build multi-arch image.

## 2. Inspect cluster resources

```bash
kubectl get pods -A
```

Quick global pod health check.

## 3. Deploy Helm chart

```bash
helm upgrade --install app ./chart -n app --create-namespace
```

Idempotent chart rollout.

## 4. Render Kustomize manifests

```bash
kubectl kustomize ./overlays/prod
```

Preview merged manifests before apply.

## 5. Tail logs across pods

```bash
stern app -n app
```

Aggregate matching pod logs.

