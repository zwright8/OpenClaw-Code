# OpenClaw-Code Improvement Blueprint (Canonical)

Last updated: 2026-03-05 03:30 America/New_York (cron cycle: openclaw-code-architecture-6h)
Owner: main orchestrator
Scope: `cognition-core`, `swarm-protocol`, skills/runtime reliability, evaluation loops

---

## 1) Research Inputs (This Cycle)

### 1.1 Required `web_search` execution
Executed required `web_search` queries focused on:
- cognition-core architecture + evaluation loops
- swarm orchestration reliability patterns
- skills/runtime observability and deterministic recovery
- practical OSS agent-system implementations

Observed result on all queries: `Kimi API error (429) exceeded_current_quota_error` (account suspended/insufficient balance).

### 1.2 Fallback practical OSS research used (via `web_fetch`)
Because `web_search` is currently unavailable, this cycle used direct fetches from authoritative docs/OSS READMEs:
- LangGraph durable execution docs (`docs.langchain.com/oss/python/langgraph/durable-execution`)
- Temporal Workflow docs (`docs.temporal.io/workflows`)
- Anthropic engineering note (`anthropic.com/engineering/building-effective-agents`)
- Microsoft AutoGen OSS (`github.com/microsoft/autogen`)
- CrewAI OSS (`github.com/crewAIInc/crewAI`)

### 1.3 Research insights applied to OpenClaw-Code
1. **Determinism + replay safety must be explicit** (checkpointing alone is not enough): side effects and non-deterministic branches need strict isolation and stable re-entry points.
2. **Keep orchestration simple-first**: prefer predictable workflows and bounded autonomy; only increase dynamic behavior where scorecard data justifies it.
3. **Bounded tool-iteration + terminal reason taxonomy** improves drift control and postmortem quality.
4. **Observability must be machine-parseable and action-oriented**: traces/logs should map directly to remediation plans.
5. **Production reliability favors durable state + resumability** over one-shot “successful run” snapshots.

---

## 2) Current Baseline Metrics (Fresh Snapshot)

Artifact anchors:
- `cognition-core/reports/productivity-scorecard.latest.json` (`generatedAt`: `2026-03-05T07:43:31.647Z`)
- `cognition-core/reports/cognition-daily.json` (`generatedAt`: `2026-03-05T07:43:31.046Z`)
- `cognition-core/reports/failed-outcome-audit.latest.json` (`generatedAt`: `2026-03-05T07:43:28.557Z`)
- `swarm-protocol/state/simulation-benchmark.json`

### 2.1 Productivity baseline
- Overall: **strong**
- Productivity index: **98.16 / 100**
- Cycle time: **2.212s**
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
- Calibration readiness: **insufficient_sample_size** (`minimumSampleSize=3`, observed mapped outcomes=1)
- Confidence envelope (95% Hoeffding): observed success `[0,1]`, calibration gap `[0,0.764]`

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

### 2.5 Delta vs previous 6h baseline (prior blueprint snapshot)
- Productivity index: `98.15 -> 98.16` (**+0.01**)
- Cycle time: `2.274s -> 2.212s` (**-0.062s**)
- Swarm min success: `0.75 -> 0.75` (**flat**)
- Swarm p95 latency: `405ms -> 405ms` (**flat**)
- Calibration readiness: unchanged (`insufficient_sample_size`)

---

## 3) Prioritized Bottlenecks

### P0
1. Calibration remains non-actionable due sparse terminal evidence.
2. High-risk recommendation metadata gaps persist (`requiredApprovers`, `rollbackPlan`).
3. Swarm reliability floor remains brittle (`successRateMin=0.75`, timeout spikes to `0.125`).

### P1
4. Tail latency remains unchanged at `p95=405ms` despite cycle-time gains.
5. Retry/backoff + terminal reason telemetry still needs strict canonicalization.
6. Multi-lane merge drift risk persists unless rebase-first + lane-pure commits are enforced.

### P2
7. Productivity index is already near ceiling; additional gains depend on reliability and evidence quality, not throughput inflation.

---

## 4) Target Architecture Changes

### 4.1 Cognition-core
- Make low-sample calibration diagnostics deterministic and schema-stable.
- Increase terminal-outcome observability and enforce risk metadata completeness.

### 4.2 Swarm-protocol
- Harden degraded-mode routing behavior under adverse seeds.
- Canonicalize retry/backoff and terminal reason payloads across orchestrator + audit layers.

### 4.3 Skills/runtime reliability
- Keep fail-closed checks for high-risk recommendations strict and explicit.
- Preserve machine-parseable diagnostics for remediation automation.

### 4.4 Evaluation loop
- Stabilize scorecard + remediation outputs across reruns.
- Emit explicit threshold-breach reason payloads with deterministic ordering.

---

## 5) Implementation Phases

### Phase 0 — Safety + lane hygiene
1. Rebase each lane from latest `main` before coding.
2. Enforce lane-pure ownership (no overlap).
3. Require handoff bundle: changed files, validation output, commit SHA, known risks.

