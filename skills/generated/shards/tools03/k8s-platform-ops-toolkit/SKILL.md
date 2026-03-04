---
name: k8s-platform-ops-toolkit
description: Operate Kubernetes platforms across local and remote clusters. Use when tasks involve Helm releases, cluster policy hardening, CRD/operator scaffolding, cert-manager workflows, or diagnosing cluster/runtime health.
---

# K8s Platform Ops Toolkit

Use this skill to plan and execute Kubernetes platform operations from linting through rollout and runtime diagnosis.

## Workflow Router

- Need chart/release changes -> run Helm + kube-linter path.
- Need new platform API/operator -> run kubebuilder/operator-sdk path.
- Need security posture checks -> run kubescape/kyverno/hubble path.

## Playbook 1: Release and validate a Helm deployment

1. Lint manifests/charts before rollout.
1. Preview and apply release changes.
1. Run post-deploy diagnostics and colorized status checks.

Command starters:
```bash
kube-linter lint ./charts
helm repo update
helm upgrade --install <release> <chart> -n <namespace>
kubecolor get pods -n <namespace>
```

## Playbook 2: Bootstrap or evolve an operator/CRD

1. Scaffold API resources.
1. Generate controller manifests and run local tests.
1. Install generated manifests into target cluster.

Command starters:
```bash
kubebuilder init --domain <domain>
operator-sdk create api --group <g> --version <v> --kind <kind>
kubectl apply -f config/crd/bases
```

## Playbook 3: Harden and triage cluster security

1. Scan cluster against hardening rules.
1. Validate and adjust policy controls.
1. Inspect service and network flow to confirm runtime behavior.

Command starters:
```bash
kubescape scan framework nsa
k8sgpt analyze --explain
hubble observe --since 5m
```

## Tool Inventory Reference

- Read `references/tool-map.csv` for the full rank-mapped tool list for this workflow cluster.
- Read `references/tool-notes.md` for quick top-tool guidance.
- Prefer tools already installed locally before suggesting new installs.

## Completion Checklist

- Confirm objective, scope, and target environment before running commands.
- Execute smallest safe test first, then expand to full workflow.
- Capture outputs (logs, reports, artifacts) and summarize follow-up actions.
