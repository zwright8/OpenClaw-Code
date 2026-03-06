# OpenClaw-Code Improvement Blueprint (Canonical)

Last updated: 2026-03-06 09:36 America/New_York (cron cycle: openclaw-code-architecture-6h)
Owner: main orchestrator
Scope: `cognition-core`, `swarm-protocol`, skills/runtime reliability, evaluation loops

---

## 1) Research Inputs (This Cycle)

### 1.1 Required `web_search` execution
Executed required `web_search` queries for:
- cognition-core architecture + deterministic orchestration patterns
- swarm protocol reliability / multi-agent coordination patterns
- skills/runtime reliability and observability patterns
- evaluation loop and benchmark methodology patterns

Observed result: **all queries failed** with `429 exceeded_current_quota_error` (Kimi account suspended due to insufficient balance).

### 1.2 Fallback practical OSS research used (`web_fetch`)
To keep the cycle actionable, this run used direct fetches from authoritative docs and OSS references:
- LangGraph durable execution and determinism/idempotency requirements
- Temporal retry policy semantics and declarative retry behavior
- OpenTelemetry traces/span hierarchy for correlated telemetry
- AutoGen group-chat manager turn-selection pattern + role specialization
- LangSmith offline + online evaluation workflow split
- Ragas multi-metric evaluation catalog for agent/tool-use quality
- Anthropic “building effective agents” guidance (prefer simplest composable architecture)
- SWE-bench benchmark ecosystem signal for coding-agent evaluation discipline

### 1.3 Insights applied to OpenClaw-Code
1. **Durability without deterministic replay is a trap**: side effects must be idempotent and replay-safe.
2. **Retry policy should be declarative + reason-coded**: avoid ad-hoc local retry logic drift.
3. **Observability should be remediation-ready**: trace + reason payloads must map directly to fix planners.
4. **Evaluation must run in two loops**: offline regression gating + online quality monitoring.
5. **Use multi-metric quality, not one KPI**: productivity, reliability, calibration, latency, and tool-call quality all matter.
6. **Prefer simple composable workflows before complex autonomy**: complexity only where measurable gains exist.

---

## 2) Current Baseline Metrics (Fresh Snapshot)

Artifact anchors:
- `cognition-core/reports/productivity-scorecard.latest.json` (`generatedAt`: `2771-09-17T21:33:36.931Z`) ⚠ invalid future timestamp
- `cognition-core/reports/cognition-daily.json` (`generatedAt`: `2026-03-06T13:38:21.653Z`)
- `cognition-core/reports/failed-outcome-audit.latest.json` (`generatedAt`: `2026-03-06T13:38:19.009Z`)
- `swarm-protocol/state/simulation-benchmark.json` (`generatedAt`: missing, `thresholdCheck`: missing)

### 2.1 Productivity baseline
- Overall: **strong**
- Productivity index: **97.83 / 100**
- Cycle time: **2.341s**
- Automation coverage: **100%**
- Dispatch count: **4**
- Blocked approvals: **0**
- Cognition success rate: **100%**
- Swarm simulation success rate: **90.63%**
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
- Calibration readiness: **insufficient_sample_size** (`minimumSampleSize=3`, `mappedOutcomes=1`)
- Confidence envelope upper bound: **0.764**

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
- Avg success rate: **0.9063**
- Min success rate: **0.75**
- Avg timeout rate: **0.0**
- Max timeout rate: **0.0**
- Avg latency: **112.03ms**
- P95 latency: **330ms**
- Metadata quality: **missing `generatedAt` + `thresholdCheck` fields**

### 2.5 Delta vs prior 6h baseline (03:30 cycle)
- Productivity index: `96.76 -> 97.83` (**+1.07**)
- Cycle time: `10.965s -> 2.341s` (**-8.624s**, improved)
- Swarm avg success: `90.63% -> 90.63%` (**flat**)
- Swarm min success: `0.75 -> 0.75` (**flat**)
- Swarm p95 latency: `330ms -> 330ms` (**flat**)
- Calibration readiness: unchanged (`insufficient_sample_size`)
- Scorecard timestamp anomaly: `2935 -> 2771` (**less extreme, still invalid**)