### Phase 1 — Calibration readiness and deterministic diagnostics
1. Strengthen low-sample readiness logic and confidence envelope reporting.
2. Preserve report schema compatibility.

### Phase 2 — Swarm floor hardening
1. Improve degraded routing + timeout fallback determinism.
2. Re-run simulation benchmark and compare floor/tail metrics.

### Phase 3 — Fail-closed policy contracts
1. Block high-risk recommendations with incomplete metadata.
2. Preserve downstream report compatibility.

### Phase 4 — Deterministic scorecard/remediation loop
1. Stabilize remediation IDs/order and breach messaging.
2. Verify rerun-stable artifacts.

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
node -e "JSON.parse(require('fs').readFileSync('cognition-core/reports/productivity-scorecard.latest.json','utf8')); console.log('ok')"
node -e "JSON.parse(require('fs').readFileSync('cognition-core/reports/cognition-daily.json','utf8')); console.log('ok')"
node -e "JSON.parse(require('fs').readFileSync('cognition-core/reports/failed-outcome-audit.latest.json','utf8')); console.log('ok')"
node -e "JSON.parse(require('fs').readFileSync('swarm-protocol/state/simulation-benchmark.json','utf8')); console.log('ok')"
```

Pass criteria:
- All gates pass.
- No JSON/schema parse failures.
- No benchmark regression below floor: `successRateMin >= 0.75`, `p95LatencyMs <= 405`.

---

## 7) Rollback Strategy

1. **Single lane rollback:** `git revert <lane_commit_sha>`
2. **Batch rollback:** revert merged range if cross-lane regression appears.
3. **Schema rollback:** restore prior report schema version from git if parser compatibility breaks.
4. **Safety halt:** suspend merges if threshold breaches appear in scorecard/benchmark outputs.

---

## 8) Expected Productivity Impact (Next 1–2 cycles)

Primary targets:
- Productivity index: **98.16 -> >= 98.60**
- Cycle time: **2.212s -> <= 2.00s**
- Calibration readiness: **insufficient_sample_size -> ready**
- Terminal outcomes/cycle: **1 -> >= 2**
- Swarm min success floor: **0.75 -> >= 0.85**
- Swarm p95 latency: **405ms -> <= 320ms**

Secondary targets:
- Remove global gaps: `required-approvers-missing`, `rollback-plan-missing`
- Step reduction estimate: **66.7% -> >= 70%**

---

## 9) Five Independent Work Lanes (Authoritative Split)

Global lane rules:
- Rebase before coding and again before handoff.
- Lane-pure commits only.
- No cross-lane file overlap.
- Handoff must include changed files, validations, commit SHA, and known risks.

### Lane 1 — Calibration readiness + deterministic diagnostics
- Label: `occ-20260305-0330-lane-01-calibration-readiness`
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
  - deterministic low-sample calibration diagnostics
  - stable confidence envelope output and wording

### Lane 2 — Swarm degraded routing floor hardening
- Label: `occ-20260305-0330-lane-02-routing-floor`
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
  - deterministic degraded fallback behavior
  - stable/improved benchmark floor and timeout rates

### Lane 3 — Retry/backoff telemetry taxonomy normalization
- Label: `occ-20260305-0330-lane-03-retry-telemetry`
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
  - canonical retry/backoff event payloads
  - terminal reason taxonomy stable across reruns

### Lane 4 — Fail-closed high-risk recommendation contracts
- Label: `occ-20260305-0330-lane-04-fail-closed-contracts`
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
  - high-risk actions with missing metadata are blocked
  - deterministic rejection diagnostics

### Lane 5 — Deterministic scorecard/remediation breach messaging
- Label: `occ-20260305-0330-lane-05-scorecard-loop`
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
  - deterministic remediation IDs/order across reruns
  - explicit threshold-breach reason payloads

---

## 10) Merge Protocol (Mandatory)

1. Rebase lane branch on latest `main` before merge.
2. Confirm lane-pure diff matches Section 9 scope.
3. Attach validation output + changed files + commit SHA.
4. Merge lanes sequentially (one at a time).
5. After each merge run smoke checks:
   - `npm run typecheck`
   - `npm --prefix cognition-core test -- test/learning/evaluator.test.ts`
   - `npm --prefix swarm-protocol test -- test/task-router.test.ts`
6. After all merges run:
   - `npm --prefix cognition-core run scorecard`
   - `npm --prefix swarm-protocol run benchmark:simulate`
7. Compare artifact deltas against Section 2 baseline and log productivity impact.

---

## 11) Step-by-Step Operator Manual

1. Confirm Section 2 artifacts exist and parse.
2. Start/continue all five lanes from Section 9.
3. Enforce strict rebase-first + lane-pure commits.
4. Collect handoffs (changed files, tests, SHA, known risks).
5. Merge sequentially with smoke checks after each merge.
6. Regenerate scorecard + benchmark artifacts.
7. Compute and record deltas vs Section 2 baseline.
8. Publish operator update: research inputs, blueprint diff, lane status, merge/validation status, productivity delta, next priorities.
