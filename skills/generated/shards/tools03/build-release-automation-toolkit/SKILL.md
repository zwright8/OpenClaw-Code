---
name: build-release-automation-toolkit
description: Automate build, versioning, packaging, and release workflows. Use when orchestrating CI pipelines, building artifacts, tagging releases, or standardizing multi-repo delivery processes.
---

# Build Release Automation Toolkit

Use this skill to turn ad hoc build steps into deterministic, repeatable release pipelines.

## Workflow Router

- Need CI pipeline simulation/local debug -> gitlab-ci-local/buildkit/dagger path.
- Need semantic versioning and release branching -> gitversion/git-flow/git-town path.
- Need frontend/backend build packaging -> nx/esbuild/webpack/gradle path.

## Playbook 1: Debug CI pipeline locally

1. Replay CI stages with local runner parity.
1. Build artifacts in clean containerized environment.
1. Patch pipeline before re-running remote CI.

Command starters:
```bash
gitlab-ci-local <job>
buildctl build --frontend=dockerfile.v0 --local context=. --local dockerfile=.
dagger call <pipeline-fn>
```

## Playbook 2: Run release branch and version flow

1. Compute next semantic version from git history.
1. Create/review release branch and changelog delta.
1. Tag and publish after artifact verification.

Command starters:
```bash
gitversion
git flow release start <version>
git town sync
```

## Playbook 3: Produce optimized production builds

1. Run monorepo graph-aware builds.
1. Bundle/minify targets for deploy environment.
1. Publish to hosting platform when checks pass.

Command starters:
```bash
nx run-many -t build
esbuild src/index.ts --bundle --minify --outfile=dist/app.js
netlify deploy --prod
```

## Tool Inventory Reference

- Read `references/tool-map.csv` for the full rank-mapped tool list for this workflow cluster.
- Read `references/tool-notes.md` for quick top-tool guidance.
- Prefer tools already installed locally before suggesting new installs.

## Completion Checklist

- Confirm objective, scope, and target environment before running commands.
- Execute smallest safe test first, then expand to full workflow.
- Capture outputs (logs, reports, artifacts) and summarize follow-up actions.
