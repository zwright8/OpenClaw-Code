# OpenClaw-Code Improvement Blueprint (Canonical)

Last updated: 2026-02-28 08:05 America/New_York (cron cycle: openclaw-code-architecture-6h)
Owner: main orchestrator
Scope: `cognition-core` + `swarm-protocol` + skills/runtime reliability + evaluation loops

---

## 1) Research Inputs Used This Cycle

### 1.1 Required web_search execution
Executed `web_search` with multiple architecture/agent-system queries focused on:
- cognition-core patterns
- swarm orchestration protocols
- runtime reliability and retries
- evaluation/regression loops

Result: **all web_search calls failed** with provider quota suspension (`429 exceeded_current_quota_error`).

### 1.2 Practical OSS fallback sources (fetched directly)
Because web_search failed, this cycle used direct OSS/docs fetches:
- AutoGen teams and termination controls:  
  https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/tutorial/teams.html
- CrewAI task contracts/execution flow:  
  https://docs.crewai.com/concepts/tasks
- LangGraph core architecture (durability/HITL/memory/observability):  
  https://raw.githubusercontent.com/langchain-ai/langgraph/main/README.md
- OpenHands benchmark and multi-interface runtime posture:  
  https://raw.githubusercontent.com/OpenHands/OpenHands/main/README.md
- OpenAI Evals framing for repeatable model/system eval loops:  
  https://raw.githubusercontent.com/openai/evals/main/README.md
- Promptfoo CI-oriented eval/red-team patterning:  
  https://raw.githubusercontent.com/promptfoo/promptfoo/main/README.md

### 1.3 Research insights applied this cycle
1. **Termination is a first-class contract** (explicit stop conditions for teams/tasks; no silent loops).
2. **Durable execution + resumability** should be explicit in orchestration and dispatch artifacts.
3. **Task objects must carry dependencies/context/approval requirements** for reliable multi-agent work.
4. **Eval loops must be CI-grade and regression-aware**, not ad-hoc reporting.
5. **Benchmark deltas are required per merge lane**, not only per daily run.

---

## 2) Current Baseline Metrics (from artifacts)

Artifact anchors:
- `cognition-core/reports/productivity-scorecard.latest.json`
- `cognition-core/reports/cognition-daily.json`
- `cognition-core/reports/failed-outcome-audit.latest.json`
- `swarm-protocol/state/simulation-benchmark.json`

### 2.1 Productivity baseline (latest)
- Overall: **strong**
- Productivity index: **78.17 / 100**
- Cycle time: **2.123s**
- Automation coverage: **100%**
- Dispatch count: **3**
- Blocked approvals: **1**
- Cognition success rate: **0%**
- Swarm simulation success rate: **92.19%**
- Skill utility composite: **100%**
- Recent scorecard delta: productivity **-0.02**, cycle time **+0.153s**

### 2.2 Cognition quality baseline
- Terminal outcomes: **0** (4 non-terminal outcomes)
- Mapping rate: **0**
- Brier score: **N/A** (insufficient mapped terminal outcomes)
- Calibration gap: **N/A** (insufficient mapped terminal outcomes)
- Global quality gaps: `approval-bottleneck-pending`, `no-terminal-outcomes`, `required-approvers-missing`, `rollback-plan-missing`

### 2.3 Swarm benchmark baseline
- Scenario: `baseline-routing-reliability`
- Runs: **8**
- Avg success rate: **0.9219**
- Min success rate: **0.75**
- Avg timeout rate: **0.0156**
- Max timeout rate: **0.125**
- Avg latency: **124.7ms**
- P95 latency: **405ms**
- Threshold status: **PASS**

---

## 3) Prioritized Bottlenecks

### P0
1. **Cognition loop lacks terminal signal density**
   - Success remains 0% because outcomes are mostly non-terminal; quality metrics cannot calibrate.
2. **Approval bottleneck blocks higher-risk recommendations**
   - One blocked approval materially drags throughput and keeps outcomes non-terminal.

### P1
3. **Swarm reliability floor is still too low**
   - Avg is healthy, but min success (0.75) is fragile under variance.
4. **Retry/backoff policy is not fully adaptive and benchmark-coupled**
   - Tail behavior still contributes to higher P95 latency windows.
