# OpenClaw-Code Improvement Blueprint (Canonical)

Last updated: 2026-02-28 02:00 America/New_York (cron cycle: openclaw-code-architecture-6h)
Owner: main orchestrator
Scope: `cognition-core` + `swarm-protocol` + skills/runtime reliability + evaluation loops

---

## 1) Research Inputs Used This Cycle

### 1.1 web_search status (required step)
- Attempted `web_search` for latest agent architecture patterns and OSS practices.
- Result: tool unavailable due provider quota suspension (HTTP 429 exceeded quota), so no search payload was returned.

### 1.2 Fallback research sources (factual OSS docs fetched directly)
- AutoGen Team patterns + termination controls:
  - https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/tutorial/teams.html
  - https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/tutorial/termination.html
- CrewAI task model and execution flow:
  - https://docs.crewai.com/concepts/tasks
- LangGraph architecture principles (durable execution, HITL, memory, observability):
  - https://raw.githubusercontent.com/langchain-ai/langgraph/main/README.md
- OpenHands architecture/product direction signal (multi-interface agent runtime + benchmark discipline):
  - https://raw.githubusercontent.com/OpenHands/OpenHands/main/README.md

### 1.3 Extracted practical patterns applied in this blueprint
1. **Explicit termination and stop conditions** for multi-agent runs (AutoGen).
2. **Durable execution + resumability** as a first-class reliability primitive (LangGraph).
3. **Structured task contracts with context/dependencies/human review hooks** (CrewAI).
4. **Production benchmark loop and measurable regressions** (OpenHands + existing OpenClaw benchmark artifacts).

---

## 2) Current Baseline Metrics (from repo artifacts)

Reference artifacts:
- `cognition-core/reports/productivity-scorecard.latest.json`
- `cognition-core/reports/cognition-daily.json`
- `swarm-protocol/state/simulation-benchmark.json`

### 2.1 Productivity scorecard baseline
- Overall: **strong**
- Productivity index: **78.19 / 100**
- Cycle time: **1.998s**
- Automation coverage: **100%**
- Dispatch count: **3**
- Blocked approvals: **1**
- Cognition outcome success rate: **0.00%**
- Swarm simulation success rate: **92.19%**
- Skill utility composite: **100%**
- Brier score: **0.25** (target <= 0.20)
- Calibration gap: **0.50** (target <= 0.20)

### 2.2 Swarm benchmark baseline
- Scenario: `baseline-routing-reliability`
- Runs: **8**
- Avg success rate: **0.9219**
- Min success rate: **0.75**
- Avg timeout rate: **0.0156**
- Max timeout rate: **0.125**
- Avg latency: **124.7ms**
- P95 latency: **405ms**
- Threshold evaluation: **PASS**

---

## 3) Prioritized Bottlenecks

Priority is based on impact to operator throughput and execution safety.

1. **Cognition quality loop is underfit (P0)**
   - Outcome success at 0% with poor calibration (Brier/calibration gap breaches).
   - Current threshold tuner is effectively sample-gated and slow to recover quality.

2. **Approval gating friction (P0)**
   - 1/4 planned tasks blocked pending human approval; no optimized release/recheck flow.
   - A small approval queue causes disproportionate throughput loss.

3. **Routing resilience under load variance (P1)**
   - Swarm avg reliability is good, but floor/min run performance is unstable (0.75 min success).
   - Task router scoring is static and not benchmark-calibrated.

4. **Retry/backoff policy is static (P1)**
   - Retry policy lacks adaptive backoff/jitter tied to failure signatures.
   - Contributes to tail latency spikes and transport_error risk.

5. **Evaluation-to-planning feedback is weakly enforced (P1)**
   - Scorecard exists, but no strict promotion/demotion gate in planning dispatch path.
   - Learning artifacts are generated but not aggressively actioned.

---

## 4) Target Architecture Changes

### 4.1 Cognition-core (quality + calibration)
- Add richer prediction calibration inputs (owner/risk/attempt buckets).
- Introduce confidence penalty for low-support recommendation buckets.
- Tighten mapping from outcomes to recommendation IDs with explicit unmapped accounting.
- Emit a strict "quality gate" object consumable by planner/dispatch.

### 4.2 Swarm-protocol (routing + resilience)
- Introduce benchmark-aware routing weights (load, staleness, capability, recent failure penalty).
- Add dynamic retry/backoff with jitter and bounded exponential schedule.
- Add stricter termination conditions for stuck tasks to avoid silent stalls.

