# OpenClaw-Code Improvement Blueprint (Canonical)

Last updated: 2026-03-06 22:28 America/New_York
Cycle: occ-20260306-2136
Owner: main orchestrator

---

## 1) Research Inputs (this cycle)

### 1.1 Required research execution
Executed `web_search` on:
- cognition-core architecture patterns
- swarm/multi-agent reliability patterns
- skills/runtime reliability patterns
- evaluation loop/benchmark patterns

Result: web_search calls failed this cycle due provider quota/suspension errors, so fallback sources were used.

### 1.2 Fallback practical OSS sources used
- LangGraph (durable agent graphs + checkpointing)
- Temporal retry policy docs (bounded retry/backoff/jitter/non-retryable classes)
- AutoGen (role-specialized multi-agent coordination)
- OpenAI Evals + Promptfoo (evaluation-as-gate in CI)
- SWE-bench ecosystem docs (external coding-agent benchmark discipline)

### 1.3 Applied insights
1. Deterministic, replay-safe artifacts > ad-hoc generation.
2. Retry behavior must be explicit and bounded; avoid hidden retry drift.
3. Reliability work should map directly to remediation and tests.
4. Offline regression gates + online scorecards are both required.
5. Multi-metric quality (success, timeout, calibration, latency, contract validity) beats single KPI optimization.

---

## 2) Baseline Metrics (captured at cycle start)

Sources:
- `cognition-core/reports/productivity-scorecard.latest.json`
- `cognition-core/reports/cognition-daily.json`
- `cognition-core/reports/failed-outcome-audit.latest.json`
- `swarm-protocol/state/simulation-benchmark.json`

### 2.1 Cycle-start baseline
- Productivity index: **95.32**
- Cycle time: **2.41s**
- Swarm simulation success rate: **78.13%**
- Swarm benchmark: `successRateAvg=0.7813`, `successRateMin=0.5000`, `timeoutRateAvg=0.1250`, `p95LatencyMs=225`
- Scorecard timestamp anomaly: future `generatedAt` (invalid freshness)
- Global audit gaps: `no-terminal-outcomes`, `required-approvers-missing`, `rollback-plan-missing`

### 2.2 Cycle-start repo validation snapshot
- `npm run typecheck` ✅
- `npm --prefix cognition-core test` ❌ (3 failures)
- `npm --prefix swarm-protocol test` ❌ (9 failures)
- `node scripts/validate-artifact-contracts.mjs` ❌ (freshness/timestamp drift)

---

## 3) Prioritized Bottlenecks

### P0
1. Artifact freshness/time integrity drift (invalid scorecard timestamps)
2. Swarm reliability floor regression (`successRateMin=0.50`, timeout pressure)

### P1
3. Retry/circuit/router behavior drift vs test expectations
4. High-risk policy metadata completeness (approver/rollback evidence)

### P2
5. Eval-loop contract rigor and clearer gate feedback

---

## 4) Target Architecture Changes

### 4.1 cognition-core
- Enforce sane timestamp generation and freshness checks in scorecard path.
- Stabilize report/diagnostic contract fields for deterministic evaluation output.
- Fail-closed policy metadata checks for high-risk recommendations.

### 4.2 swarm-protocol
- Harden retry hint parsing and bounded retry behavior.
- Improve circuit/maintenance retry flow and reliability-aware routing floor.

### 4.3 evaluation loop / runtime reliability
- Keep artifact contract validation as a strict gate.
- Preserve deterministic benchmark artifacts with explicit threshold checks.

---

## 5) Implementation Phases

### Phase 0 — Baseline lock
Capture metrics, failing tests, and artifact states.

### Phase 1 — Scorecard + policy hardening
Fix freshness/timestamp integrity and policy metadata fail-closed contracts.

### Phase 2 — Swarm reliability floor
Patch retry/circuit/router logic to reduce fail-open behavior and routing instability.

### Phase 3 — Gate verification
Re-run repo validations, benchmark, scorecard, and compare deltas.

---

## 6) Work-Lane Plan (5 independent lanes)

### Lane 01 — `occ-20260306-2136-lane-01-time-integrity`
Scope:
- `cognition-core/scripts/productivity-scorecard.ts`
- `cognition-core/src/report/scoreboard.ts`
- `cognition-core/test/report/report-generation.test.ts`

Validation:
- `npm --prefix cognition-core test -- cognition-core/test/report/report-generation.test.ts`
- `npm --prefix cognition-core run scorecard`
- `node scripts/validate-artifact-contracts.mjs`

### Lane 02 — `occ-20260306-2136-lane-02-cognition-calibration`
Scope:
- `cognition-core/src/learning/evaluator.ts`
- `cognition-core/src/learning/outcome-mapper.ts`
- `cognition-core/test/learning/evaluator.test.ts`

