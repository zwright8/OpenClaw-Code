---
name: b10-download-db-messaging-sec
description: Use when orchestrating download/content pipelines, database tuning and access, messaging clients, and vulnerability/license scanning.
---

# Download pipelines, database operations, messaging, and security scans

This skill clusters adjacent tools from ranks **4691-4724** in the top-5000 inventory.

## Tool families in this pack

- Download and content tooling (`gopeed`, `xurls`, `ecm`).
- Database and service operations (`mysqltuner`, `dblab`, `fuseki`).
- Security/compliance scans (`feluda`, `retire`, `cargo-auditable`).

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