---

## 3) Prioritized Bottlenecks

### P0
1. **Scorecard artifact timestamp contract remains broken** (`generatedAt` year 2771).
2. **Swarm benchmark contract incomplete** (missing `generatedAt` and `thresholdCheck`).
3. **Calibration remains non-actionable** due low terminal outcome sample.

### P1
4. **Swarm reliability floor remains brittle** (`successRateMin=0.75`, target >=0.80).
5. **High-risk recommendation metadata still incomplete** (`required-approvers-missing`, `rollback-plan-missing`).
6. **Retry/backoff reason taxonomy can drift across routing/orchestration/remediation outputs.**

### P2
7. Throughput is healthy; next gains must come from reliability evidence quality and lower variance, not raw volume.

---

## 4) Target Architecture Changes

### 4.1 Cognition-core
- Enforce write-time and test-time timestamp sanity bounds.
- Keep threshold checks + diagnostics schema-stable and machine-readable.
- Improve terminal outcome progression and calibration readiness observability.
- Fail-closed on missing metadata for high-risk recommendations.

### 4.2 Swarm-protocol
- Emit contract-complete benchmark artifacts every run.
- Raise degraded routing reliability floor while preserving deterministic replay behavior.
- Canonicalize retry/backoff reason payloads end-to-end.

### 4.3 Skills/runtime reliability
- Ensure side-effect boundaries are idempotent and replay-safe.
- Bind trace IDs/reason payloads to remediation tasks for direct root-cause routing.

### 4.4 Evaluation loop
- Keep offline regression suite deterministic and reproducible.
- Keep online scorecards benchmark-linked and threshold-check explicit.

---

## 5) Implementation Phases

### Phase 0 — Lane hygiene + safety
1. Rebase every lane branch from latest `main` before coding and before handoff.
2. Enforce lane-pure file ownership (no scope creep commits).
3. Require handoff bundle: changed files, validation output, commit SHA, known risks.

### Phase 1 — Contract integrity
1. Fix scorecard timestamp/year contract and deterministic threshold diagnostics.
2. Fix swarm benchmark metadata contract (`generatedAt`, `thresholdCheck`).

### Phase 2 — Reliability + taxonomy hardening
1. Improve degraded route floor behavior.
2. Canonicalize retry/backoff reason taxonomy across router + orchestrator + artifacts.

### Phase 3 — Calibration/evidence progression
1. Improve terminal outcome closure instrumentation and mapped outcome accounting.
2. Make calibration readiness progression explicit and testable.

### Phase 4 — Policy closure + evaluation stabilization
1. Enforce fail-closed metadata checks for high-risk recommendations.
2. Ensure evaluation artifacts remain machine-actionable under failures.

---

## 6) Explicit Acceptance Tests

### Repo-level gates
```bash
npm run typecheck
npm run build
```

### Cognition-core gates
```bash
npm --prefix cognition-core test
npm --prefix cognition-core run evaluate
npm --prefix cognition-core run dispatch
npm --prefix cognition-core run scorecard
```

### Swarm-protocol gates
```bash
npm --prefix swarm-protocol test
npm --prefix swarm-protocol run benchmark:simulate
```

