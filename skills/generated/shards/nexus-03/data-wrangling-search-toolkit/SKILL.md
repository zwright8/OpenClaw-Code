---
name: data-wrangling-search-toolkit
description: Inspect, transform, and validate structured datasets quickly from the terminal. Use when working with CSV/JSON/YAML/Parquet files, deduplicating records, generating summaries, or validating configuration schemas.
---

# Data Wrangling Search Toolkit

Use this skill to perform fast data triage, transformation, and quality checks without building a full ETL stack.

## Workflow Router

- Need tabular analysis -> qsv/miller/parquet tools path.
- Need config/query transforms -> jless/dasel/cue/hcl2json path.
- Need dedupe/hash integrity checks -> fdupes/czkawka/xxhash path.

## Playbook 1: Profile and summarize large datasets

1. Extract schema/column stats quickly.
1. Run filters/grouping without custom scripts.
1. Export concise QA snapshots for review.

Command starters:
```bash
qsv stats data.csv
mlr --csv count-distinct -f user_id data.csv
parquet-cli schema data.parquet
```

## Playbook 2: Transform config and interchange formats

1. Query nested fields across JSON/YAML/TOML/XML.
1. Convert configuration formats for downstream tooling.
1. Validate resulting structures against expected shape.

Command starters:
```bash
jless config.json
dasel -f config.yaml ".service.port"
hcl2json main.hcl > main.json
cue vet config.json schema.cue
```

## Playbook 3: Run integrity and dedupe passes

1. Detect duplicate files/records.
1. Generate checksums for transfer verification.
1. Publish cleanup summary before destructive actions.

Command starters:
```bash
fdupes -r ./dataset
czkawka dup -d ./dataset
xxhsum ./dataset/* > checksums.txt
```

## Tool Inventory Reference

- Read `references/tool-map.csv` for the full rank-mapped tool list for this workflow cluster.
- Read `references/tool-notes.md` for quick top-tool guidance.
- Prefer tools already installed locally before suggesting new installs.

## Completion Checklist

- Confirm objective, scope, and target environment before running commands.
- Execute smallest safe test first, then expand to full workflow.
- Capture outputs (logs, reports, artifacts) and summarize follow-up actions.
