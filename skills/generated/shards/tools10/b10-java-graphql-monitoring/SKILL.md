---
name: b10-java-graphql-monitoring
description: Use when managing Java runtimes/decompilation, GraphQL developer workflows, task orchestration, and infrastructure monitoring stacks.
---

# Java ecosystem workflows, GraphQL automation, and infrastructure monitoring

This skill clusters adjacent tools from ranks **4868-4897** in the top-5000 inventory.

## Tool families in this pack

- Java runtime and bytecode workflows (`jabba`, `glassfish`, `fernflower`).
- GraphQL and automation tasks (`graphql-cli`, `pyinvoke`).
- Monitoring and platform controls (`nagios`, `apcupsd`, `parallel-disk-usage`).

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