### Artifact integrity gates
```bash
node -e "const s=JSON.parse(require('fs').readFileSync('cognition-core/reports/productivity-scorecard.latest.json','utf8')); if(!s.generatedAt) throw new Error('missing scorecard generatedAt'); const y=Number(String(s.generatedAt).slice(0,4)); if(!(y>=2024&&y<=2100)) throw new Error('scorecard generatedAt year out of range'); if(!s.thresholdChecks) throw new Error('missing scorecard thresholdChecks'); console.log('scorecard contract ok');"
node -e "const b=JSON.parse(require('fs').readFileSync('swarm-protocol/state/simulation-benchmark.json','utf8')); if(!b.generatedAt) throw new Error('missing benchmark generatedAt'); if(!b.thresholdCheck) throw new Error('missing benchmark thresholdCheck'); console.log('benchmark contract ok');"
node -e "const d=JSON.parse(require('fs').readFileSync('cognition-core/reports/cognition-daily.json','utf8')); if(!d.generatedAt) throw new Error('missing cognition-daily generatedAt'); console.log('cognition-daily ok');"
node -e "const f=JSON.parse(require('fs').readFileSync('cognition-core/reports/failed-outcome-audit.latest.json','utf8')); if(!f.generatedAt) throw new Error('missing failed-outcome-audit generatedAt'); console.log('failed-outcome-audit ok');"
```

Pass criteria:
- All gates pass.
- Scorecard `generatedAt` is in `2024..2100`.
- Swarm benchmark includes required metadata fields.
- Swarm reliability floor does not regress (`>=0.75`) and trends toward `>=0.80`.

---

## 7) Rollback Strategy

1. **Single-lane rollback**: `git revert <lane_commit_sha>`
2. **Batch rollback**: revert merged lane commit range in reverse order.
3. **Schema rollback**: restore prior artifact schema if downstream parsers break.
4. **Safety halt**: freeze merges when contract tests or regression gates fail.

---

## 8) Expected Productivity Impact (Next 1–2 cycles)

Primary targets:
- Productivity index: **97.83 -> >= 98.20**
- Cycle time: **2.341s -> <= 2.20s** (maintain low-latency gains)
- Calibration readiness: `mappedOutcomes 1 -> >= 2` and clearer readiness diagnostics
- Swarm min success floor: **0.75 -> >= 0.80**
- Swarm p95 latency: **330ms -> <= 300ms**
- Artifact integrity: scorecard + benchmark metadata fully contract-complete

Secondary targets:
- Reduce global quality gaps (`required-approvers-missing`, `rollback-plan-missing`)
- Preserve step reduction at **>=66.7%** while increasing reliability evidence quality

---

## 9) Five Independent Work Lanes (Authoritative Split)

Global lane rules:
- Rebase from `main` before coding and before handoff.
- Lane-pure commits only.
- No cross-lane file overlap.
- Handoff must include changed files, validation output, commit SHA, risks.

### Lane 1 — Scorecard contract/timestamp hardening
- Label: `occ-20260306-0936-lane-01-scorecard-contract`
- Workspace: `/Users/zacharywright/.openclaw/workspace/OpenClaw-Code-lane01`
- Scope files:
  - `cognition-core/scripts/productivity-scorecard.ts`
  - `cognition-core/src/report/scoreboard.ts`
  - `cognition-core/test/report/report-generation.test.ts`
- Required validation:
  - `npm --prefix cognition-core test -- test/report/report-generation.test.ts`
  - `npm --prefix cognition-core run scorecard`
  - scorecard contract node check from Section 6
- Commit criteria:
  - scorecard `generatedAt` in valid range
  - deterministic threshold diagnostics remain schema-stable

### Lane 2 — Swarm benchmark metadata contract hardening
- Label: `occ-20260306-0936-lane-02-benchmark-contract`
- Workspace: `/Users/zacharywright/.openclaw/workspace/OpenClaw-Code-lane02`
- Scope files:
  - `swarm-protocol/scripts/run-simulation-benchmark.ts`
  - `swarm-protocol/state/simulation-benchmark.md` (format sync)
  - `swarm-protocol/test/simulation-harness.test.ts`
- Required validation:
  - `npm --prefix swarm-protocol test -- test/simulation-harness.test.ts`
  - `npm --prefix swarm-protocol run benchmark:simulate`
  - benchmark contract node check from Section 6
- Commit criteria:
  - benchmark JSON always includes `generatedAt` + `thresholdCheck`
  - markdown output remains consistent with JSON summary

