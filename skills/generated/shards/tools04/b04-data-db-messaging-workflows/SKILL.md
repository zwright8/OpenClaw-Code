---
name: b04-data-db-messaging-workflows
description: Use when querying data systems, transforming structured formats, or operating messaging/stream pipelines.
---

# Data, databases & messaging workflows

Use this skill to run practical workflows with the domain tools mapped from batch-04.

## Included resources

- `references/tools.md` for a readable catalog
- `references/tools.csv` for automation
- `references/workflows.md` for repeatable run patterns
- `scripts/check-tools.sh` for command availability checks

## Operating sequence

1. Pick target tools from `references/tools.md`.
2. Run `bash {baseDir}/scripts/check-tools.sh`.
3. Start with help/version commands from `references/workflows.md`.
4. Execute the smallest safe command before full operations.
5. Record command + output for reproducibility.

## Fast start

```bash
bash {baseDir}/scripts/check-tools.sh
```

## Notes

- `tool` is package identity; `command` is executable hint.
- Some entries are libraries/runtimes and should be integrated via build/package systems.
