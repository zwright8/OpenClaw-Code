---
name: b10-network-proxy-cache-sandbox
description: Use when building network-aware services, DNS/proxy front doors, cache and schema-backed data systems, and constrained command execution.
---

# Network/proxy services, cache/storage engines, and command sandboxing

This skill clusters adjacent tools from ranks **4935-4966** in the top-5000 inventory.

## Tool families in this pack

- Network/proxy and benchmarking (`observerward`, `aws-es-proxy`, `autocannon`, `smartdns`).
- Data/cache/schema systems (`libserdes`, `cadence-workflow`, `garnet`, `libsql`).
- Ops safety and boundaries (`cidr`, `fence`, `ser2net`).

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
