# SkillOS One-Command Orchestrator

`scripts/skillos-run.ts` executes the end-to-end SkillOS chain for a single query:

1. `route-skills`
2. `compile-workflow`
3. `apply-execution-policy`
4. `execute` (dry-run plan + optional subagent dispatch stub)
5. `score-skill-runs`
6. `recommend-promotions`

## CLI

```bash
npm run skills:run -- --query "draft comms strategy for security incident"
```

### Required flags

- `--query` (required): task/query text

### Optional flags

- `--k` (default: `8`)
- `--dry-run` (default: `true`)
- `--outDir` (default: `reports/skillos-run`)

Example with all flags:

```bash
npm run skills:run -- \
  --query "triage contradictory incident reports" \
  --k 10 \
  --dry-run true \
  --outDir reports/skillos-run
```

## Outputs

Each run writes timestamped JSON artifacts plus an index file into `--outDir`:

- `YYYY-...-01-route-skills.json`
- `YYYY-...-02-compile-workflow.json`
- `YYYY-...-03-apply-execution-policy.json`
- `YYYY-...-04-execute.json`
- `YYYY-...-05-score-skill-runs.json`
- `YYYY-...-06-recommend-promotions.json`
- `YYYY-...-index.json` (summary index)

`apply-execution-policy` is enforced fail-closed. If required risk metadata is missing or unknown, orchestrator exits non-zero.

## Validation / test invocation

Run typecheck to validate the orchestrator script compiles in the repo:

```bash
npm run typecheck
```
