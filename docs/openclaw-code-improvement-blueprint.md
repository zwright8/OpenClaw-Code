# OpenClaw-Code Improvement Blueprint (Canonical)

Last updated: 2026-03-03 20:24 America/New_York (cron cycle: openclaw-code-architecture-6h)
Owner: main orchestrator
Scope: `cognition-core`, `swarm-protocol`, skills/runtime reliability, evaluation loops

---

## 1) Research Inputs (This Cycle)

### 1.1 Required web research execution
Executed 4 `web_search` queries for:
1. 2025–2026 multi-agent architecture best practices and eval-loop patterns
2. OSS reliability patterns for agent runtimes (idempotency/retry/checkpointing)
3. Swarm routing hardening and degraded-mode coordination
4. Contract-driven policy gates + rollback-safe deployment patterns

Result: all 4 calls failed with provider quota suspension (`Kimi API 429 exceeded_current_quota_error`).

### 1.2 Insights used this cycle (grounded in local artifacts + prior validated patterns)
- Keep deterministic replayability as first-class: every reliability improvement must preserve deterministic artifacts.
- Keep high-risk recommendation contracts fail-closed by default when approval/rollback metadata is incomplete.
- Focus swarm improvements on floor metrics (min success, max timeout, p95 latency), not just averages.
- Treat evaluation as dual-loop: offline benchmark gate + daily cognition scorecard with explicit remediation triggers.

---

## 2) Current Baseline Metrics (fresh snapshot)

Artifact anchors:
- `cognition-core/reports/productivity-scorecard.latest.json` (`generatedAt`: `2026-03-04T00:48:15.674Z`)
- `cognition-core/reports/cognition-daily.json` (`generatedAt`: `2026-03-04T00:48:14.992Z`)
- `cognition-core/reports/failed-outcome-audit.latest.json` (`generatedAt`: `2026-03-04T00:48:12.055Z`)
- `swarm-protocol/state/simulation-benchmark.json`

### 2.1 Productivity baseline
- Overall: **strong**
- Productivity index: **98.11 / 100**
- Cycle time: **2.649s**
- Automation coverage: **100%**
- Dispatch count: **4**
- Blocked approvals: **0**
- Cognition success rate: **100%**
- Swarm simulation success rate: **92.19%**
- Skill utility composite: **100%**
- Step reduction estimate: **66.7%**

### 2.2 Cognition quality baseline
- Overall: **pass**
- Total outcomes: **4**
- Terminal outcomes: **1**
- Non-terminal outcomes: **3**
- Mapping rate: **1.0**
- Brier score: **N/A** (insufficient sample)
- Calibration gap: **N/A** (insufficient sample)
- Calibration diagnostics: readiness `insufficient_sample_size` (min sample size = 3)

### 2.3 Quality gaps (failed outcome audit)
Global gaps:
- `no-terminal-outcomes`
- `required-approvers-missing`
- `rollback-plan-missing`

Blocked approval queue:
- **0 items**

### 2.4 Swarm benchmark baseline
- Scenario: **baseline-routing-reliability**
- Runs: **8**
- Avg success rate: **0.9219**
- Min success rate: **0.75**
- Avg timeout rate: **0.0156**
- Max timeout rate: **0.125**
- Avg latency: **124.7ms**
- P95 latency: **405ms**
- Threshold check: **ok=true**, breaches=`[]`

### 2.5 Delta vs prior cycle baseline (2026-03-03 14:24)
- Productivity index: `98.12 -> 98.11` (**-0.01**)
- Cycle time: `2.576s -> 2.649s` (**+0.073s**)
- Swarm min success: `0.75 -> 0.75` (flat)
- Swarm p95 latency: `405ms -> 405ms` (flat)
- Calibration readiness: still `insufficient_sample_size`

---

## 3) Prioritized Bottlenecks

### P0
1. High-risk recommendation completeness gaps persist (`required-approvers-missing`, `rollback-plan-missing`).
2. Terminal evidence remains sparse (1 terminal outcome), blocking reliable calibration metrics.
3. Swarm reliability floor remains fragile (`successRateMin=0.75`, timeout spikes at `0.125`).

### P1
4. Tail latency ceiling (`p95=405ms`) is above target operating envelope.
5. Retry/backoff telemetry consistency still needs canonical schema guarantees.
6. Lane drift risk exists without strict rebase-first + lane-pure commit enforcement.

### P2
7. Productivity plateau: further gains now depend on reliability/quality improvements, not volume.

---

## 4) Target Architecture Changes

### 4.1 Cognition-core
- Extend deterministic sparse-sample calibration diagnostics and confidence envelope surfacing.
- Increase terminal-outcome observability so calibration exits N/A state sooner.