### 4.3 Skills/runtime reliability
- Require idempotency markers for dispatched tasks.
- Add lane-safe dispatch metadata (`lane`, `batch`, `traceId`) for reproducible replay.
- Add fail-fast checks for stale agents before dispatch attempt.

### 4.4 Evaluation loops
- Convert scorecard breaches into generated remediation tasks with deterministic owners.
- Add objective thresholds for “promote/hold/demote” that are enforceable in dispatch pipeline.
- Record pre/post benchmark deltas per merged lane.

---

## 5) Implementation Phases (manual)

### Phase 0 — Safety prep (before coding)
1. Rebase each lane branch to latest `main`.
2. Enforce lane-pure file ownership (no cross-lane edits).
3. Record baseline metrics snapshot in lane notes.

### Phase 1 — Cognition quality gate hardening
1. Update evaluator + threshold tuner to produce stricter calibration signal outputs.
2. Add tests for Brier/calibration failure handling and low-sample behavior.
3. Ensure report scripts surface gate decisions.

### Phase 2 — Swarm routing and retry reliability
1. Update router scoring with adaptive penalties and deterministic tie-break rules.
2. Add adaptive retry schedule with jitter + ceiling.
3. Add tests for timeout/retry transitions and no-infinite-loop guarantees.

### Phase 3 — Dispatch + approval throughput
1. Improve pending-approval handling path for fast release after approval.
2. Add clear blocked-task metadata for operator queue tooling.
3. Validate dispatch artifacts remain backwards-compatible.

### Phase 4 — Evaluation-to-action closure
1. Wire scorecard breach conditions into remediation planning.
2. Add benchmark-comparison utility (`before` vs `after`).
3. Produce final productivity delta report.

---

## 6) Explicit Acceptance Tests

All tests must pass before lane merge.

### 6.1 Repo-wide
```bash
npm run typecheck
npm run lint
npm run build
```

### 6.2 Cognition-core quality gates
```bash
npm --prefix cognition-core test
npm --prefix cognition-core run run:dispatch
npm --prefix cognition-core run evaluate
npm --prefix cognition-core run scorecard
```
Pass criteria:
- No test failures.
- `cognition-core/reports/cognition-daily.json` generated.
- `productivity-scorecard.latest.json` generated and parseable.

### 6.3 Swarm reliability
```bash
npm --prefix swarm-protocol test
npm --prefix swarm-protocol run benchmark:simulate
```
Pass criteria:
- Benchmark threshold evaluation remains PASS.
- No regression below baseline min success floor without explicit waiver.

### 6.4 Artifact integrity
```bash
node -e "JSON.parse(require('fs').readFileSync('cognition-core/reports/productivity-scorecard.latest.json','utf8')); console.log('ok')"
node -e "JSON.parse(require('fs').readFileSync('swarm-protocol/state/simulation-benchmark.json','utf8')); console.log('ok')"
```

---

## 7) Rollback Strategy

1. **Soft rollback (preferred):** revert individual lane commit(s) with `git revert <sha>`.
2. **Hard rollback:** reset branch to last known stable tag/commit and re-run full validation.
3. **Artifact rollback:** restore prior `*.latest.json` and benchmark outputs from git history when report generation changes format unexpectedly.
4. **Operational guardrail:** if benchmark status flips to FAIL or cognition success degrades further, halt merges and open an incident lane.

---

## 8) Expected Productivity Impact (target after all 5 lanes)

### 8.1 Primary targets (next 1–2 cycles)
- Productivity index: **78.19 → 82+**
- Cognition outcome success: **0.00% → >= 40%** (small-sample caveat)
- Calibration gap: **0.50 → <= 0.25**
- Brier score: **0.25 → <= 0.20**
- Swarm min success floor: **0.75 → >= 0.85**
- Blocked approvals per run: **1 → 0–1 with faster release latency**

### 8.2 Secondary targets
- P95 latency: **405ms → <= 320ms**
- Estimated operator step reduction: **66.7% → >= 72%**

---

## 9) 5 Independent Work Lanes (implementation planning)

> Lane rules: lane-pure commits, no shared-file overlap, rebase before merge, include tests + validation commands in PR body.

