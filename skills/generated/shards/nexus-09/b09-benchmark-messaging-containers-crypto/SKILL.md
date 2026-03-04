---
name: b09-benchmark-messaging-containers-crypto
description: Use when running performance tests, orchestrating messaging/container workflows, and handling cryptographic or legacy-security tooling safely.
---

# Benchmarking, messaging, containers, and crypto ops

This skill clusters adjacent tools from ranks **4064-4095** in the top-5000 inventory.

## What this skill provides

- Domain catalog: `references/tools.md` and `references/tools.csv`
- Repeatable playbook: `references/workflows.md`
- Local availability check: `scripts/check-tools.sh`

## Standard operating flow

1. Open `references/tools.md` and pick the smallest matching tool for the request.
2. Run `bash {baseDir}/scripts/check-tools.sh` to verify installed binaries.
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
