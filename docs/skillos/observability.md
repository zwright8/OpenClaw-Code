# SkillOS v1 Observability Loop

This loop converts existing `runtime.*` execution artifacts into deterministic, per-skill performance summaries and promotion guidance.

## Artifacts

- Input runtime artifacts: `skills/generated/runtime.*.json`
  - Scorer auto-selects artifacts that include `taskResults`.
- Skill catalog: `skills/generated/runtime.catalog.json`
- Output performance state: `skills/state/skill-performance.json`
- Output recommendations: `skills/state/skill-promotion-recommendations.json`

## Runbook

```bash
# 1) Aggregate per-skill performance
npx tsx scripts/score-skill-runs.ts

# 2) Generate promote / hold / demote recommendations
npx tsx scripts/recommend-promotions.ts
```

## Scoring model

### `score-skill-runs.ts`
For each skill, aggregate task-level runtime outcomes across all runtime artifacts with `taskResults`:

- Runs
  - `total`, `terminal`, `success`, `failed`, `approvalPending`, `skipped`
- Success rate
  - `successRate = success / terminal`
  - Terminal statuses are `success` and `failed`
- Latency
  - `min`, `avg`, `p50`, `p95`, `max`
- Failure classes
  - `runtime_checks_failed`
  - `oversight_escalation_failed`
  - `promotion_validation_failed`
  - `approval_wait`
  - `throttled`
  - `unknown`

Task-to-skill mapping priority:
1. explicit `skillId`
2. parse trailing numeric token from `taskId` (e.g. `promotion-shadow-0852`)

## Promotion recommendation policy

### `recommend-promotions.ts`
Default thresholds:

- `minTerminalRuns`: 2
- Promote when all are true:
  - `successRate >= 0.90`
  - `p95 <= 30000ms`
  - `approvalPendingRatio <= 0.25`
  - `failureRatio <= 0.10`
- Demote when any are true:
  - `successRate <= 0.60`
  - `failureRatio >= 0.25`
  - `approvalPendingRatio >= 0.40`
- Otherwise: Hold

Where:
- `approvalPendingRatio = approvalPending / total`
- `failureRatio = failed / terminal`

## Threshold tuning guide

Tune conservatively and one axis at a time:

1. **Low sample confidence**
   - Increase `minTerminalRuns` (e.g. 2 -> 5)
2. **Latency regressions dominate incidents**
   - Lower `promoteMaxP95LatencyMs` (e.g. 30000 -> 22000)
3. **Too many approvals blocking velocity**
   - Relax `promoteMaxApprovalPendingRatio` slightly (e.g. 0.25 -> 0.30)
   - Keep `demoteMinApprovalPendingRatio` sufficiently above promote threshold
4. **False promotions causing rollback**
   - Raise `promoteMinSuccessRate` (e.g. 0.90 -> 0.93)
   - Lower `promoteMaxFailureRatio` (e.g. 0.10 -> 0.07)
5. **Overly harsh demotions**
   - Lower `demoteMinFailureRatio` sensitivity carefully (e.g. 0.25 -> 0.30)

Recommended process:
- Tune one threshold set
- Re-run scorer + recommender
- Compare summary deltas (`promote/hold/demote` counts)
- Validate against recent incident/postmortem context

## Determinism guarantees

Outputs are deterministic for fixed inputs:
- No wall-clock timestamps are generated in outputs
- Input artifact list is lexicographically sorted
- Skill records and recommendation lists are sorted by `skillId`
- Failure class keys are sorted alphabetically
