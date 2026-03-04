---
name: b10-site-docs-security-kafka
description: Use when generating documentation/sites, running security or vulnerability tests, and operating data exploration pipelines such as Kafka and ClickHouse.
---

# Static site/docs tooling, security testing, and Kafka-centric operations

This skill clusters adjacent tools from ranks **4831-4867** in the top-5000 inventory.

## Tool families in this pack

- Docs and site generation (`eleventy`, `protoc-gen-doc`, `swag`).
- Security and vulnerability tooling (`pocsuite3`, `git-delete-merged-branches`, `varlock`).
- Data and messaging operations (`chdig`, `yozefu`, `soapyrtlsdr`).

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
