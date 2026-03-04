---
name: b10-api-stream-db-container
description: Use when running API exercises, container/cloud account operations, streaming services, and operational data-store tasks.
---

# API testing, streaming data, container ops, and database workflows

This skill clusters adjacent tools from ranks **4533-4563** in the top-5000 inventory.

## Tool families in this pack

- API and traffic workflows (`bombardier`, `httpyac`, `flarectl`).
- Container/platform operations (`dockly`, `mcp-server-kubernetes`).
- Realtime and storage systems (`nats-streaming-server`, `rethinkdb`, `influxdb@2`, `sqliteodbc`).

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
