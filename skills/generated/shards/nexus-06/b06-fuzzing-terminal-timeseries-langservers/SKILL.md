---
name: b06-fuzzing-terminal-timeseries-langservers
description: Use when fuzz-testing, terminal augmentation, observability stacks, and language-server/platform integrations are in scope.
---

# Fuzzing, terminal augmentation, time-series, and language servers

This skill clusters adjacent tools from ranks **2940-2971** in the top-5000 inventory.

## What this skill provides

- Domain catalog: `references/tools.md` and `references/tools.csv`
- Repeatable playbook: `references/workflows.md`
- Local availability check: `scripts/check-tools.sh`

## Standard operating flow

1. Open `references/tools.md` and pick the smallest matching tool for the request.
2. Run `bash {baseDir}/scripts/check-tools.sh` to verify what is installed.
3. Read `references/workflows.md` for command scaffolds and safety order.
4. Run help/version first, then execute with explicit input/output paths.
5. Report command lines, output artifacts, and follow-up risks.

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