5. **Scorecard/remediation closure is partial**
   - Threshold breaches are surfaced, but promotion/hold/demotion enforcement remains weakly integrated.

---

## 4) Target Architecture Changes

### 4.1 cognition-core
- Enforce a stricter evaluator contract that distinguishes non-terminal from terminal outcomes in gating decisions.
- Add deterministic quality-gate payloads consumed by dispatch and remediation planners.
- Tighten threshold tuner behavior under low-sample and sparse terminal data.

### 4.2 swarm-protocol
- Add benchmark-aware router penalties (staleness, failure history, load skew).
- Strengthen orchestrator retry with bounded exponential backoff + jitter + terminal exit guarantees.
- Make timeout and retry decisions observable for post-run analysis.

### 4.3 skills/runtime reliability
- Require lane metadata (`laneId`, `traceId`, `batchId`) in dispatch artifacts.
- Preserve fail-closed approval behavior while reducing re-check friction.
- Ensure lane-pure changes are replayable and auditable.

### 4.4 evaluation loops
- Convert threshold breaches into deterministic remediation task artifacts.
- Require before/after benchmark deltas in scorecard output.
- Add CI-friendly acceptance checks for artifact parseability and schema stability.

---

## 5) Implementation Phases

### Phase 0 — Guardrails
1. Rebase each lane branch on latest `main`.
2. Enforce lane-pure file ownership (no cross-lane edits).
3. Snapshot baseline metrics before code changes.

### Phase 1 — Cognition quality gate hardening
1. Update evaluator + tuner for sparse-data-aware gating.
2. Extend unit tests for non-terminal-heavy runs.
3. Export gate decisions into report artifacts.

### Phase 2 — Swarm routing and retry resilience
1. Router scoring updates with deterministic tie-breakers and failure penalties.
2. Adaptive retry/backoff with hard stop conditions.
3. Benchmark and simulation tests for stability floors.

### Phase 3 — Dispatch/approval throughput
1. Improve blocked-task metadata and follow-up routing hints.
2. Keep approval semantics fail-closed but reduce latency to release.
3. Verify backwards-compatible report contracts.

### Phase 4 — Evaluation closure loop
1. Translate scorecard breaches to remediation tasks.
2. Persist before/after benchmark deltas in scorecard artifacts.
3. Wire actionable next steps into docs and operator runbook.

---

## 6) Explicit Acceptance Tests

### 6.1 Repo-level gates
```bash
npm run typecheck
npm run lint
npm run build
```

### 6.2 Cognition-core gates
```bash
npm --prefix cognition-core test
npm --prefix cognition-core run dispatch
npm --prefix cognition-core run evaluate
npm --prefix cognition-core run scorecard
```
Pass criteria:
- Tests pass.
- `cognition-core/reports/productivity-scorecard.latest.json` updates and parses.
- `cognition-core/reports/cognition-daily.json` updates and parses.

### 6.3 Swarm-protocol gates
```bash
npm --prefix swarm-protocol test
npm --prefix swarm-protocol run benchmark:simulate
```
Pass criteria:
- Benchmark threshold remains PASS.
- No regression below baseline min success floor unless explicitly waived.

### 6.4 Artifact integrity gates
```bash
node -e "JSON.parse(require('fs').readFileSync('cognition-core/reports/productivity-scorecard.latest.json','utf8')); console.log('ok')"
node -e "JSON.parse(require('fs').readFileSync('swarm-protocol/state/simulation-benchmark.json','utf8')); console.log('ok')"
```

---

## 7) Rollback Strategy

1. **Lane rollback**: `git revert <lane_commit_sha>` for isolated reversal.
2. **Batch rollback**: revert merged lane range if benchmark/cognition metrics regress.
3. **Artifact rollback**: restore previous report schema/content from git to unblock pipelines.
4. **Safety halt**: stop merges immediately if benchmark flips FAIL or cognition quality degrades further with terminal data present.

---

## 8) Expected Productivity Impact (post-lane merge targets)

Primary targets (next 1–2 cycles):
- Productivity index: **78.17 → >= 82.0**
- Cognition success rate: **0% → >= 35%** (once terminal outcomes are available)
- Blocked approvals per dispatch cycle: **1 → 0–1 with faster release latency**
- Swarm min success floor: **0.75 → >= 0.85**
- P95 latency: **405ms → <= 320ms**