### Lane 3 — Calibration readiness + terminal evidence progression
- Label: `occ-20260306-0936-lane-03-calibration-readiness`
- Workspace: `/Users/zacharywright/.openclaw/workspace/OpenClaw-Code-lane03`
- Scope files:
  - `cognition-core/src/learning/evaluator.ts`
  - `cognition-core/src/learning/outcome-mapper.ts`
  - `cognition-core/test/learning/evaluator.test.ts`
  - `cognition-core/test/learning/outcome-mapper.test.ts`
- Required validation:
  - `npm --prefix cognition-core test -- test/learning/evaluator.test.ts`
  - `npm --prefix cognition-core test -- test/learning/outcome-mapper.test.ts`
  - `npm --prefix cognition-core run evaluate`
- Commit criteria:
  - readiness diagnostics deterministic and clearer
  - mapped/terminal accounting less brittle and evidence-forward

### Lane 4 — Fail-closed high-risk metadata enforcement
- Label: `occ-20260306-0936-lane-04-fail-closed-metadata`
- Workspace: `/Users/zacharywright/.openclaw/workspace/OpenClaw-Code-lane04`
- Scope files:
  - `cognition-core/src/contracts/recommendations.ts`
  - `cognition-core/src/policy/fail-closed.ts`
  - `cognition-core/test/contracts/recommendations.test.ts`
  - `cognition-core/test/policy-engine.test.ts`
- Required validation:
  - `npm --prefix cognition-core test -- test/contracts/recommendations.test.ts`
  - `npm --prefix cognition-core test -- test/policy-engine.test.ts`
  - `npm --prefix cognition-core run dispatch`
- Commit criteria:
  - missing approvers/rollback plan on high-risk recommendations are rejected
  - rejection reasons are explicit and machine-readable

### Lane 5 — Swarm reliability floor + retry/backoff taxonomy
- Label: `occ-20260306-0936-lane-05-swarm-floor-taxonomy`
- Workspace: `/Users/zacharywright/.openclaw/workspace/OpenClaw-Code-lane05`
- Scope files:
  - `swarm-protocol/src/task-router.ts`
  - `swarm-protocol/src/task-orchestrator.ts`
  - `swarm-protocol/test/task-router.test.ts`
  - `swarm-protocol/test/task-orchestrator.test.ts`
- Required validation:
  - `npm --prefix swarm-protocol test -- test/task-router.test.ts`
  - `npm --prefix swarm-protocol test -- test/task-orchestrator.test.ts`
  - `npm --prefix swarm-protocol run benchmark:simulate`
- Commit criteria:
  - degraded routing floor improves or holds with explicit reason payloads
  - retry/backoff taxonomy canonicalized across router/orchestrator outputs

---

## 10) Merge Protocol (Mandatory)

1. Rebase lane branch on latest `main` before merge.
2. Confirm lane-pure diff matches Section 9 scope.
3. Attach validation output, changed files, commit SHA, known risks.
4. Merge lanes sequentially (one at a time) to control blast radius.
5. After each merge run smoke checks:
   - `npm run typecheck`
   - `npm --prefix cognition-core test -- test/learning/evaluator.test.ts`
   - `npm --prefix swarm-protocol test -- test/task-router.test.ts`
6. After all merges run:
   - `npm --prefix cognition-core run scorecard`
   - `npm --prefix swarm-protocol run benchmark:simulate`
7. Compare deltas against Section 2 baseline and publish outcome summary.

---

## 11) Step-by-Step Operator Manual

1. Validate Section 2 artifact files parse and record baseline metrics.
2. Launch/continue all five lanes from Section 9 (no overlap).
3. Enforce rebase-first and lane-pure commit policy.
4. Collect lane handoffs: changed files, tests, commit SHA, risks.
5. Merge sequentially using Section 10 protocol.
6. Regenerate scorecard + benchmark artifacts.
7. Recompute productivity + reliability deltas vs Section 2 baseline.
8. Publish concise operator report with:
   - research inputs used
   - blueprint diff summary
   - spawned lane labels / statuses
   - commits merged
   - validation status
   - productivity score delta
   - next 6h priorities