### Lane 1 — Cognition evaluator + calibration hardening
- Label: `occ-lane-01-cognition-calibration`
- Scope files:
  - `cognition-core/src/learning/evaluator.ts`
  - `cognition-core/src/learning/threshold-tuner.ts`
  - `cognition-core/test/learning/evaluator.test.ts`
  - `cognition-core/test/learning-loop.test.ts`
- Deliverables:
  - Improved calibration metrics + low-sample confidence handling.
  - Explicit quality-gate payload for downstream use.
- Validation:
  - `npm --prefix cognition-core test`
  - `npm --prefix cognition-core run evaluate`
- Commit criteria:
  - Only lane files changed.
  - Tests added/updated for every behavior change.

### Lane 2 — Swarm router scoring reliability
- Label: `occ-lane-02-swarm-router`
- Scope files:
  - `swarm-protocol/src/task-router.ts`
  - `swarm-protocol/test/task-router.test.ts`
  - `swarm-protocol/scenarios/baseline-thresholds.json` (if needed)
- Deliverables:
  - Benchmark-aware weighted routing with deterministic tie-breaks.
  - Guardrails for stale/bad heartbeat agents.
- Validation:
  - `npm --prefix swarm-protocol test -- task-router.test.ts`
  - `npm --prefix swarm-protocol run benchmark:simulate`
- Commit criteria:
  - Routing behavior changes covered by tests.

### Lane 3 — Orchestrator retry/backoff robustness
- Label: `occ-lane-03-retry-backoff`
- Scope files:
  - `swarm-protocol/src/task-orchestrator.ts`
  - `swarm-protocol/test/task-orchestrator.test.ts`
  - `swarm-protocol/test/simulation-harness.test.ts` (if required)
- Deliverables:
  - Adaptive retry with bounded exponential backoff + jitter.
  - No infinite retry loops; explicit terminalization.
- Validation:
  - `npm --prefix swarm-protocol test -- task-orchestrator.test.ts`
  - `npm --prefix swarm-protocol test -- simulation-harness.test.ts`
- Commit criteria:
  - Retry lifecycle states fully tested.

### Lane 4 — Dispatch approval throughput + task metadata
- Label: `occ-lane-04-dispatch-approval-flow`
- Scope files:
  - `cognition-core/scripts/dispatch.ts`
  - `cognition-core/test/planner/dispatch.test.ts`
  - `swarm-protocol/scripts/export-approval-queue.ts` (optional, if needed)
- Deliverables:
  - Better blocked-task metadata and faster approval release path compatibility.
  - Backward-compatible dispatch report schema evolution.
- Validation:
  - `npm --prefix cognition-core test -- planner/dispatch.test.ts`
  - `npm --prefix cognition-core run dispatch`
- Commit criteria:
  - Artifacts remain parseable by existing scorecard/report scripts.

### Lane 5 — Evaluation-to-action loop + benchmark delta reporting
- Label: `occ-lane-05-scorecard-loop`
- Scope files:
  - `cognition-core/scripts/productivity-scorecard.ts`
  - `cognition-core/scripts/plan-remediation-tasks.ts`
  - `cognition-core/test/report/report-generation.test.ts`
  - `docs/cognition-core-swarm-operations.md`
- Deliverables:
  - Before/after benchmark delta section in scorecard.
  - Automatic remediation task generation from breached thresholds.
- Validation:
  - `npm --prefix cognition-core test -- report/report-generation.test.ts`
  - `npm --prefix cognition-core run scorecard`
- Commit criteria:
  - Scorecard output includes deterministic delta fields.

---

## 10) Merge Protocol (mandatory)

1. Rebase lane branch on `main` immediately before merge.
2. Confirm lane-pure diff and no overlap with active lanes.
3. Run lane validation commands + repo-wide smoke checks.
4. Merge lane; rerun:
   - `npm run typecheck`
   - `npm run build`
   - `npm --prefix cognition-core run scorecard`
   - `npm --prefix swarm-protocol run benchmark:simulate`
5. Record productivity delta and benchmark delta in cycle report.

---

## 11) Operator Quick Start (step-by-step)

1. Confirm baseline artifact freshness.
2. Launch all 5 lanes in parallel with strict file ownership.
3. Monitor for overlap; block merges if overlap appears.
4. Merge lanes one-by-one with rebase + validation gates.
5. Recompute productivity scorecard and swarm benchmark.
6. Publish cycle summary with delta and next priorities.
