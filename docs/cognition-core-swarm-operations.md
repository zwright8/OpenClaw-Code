# Cognition Core + Swarm Operations Runbook

This runbook defines the hourly operating loop for `cognition-core` and `swarm-protocol`.

## Hourly loop

Run from repo root:

```bash
npm --prefix cognition-core run run:dispatch
```

Equivalent:

```bash
npm --prefix cognition-core run run -- --dispatch true
```

Pipeline stages:

1. **ingest** (`scripts/ingest.ts`)
2. **analyze** (`scripts/analyze.ts`)
3. **plan** (`scripts/plan.ts`)
4. **dispatch** (`scripts/dispatch.ts`) — optional in `run.ts`, enabled via `--dispatch true`
5. **evaluate** (`scripts/evaluate.ts`)
6. **report** (`scripts/report.ts`)

Run manifest:

- `cognition-core/reports/cognition-run.json`

## Main artifacts

- Ingest stream (latest): `cognition-core/reports/normalized-event-stream.latest.json`
- Plan report: `reports/cognition-plan.report.json`
- Packaged tasks: `reports/cognition-task-package.json`
- Dispatch report: `cognition-core/reports/cognition-dispatch.report.json`
- Evaluation state: `skills/state/cognition-evaluation.json`
- Daily report: `cognition-core/reports/cognition-daily.json`
- Swarm journal: `swarm-protocol/state/tasks.journal.jsonl`
- Productivity scorecard JSON: `cognition-core/reports/productivity-scorecard.latest.json`
- Productivity scorecard Markdown: `cognition-core/reports/productivity-scorecard.latest.md`
- Remediation task plan artifact: `cognition-core/reports/remediation-tasks.latest.json`

## Approval gate handling

There are two gate points:

1. **Planner gate (pre-dispatch)**
   - blocked tasks are emitted under `reports/cognition-task-package.json -> blocked[]`
   - common reason: `awaiting_human_approval`

2. **Swarm queue (dispatch-time visibility)**
   - use swarm ops to inspect pending approvals:

```bash
npm --prefix swarm-protocol run ops -- status
npm --prefix swarm-protocol run ops -- queue --approvals
```

Review actions:

```bash
npm --prefix swarm-protocol run ops -- override approve <taskId> --secret "$SWARM_AUDIT_SECRET"
npm --prefix swarm-protocol run ops -- override deny <taskId> --secret "$SWARM_AUDIT_SECRET"
```

## Status command

```bash
npm --prefix cognition-core run status
```

Summarizes:

- latest run stages
- ingest volume
- plan/dispatch counts
- evaluation headline metrics
- blocked approvals (planner + queue)

Machine-readable mode:

```bash
npm --prefix cognition-core run status -- --json
```

## Scorecard closure + remediation automation

Run scorecard generation (this now also emits a remediation task plan artifact):

```bash
npm --prefix cognition-core run scorecard
```

Optional explicit regeneration of remediation tasks from the latest scorecard:

```bash
npm --prefix cognition-core run plan:tasks -- --report reports/productivity-scorecard.latest.json --out reports/remediation-tasks.latest.json
```

Interpretation guide:

- `deltas.benchmarkDeltas.<metric>.before` = fixed benchmark threshold (deterministic baseline).
- `deltas.benchmarkDeltas.<metric>.after` = current observed metric from the latest artifacts.
- `deltas.benchmarkDeltas.<metric>.delta` = comparator-aware delta (`gte`: `after - before`, `lte`: `before - after`).
  - Positive is better than benchmark, zero is at benchmark, negative is below benchmark.
- `thresholdBreaches[]` is the canonical breach list for remediation routing.
- `remediationTaskArtifacts[]` and `remediation-tasks.latest.json` map each breach to an explicit generated swarm task (`taskId`, `target`, `priority`).

## Troubleshooting

### 1) Missing outcomes

Symptoms:
- low/zero outcomes in evaluation and daily report

Checks:
- `swarm-protocol/state/tasks.journal.jsonl` exists
- dispatch stage was enabled in run manifest
- dispatch report has non-zero dispatch count

Remediation:
- run full loop with dispatch (`run:dispatch`)
- resolve approval backlog / worker backlog

### 2) Empty ingest

Symptoms:
- ingest raw/deduped counts are zero

Checks:
- `normalized-event-stream.latest.json`
- ingest source env vars (`COGNITION_INGEST_*`)
- lookback window (`--since-hours`)

Remediation:
- fix source paths/env
- increase lookback window for low-volume periods

### 3) Blocked approvals

Symptoms:
- package has blocked tasks
- queue shows pending approvals

Checks:
- `reports/cognition-task-package.json`
- `npm --prefix swarm-protocol run ops -- queue --approvals`

Remediation:
- get required approvers to review
- apply audited override when policy allows

## Suggested hourly cron

```cron
5 * * * * cd /Users/zacharywright/.openclaw/workspace/OpenClaw-Code && npm --prefix cognition-core run run:dispatch >> /tmp/cognition-hourly.log 2>&1
```
