---
name: b10-media-k8s-encryption-web
description: Use when handling media conversions, Kubernetes policy/deployment automation, encryption key workflows, and static web delivery.
---

# Media conversion, Kubernetes policy automation, encryption, and web serving

This skill clusters adjacent tools from ranks **4760-4796** in the top-5000 inventory.

## Tool families in this pack

- Media and format workflows (`mkvdts2ac3`, `pdf-diff`, `ocp`).
- Kubernetes and policy workflows (`kwctl`, `kubekey`, `iam-policy-json-to-terraform`).
- Encryption and delivery (`age-plugin-yubikey`, `rage`, `static-web-server`).

## What this skill provides

- Domain catalog: `references/tools.md` and `references/tools.csv`
- Repeatable playbook: `references/workflows.md`
- Local availability check: `scripts/check-tools.sh`

## Standard operating flow

1. Open `references/tools.md` and select the smallest matching tool for the request.
2. Run `bash {baseDir}/scripts/check-tools.sh` to verify local availability.
3. Read `references/workflows.md` for command scaffolds and safety order.
4. Run help/version first, then execute with explicit input/output paths.
5. Report exact commands, artifacts produced, and follow-up risks.

## Fast start

```bash
bash {baseDir}/scripts/check-tools.sh
```

Then run:

```bash
<tool> --help || <tool> -h
<tool> --version || true
```

## Notes

- Some entries are libraries/SDKs rather than interactive CLIs.
- For library entries, treat the catalog as dependency-selection guidance.
