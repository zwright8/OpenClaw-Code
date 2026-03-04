---
name: b10-k8s-proxy-crypto-dotfiles
description: Use when combining Kubernetes MCP operations, proxy/tunnel connectivity, cryptographic file handling, and reproducible workstation configuration.
---

# Kubernetes MCP, proxy tunneling, cryptography, and dotfile automation

This skill clusters adjacent tools from ranks **4898-4933** in the top-5000 inventory.

## Tool families in this pack

- Terminal and scripting workflows (`ox`, `run`, `lsix`, `urlscan`).
- Cloud and Kubernetes automation (`cloudformation-guard`, `kubernetes-mcp-server`, `kyma-cli`).
- Crypto and configuration management (`sequoia-sq`, `ccrypt`, `dotdrop`).

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
