---
name: b07-net-media-build-cli
description: Use when operating DNS/network telemetry, PDF and binary delta tooling, SDR/media server chains, compiler profiling, and AWS/template-driven engineering workflows.
---

# Network services, media processing, and build CLI workflows

This skill clusters adjacent tools from ranks **3123-3155** in the top-5000 inventory.

## What this skill provides

- Domain catalog: `references/tools.md` and `references/tools.csv`
- Repeatable playbook: `references/workflows.md`
- Local availability check: `scripts/check-tools.sh`

## Standard operating flow

1. Open `references/tools.md` and select the smallest matching tool for the request.
2. Run `bash {baseDir}/scripts/check-tools.sh` to verify installed binaries.
3. Read `references/workflows.md` for command scaffolds and safety order.
4. Run help/version first, then execute with explicit input and output paths.
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
