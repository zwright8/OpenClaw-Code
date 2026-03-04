---
name: database-change-ops-toolkit
description: Plan and execute database schema/data changes with safety gates. Use when generating migrations, linting SQL, moving data between engines, or operating SQL/NoSQL/search stores with rollback-aware workflows.
---

# Database Change Ops Toolkit

Use this skill for migration-first database operations with validation, drift checks, and rollback planning.

## Workflow Router

- Need schema evolution -> Liquibase/Atlas/Goose path.
- Need SQL quality checks -> sqlfluff/sqlc path.
- Need data move/sync across engines -> pgloader/dolt path.

## Playbook 1: Author and apply zero-downtime migrations

1. Create forward and rollback migrations.
1. Validate SQL style and generated bindings.
1. Apply in controlled stages with verification queries.

Command starters:
```bash
sqlfluff lint migrations/
sqlc generate
goose -dir migrations postgres "$DB_URL" up
```

## Playbook 2: Track drift and declarative schema state

1. Compare desired schema to live database.
1. Review drift report with team.
1. Apply only approved deltas.

Command starters:
```bash
atlas schema inspect -u "$DB_URL"
atlas migrate diff <name> --to "file://schema.hcl"
liquibase updateSQL
```

## Playbook 3: Move datasets between systems

1. Extract and load data to target engine.
1. Validate row counts and key constraints.
1. Capture post-load checksums for audit.

Command starters:
```bash
pgloader source.conf target.conf
dolt sql -q "SELECT COUNT(*) FROM <table>;"
mysql -e "CHECK TABLE <table>;"
```

## Tool Inventory Reference

- Read `references/tool-map.csv` for the full rank-mapped tool list for this workflow cluster.
- Read `references/tool-notes.md` for quick top-tool guidance.
- Prefer tools already installed locally before suggesting new installs.

## Completion Checklist

- Confirm objective, scope, and target environment before running commands.
- Execute smallest safe test first, then expand to full workflow.
- Capture outputs (logs, reports, artifacts) and summarize follow-up actions.
