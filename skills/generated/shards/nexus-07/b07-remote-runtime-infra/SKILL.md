---
name: b07-remote-runtime-infra
description: Use when managing remote sessions, app servers, schema modeling, Terraform/Atlantis flows, Bayesian simulation tools, geospatial/media conversion, and infra packaging.
---

# Remote systems, runtimes, and infrastructure automation

This skill clusters adjacent tools from ranks **3157-3189** in the top-5000 inventory.

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