### 4.2 Swarm-protocol
- Harden degraded routing floor and timeout behavior in adverse seeds.
- Canonicalize retry/backoff + terminal classification telemetry.

### 4.3 Skills/runtime reliability
- Enforce fail-closed high-risk recommendation completeness (`requiredApprovers`, `rollbackPlan`).
- Emit deterministic machine-parseable quality-gap diagnostics.

### 4.4 Evaluation loops
- Stabilize scorecard/remediation determinism across reruns.
- Emit explicit threshold breach reason payloads for operator gating.

---

## 5) Implementation Phases

### Phase 0 — lane hygiene
1. Rebase each lane branch from latest `main` before coding.
2. Enforce lane-pure commits; no cross-lane edits.
3. Require validation logs + changed-file manifest in lane handoff.

### Phase 1 — calibration + terminal evidence
1. Improve sparse calibration diagnostics and confidence envelope behavior.
2. Tighten terminal-outcome instrumentation paths.

### Phase 2 — swarm reliability floor
1. Harden degraded routing decisions and timeout handling.
2. Improve benchmark floor under adversarial seeds.

### Phase 3 — policy fail-closed hardening
1. Block high-risk recommendations missing approver/rollback metadata.
2. Preserve backward-compatible diagnostic contract output.

### Phase 4 — deterministic evaluation loop
1. Stabilize scorecard/remediation identifiers and ordering.
2. Emit explicit threshold breach causes for remediation planning.

---

## 6) Explicit Acceptance Tests

### 6.1 Repo-level gates
```bash
npm run typecheck
npm run build
```

### 6.2 Cognition-core gates
```bash
npm --prefix cognition-core test
npm --prefix cognition-core run evaluate
npm --prefix cognition-core run dispatch
npm --prefix cognition-core run scorecard
```

### 6.3 Swarm-protocol gates
```bash
npm --prefix swarm-protocol test
npm --prefix swarm-protocol run benchmark:simulate
```

### 6.4 Artifact integrity checks
```bash
node -e "JSON.parse(require('fs').readFileSync('cognition-core/reports/productivity-scorecard.latest.json','utf8')); console.log('ok')"
node -e "JSON.parse(require('fs').readFileSync('cognition-core/reports/cognition-daily.json','utf8')); console.log('ok')"
node -e "JSON.parse(require('fs').readFileSync('cognition-core/reports/failed-outcome-audit.latest.json','utf8')); console.log('ok')"
node -e "JSON.parse(require('fs').readFileSync('swarm-protocol/state/simulation-benchmark.json','utf8')); console.log('ok')"
```

Pass criteria:
- All tests pass.
- No schema parse failures.
- No regression vs baseline floor: `successRateMin >= 0.75`, `p95LatencyMs <= 405`.

---

## 7) Rollback Strategy

1. **Single lane rollback:** `git revert <lane_commit_sha>`
2. **Batch rollback:** revert merged range if cross-lane regression appears.
3. **Schema rollback:** restore previous artifact schema from git if downstream parser breaks.
4. **Safety halt:** freeze merges when scorecard/benchmark floor thresholds are breached.

---

## 8) Expected Productivity Impact (next 1–2 cycles)

Primary targets:
- Productivity index: **98.11 -> >= 99.0**
- Cycle time: **2.649s -> <= 2.20s**
- Calibration readiness: **insufficient_sample_size -> ready**
- Terminal outcomes/cycle: **1 -> >= 2**
- Swarm min success floor: **0.75 -> >= 0.85**
- Swarm p95 latency: **405ms -> <= 320ms**

Secondary targets:
- Remove global gaps: `required-approvers-missing`, `rollback-plan-missing`
- Step reduction estimate: **66.7% -> >= 70%**

---

## 9) Five Independent Work Lanes (authoritative split)

Global lane rules:
- Rebase before implementation and before final handoff.
- Lane-pure commits only.
- No cross-lane file overlap.
- Handoff must include: changed files, validation output, commit SHA.

### Lane 1 — cognition calibration diagnostics + sample-readiness
- Label: `occ-20260303-2024-lane-01-calibration`
- Workspace: `/Users/zacharywright/.openclaw/workspace/OpenClaw-Code-lane01`
- Scope files:
  - `cognition-core/src/learning/evaluator.ts`
  - `cognition-core/src/report/scoreboard.ts`
  - `cognition-core/test/learning/evaluator.test.ts`
  - `cognition-core/test/report/report-generation.test.ts`
- Required validation:
  - `npm --prefix cognition-core test -- test/learning/evaluator.test.ts`
  - `npm --prefix cognition-core test -- test/report/report-generation.test.ts`
  - `npm --prefix cognition-core run evaluate`
- Commit criteria:
  - deterministic sparse-sample diagnostics + confidence envelope preserved
  - no report schema breaks

