---
name: b10-stream-build-deploy
description: Use when implementing stream processing, AWS/VPC access flows, build automation, and backup/test environment provisioning.
---

# Streaming compute, build automation, and deployment workflows

This skill clusters adjacent tools from ranks **4658-4690** in the top-5000 inventory.

## Tool families in this pack

- Streaming and event computation (`bento`, `storm`).
- Build/test automation (`eslint_d`, `gotests`, `proguard`).
- Ops and backup workflows (`basti`, `nextflow`, `dar`, `ephemeralpg`).

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
