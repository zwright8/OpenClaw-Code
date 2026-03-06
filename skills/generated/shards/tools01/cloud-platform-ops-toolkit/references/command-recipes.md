# Cloud Platform Ops Toolkit Command Recipes

Use these as starting points. Adapt paths, namespaces, and credentials to the task context.

## 1. List AWS profiles

```bash
aws configure list-profiles
```

Check available AWS auth contexts.

## 2. List Azure subscriptions

```bash
az account list -o table
```

Confirm active Azure tenancy/subscriptions.

## 3. Deploy Fly app

```bash
flyctl deploy
```

Ship current app to Fly.

## 4. Deploy Vercel project

```bash
vercel --prod
```

Publish production build.

## 5. Sync files with AzCopy

```bash
azcopy sync ./dist "https://account.blob.core.windows.net/container"
```

Mirror local build artifacts to Blob storage.