### Lane 2 — swarm degraded routing floor hardening
- Label: `occ-20260303-2024-lane-02-routing-floor`
- Workspace: `/Users/zacharywright/.openclaw/workspace/OpenClaw-Code-lane02`
- Scope files:
  - `swarm-protocol/src/task-router.ts`
  - `swarm-protocol/src/simulation-harness.ts`
  - `swarm-protocol/test/task-router.test.ts`
  - `swarm-protocol/test/simulation-harness.test.ts`
- Required validation:
  - `npm --prefix swarm-protocol test -- test/task-router.test.ts`
  - `npm --prefix swarm-protocol test -- test/simulation-harness.test.ts`
  - `npm --prefix swarm-protocol run benchmark:simulate`
- Commit criteria:
  - deterministic degraded fallback routing behavior
  - timeout/reliability floor improvement under adversarial seeds

### Lane 3 — retry/backoff telemetry normalization
- Label: `occ-20260303-2024-lane-03-telemetry`
- Workspace: `/Users/zacharywright/.openclaw/workspace/OpenClaw-Code-lane03`
- Scope files:
  - `swarm-protocol/src/task-orchestrator.ts`
  - `swarm-protocol/src/audit-log.ts`
  - `swarm-protocol/test/task-orchestrator.test.ts`
  - `swarm-protocol/test/audit-log.test.ts`
- Required validation:
  - `npm --prefix swarm-protocol test -- test/task-orchestrator.test.ts`
  - `npm --prefix swarm-protocol test -- test/audit-log.test.ts`
  - `npm --prefix swarm-protocol run benchmark:simulate`
- Commit criteria:
  - canonical retry transition schema + terminal reason codes
  - parseable telemetry artifacts across reruns

### Lane 4 — fail-closed high-risk contract completeness
- Label: `occ-20260303-2024-lane-04-contracts`
- Workspace: `/Users/zacharywright/.openclaw/workspace/OpenClaw-Code-lane04`
- Scope files:
  - `cognition-core/src/contracts/recommendations.ts`
  - `cognition-core/src/policy/fail-closed.ts`
  - `cognition-core/src/reasoning/remediation.ts`
  - `cognition-core/test/contracts/recommendations.test.ts`
  - `cognition-core/test/policy-engine.test.ts`
- Required validation:
  - `npm --prefix cognition-core test -- test/contracts/recommendations.test.ts`
  - `npm --prefix cognition-core test -- test/policy-engine.test.ts`
  - `npm --prefix cognition-core run dispatch`
- Commit criteria:
  - missing approver/rollback metadata fail-closes high-risk recommendations
  - diagnostics stay deterministic + machine-parseable

### Lane 5 — scorecard/remediation determinism + breach reasoning
- Label: `occ-20260303-2024-lane-05-eval-loop`
- Workspace: `/Users/zacharywright/.openclaw/workspace/OpenClaw-Code-lane05`
- Scope files:
  - `cognition-core/scripts/productivity-scorecard.ts`
  - `cognition-core/scripts/plan-remediation-tasks.ts`
  - `cognition-core/test/remediation-task-planner.test.ts`
- Required validation:
  - `npm --prefix cognition-core test -- test/remediation-task-planner.test.ts`
  - `npm --prefix cognition-core run scorecard`
  - `node -e "JSON.parse(require('fs').readFileSync('cognition-core/reports/productivity-scorecard.latest.json','utf8')); console.log('ok')"`
- Commit criteria:
  - deterministic remediation IDs/order and reproducible scorecard output
  - explicit threshold-breach reason emission

---

## 10) Merge Protocol (mandatory)

1. Rebase lane branch on latest `main` before opening merge request.
2. Confirm lane-pure diff against Section 9 scope.
3. Run lane-local validations and include output in handoff.
4. Merge lanes sequentially (one at a time).
5. After each merge, run smoke checks:
   - `npm run typecheck`
   - `npm --prefix cognition-core test -- test/learning/evaluator.test.ts`
   - `npm --prefix swarm-protocol test -- test/task-router.test.ts`
6. After all merges:
   - `npm --prefix cognition-core run scorecard`
   - `npm --prefix swarm-protocol run benchmark:simulate`
7. Record productivity + benchmark deltas against Section 2 baseline.

---

## 11) Step-by-Step Operator Manual

1. Confirm baseline artifacts in Section 2 exist and parse.
2. Launch/continue lanes using Section 9 labels/workspaces.
3. Enforce rebase-first + lane-pure commit policy.
4. Collect each lane handoff package (files changed, tests, SHA).
5. Merge sequentially with smoke checks after each merge.
6. Regenerate scorecard + swarm benchmark artifacts.
7. Compare new values against Section 2 baseline and log deltas.
8. Publish concise cycle report: insights used, landed commits, validation status, score delta, and next priorities.