Secondary targets:
- Step reduction estimate: **66.7% → >= 72%**
- Fewer unresolved quality gaps in `failed-outcome-audit.latest.json`

---

## 9) Five Independent Work Lanes (authoritative split)

> Global lane rules: rebase before merge, lane-pure commits, no file overlap, include tests + validation commands in PR notes.

### Lane 1 — cognition evaluator/calibration hardening
- Label: `occ-lane-01-cognition-calibration`
- Files:
  - `cognition-core/src/learning/evaluator.ts`
  - `cognition-core/src/learning/threshold-tuner.ts`
  - `cognition-core/test/learning/evaluator.test.ts`
  - `cognition-core/test/learning-loop.test.ts`
- Validation:
  - `npm --prefix cognition-core test -- learning/evaluator.test.ts`
  - `npm --prefix cognition-core run evaluate`
- Commit criteria:
  - Deterministic gating behavior in low-sample scenarios.
  - No files outside lane scope.

### Lane 2 — swarm router reliability floor
- Label: `occ-lane-02-swarm-router`
- Files:
  - `swarm-protocol/src/task-router.ts`
  - `swarm-protocol/test/task-router.test.ts`
  - `swarm-protocol/scenarios/baseline-thresholds.json` (only if threshold tuning changes)
- Validation:
  - `npm --prefix swarm-protocol test -- task-router.test.ts`
  - `npm --prefix swarm-protocol run benchmark:simulate`
- Commit criteria:
  - Deterministic tie-break behavior and failure/staleness penalties are tested.

### Lane 3 — swarm orchestrator retry/backoff safety
- Label: `occ-lane-03-retry-backoff`
- Files:
  - `swarm-protocol/src/task-orchestrator.ts`
  - `swarm-protocol/test/task-orchestrator.test.ts`
  - `swarm-protocol/test/simulation-harness.test.ts`
- Validation:
  - `npm --prefix swarm-protocol test -- task-orchestrator.test.ts`
  - `npm --prefix swarm-protocol test -- simulation-harness.test.ts`
- Commit criteria:
  - Bounded retries and terminalization guarantees covered by tests.

### Lane 4 — dispatch approval throughput + metadata contracts
- Label: `occ-lane-04-dispatch-approval-flow`
- Files:
  - `cognition-core/scripts/dispatch.ts`
  - `cognition-core/test/planner/dispatch.test.ts`
  - `cognition-core/src/planner/task-packager.ts`
- Validation:
  - `npm --prefix cognition-core test -- planner/dispatch.test.ts`
  - `npm --prefix cognition-core run dispatch`
- Commit criteria:
  - Backward-compatible report schema.
  - Explicit blocked approval metadata available for operators.

### Lane 5 — scorecard closure + remediation automation
- Label: `occ-lane-05-scorecard-loop`
- Files:
  - `cognition-core/scripts/productivity-scorecard.ts`
  - `cognition-core/scripts/plan-remediation-tasks.ts`
  - `cognition-core/test/report/report-generation.test.ts`
  - `docs/cognition-core-swarm-operations.md`
- Validation:
  - `npm --prefix cognition-core test -- report/report-generation.test.ts`
  - `npm --prefix cognition-core run scorecard`
- Commit criteria:
  - Benchmark delta fields stable and deterministic.
  - Threshold breach -> remediation mapping emitted.

---

## 10) Merge Protocol (mandatory)

1. Rebase lane branch onto latest `main` before merge.
2. Verify lane-pure diff (no overlap with active/merged lanes).
3. Run lane-local validations.
4. Merge lane.
5. After each merge, run smoke checks:
   - `npm run typecheck`
   - `npm run build`
6. After all merges, run:
   - `npm --prefix cognition-core run scorecard`
   - `npm --prefix swarm-protocol run benchmark:simulate`
7. Record productivity and benchmark deltas in cycle report.

---

## 11) Operator Manual (step-by-step)

1. Confirm artifacts are fresh and parseable.
2. Launch all 5 lanes in parallel with strict ownership.
3. Block and resolve any file-overlap conflicts before coding continues.
4. Enforce rebase + lane-pure commit discipline.
5. Merge one lane at a time with validations.
6. Recompute scorecard + benchmark and capture deltas.
7. Publish concise cycle report with next 6h priorities.