Validation:
- `npm --prefix cognition-core test -- cognition-core/test/learning/evaluator.test.ts`
- `npm --prefix cognition-core run evaluate`

### Lane 03 — `occ-20260306-2136-lane-03-policy-metadata`
Scope:
- `cognition-core/src/contracts/recommendations.ts`
- `cognition-core/src/policy/fail-closed.ts`
- `cognition-core/test/contracts/recommendations.test.ts`

Validation:
- `npm --prefix cognition-core test -- cognition-core/test/contracts/recommendations.test.ts`
- `npm --prefix cognition-core test -- cognition-core/test/policy-engine.test.ts`

### Lane 04 — `occ-20260306-2136-lane-04-swarm-reliability-floor`
Scope:
- `swarm-protocol/src/task-orchestrator.ts`
- `swarm-protocol/src/task-router.ts`
- `swarm-protocol/test/task-orchestrator.test.ts`
- `swarm-protocol/test/task-router.test.ts`
- `swarm-protocol/test/simulation-harness.test.ts`

Validation:
- `npm --prefix swarm-protocol test -- swarm-protocol/test/task-orchestrator.test.ts`
- `npm --prefix swarm-protocol test -- swarm-protocol/test/task-router.test.ts`
- `npm --prefix swarm-protocol test -- swarm-protocol/test/simulation-harness.test.ts`
- `npm --prefix swarm-protocol run benchmark:simulate`

### Lane 05 — `occ-20260306-2136-lane-05-contract-gates`
Scope:
- `scripts/validate-artifact-contracts.mjs`
- `package.json`
- `docs/openclaw-code-improvement-blueprint.md`

Validation:
- `node scripts/validate-artifact-contracts.mjs`
- `npm run typecheck`

---

## 7) Acceptance Tests (explicit promotion gate)

Run in order:
1. `npm run typecheck`
2. `npm --prefix cognition-core test`
3. `npm --prefix swarm-protocol test`
4. `node scripts/validate-artifact-contracts.mjs`
5. `npm --prefix swarm-protocol run benchmark:simulate`
6. `npm --prefix cognition-core run scorecard`

Promotion rule: all pass, or document exact failing residue + owning lane.

---

## 8) Rollback Strategy

- Roll back by lane commit (lane-pure rollback only).
- Re-run acceptance gate immediately after rollback.
- Prioritize rollback order if safety is impacted:
  1) swarm runtime lane,
  2) artifact gate/time integrity lane,
  3) remaining lanes.

---

## 9) Expected Productivity Impact

Near-term target from this cycle:
- freshness contract failures: **1 → 0**
- cognition-core failing tests: **3 → 0**
- swarm-protocol failing tests: **9 → <=2**
- maintain or improve productivity index from **95.32**
- recover swarm reliability floor over next cycles (`successRateMin >= 0.70` target)

---

## 10) Supervision Rules (mandatory)

- Rebase before merge.
- Lane-pure commits only.
- No overlap edits across lanes.
- If overlapping scope is discovered, pause and rescope instead of force-merging conflicts.

---

## 11) Step-by-Step Operator Manual

1. Capture baseline artifacts and failing tests.
2. Spawn one agent per lane with hard file scope + explicit validations.
3. Require lane rebase + lane-pure commit.
4. Merge passing lane commits incrementally.
5. Run acceptance tests after each merge wave.
6. Record metric deltas (scorecard + benchmark).
7. Carry unresolved residue into next cycle as top priority.

---

## 12) This-Cycle Outcome Snapshot

Merged lane commits:
- `8b447a23dc` feat(cognition-core): harden scorecard time integrity and report diagnostics contract
- `8dc56f38d3` feat(cognition-core): harden high-risk metadata fail-closed policy checks
- `f4c2b90e30` feat(ci): harden artifact contract gates and operator validation entrypoints
- `09ab58ad45` feat(swarm): restore deterministic retry/circuit behavior and routing reliability floor

Lane held back:
- lane 02 commit not merged due integration/rebase conflict against newer main-line learning changes.

Post-merge validation snapshot:
- `npm run typecheck` ✅
- `npm --prefix cognition-core test` ✅
- `npm --prefix swarm-protocol test` ❌ (**1** failing test remains)
- `node scripts/validate-artifact-contracts.mjs` ✅
- `benchmark:simulate` ✅ (threshold check remains pass)
- `scorecard` ✅ (`generatedAt` now sane and freshness-safe)

Residual failing test:
- `swarm-protocol/test/simulation-harness.test.ts` — `benchmark script emits metadata contract fields without threshold input`
