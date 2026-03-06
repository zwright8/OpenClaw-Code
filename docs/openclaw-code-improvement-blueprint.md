# OpenClaw-Code Improvement Blueprint (Canonical)

Last updated: 2026-03-06 15:36 America/New_York (cron cycle: openclaw-code-architecture-6h)
Owner: main orchestrator
Scope: `cognition-core`, `swarm-protocol`, skills/runtime reliability, evaluation loops

---

## 1) Research Inputs (This Cycle)

### 1.1 Required `web_search` execution
Executed required `web_search` queries for architecture/agent-systems best practices in:
- cognition core and deterministic orchestration
- swarm protocol reliability and multi-agent coordination
- skills/runtime reliability patterns
- evaluation loops and benchmark governance

Observed result: **all `web_search` calls failed** with `429 exceeded_current_quota_error` (Kimi account suspended due to insufficient balance).

### 1.2 Fallback practical OSS research used (`web_fetch`)
To keep this cycle actionable, direct source docs/READMEs were used:
- LangGraph (`durable execution`, stateful orchestration, human-in-the-loop)
- Temporal retry policy docs (declarative retries, backoff, non-retryable classes)
- Microsoft AutoGen README (layered core/runtime/agent-chat split)
- OpenAI Evals README (eval-first lifecycle and registry discipline)
- Promptfoo README (CI-oriented eval/red-team workflow)
- CrewAI README (event-driven flows + multi-agent crews split)
- SWE-bench site (benchmark discipline signal for coding-agent systems)

### 1.3 Research insights applied to OpenClaw-Code
1. **Stateful systems need deterministic recovery contracts**: replay/idempotency boundaries must be explicit.
2. **Retries should be policy-driven**: keep retry behavior declarative with reason codes, not ad-hoc branch logic.
3. **Architecture should be layered**: orchestration core, policy surface, and delivery layer should stay separable.
4. **Evaluation is a loop, not a report**: artifacts must be contract-complete and CI-gated.
5. **Reliability floor matters more than average**: improve minimum swarm success, not just mean success.
6. **Use calibrated confidence carefully**: insufficient terminal samples should degrade to explicit readiness states.

---

## 2) Current Baseline Metrics (Fresh Snapshot)

Artifact anchors:
- `cognition-core/reports/productivity-scorecard.latest.json` (`generatedAt`: `2086-11-30T01:19:31.356Z`) ⚠ invalid future timestamp
- `cognition-core/reports/cognition-daily.json` (`generatedAt`: `2026-03-06T20:09:27.636Z`)
- `cognition-core/reports/failed-outcome-audit.latest.json` (`generatedAt`: `2026-03-06T20:09:24.973Z`)
- `swarm-protocol/state/simulation-benchmark.json` (`generatedAt`: `2026-03-06T14:58:47.880Z`, `thresholdCheck.ok`: `true`)

### 2.1 Productivity baseline
- Overall: **strong**
- Productivity index: **97.83 / 100**
- Cycle time: **2.355s**
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
- Mapped outcomes: **1**
- Mapping rate: **1.0**
- Brier score: **N/A** (insufficient sample)
- Calibration gap: **N/A** (insufficient sample)
- Calibration readiness: **insufficient_sample_size**
- Minimum sample size required: **3**
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
- Contract completeness: `generatedAt` and `thresholdCheck` present

### 2.5 Delta vs prior 6h baseline (09:36 cycle)
- Productivity index: `97.83 -> 97.83` (**flat**)
- Cycle time: `2.341s -> 2.355s` (**+0.014s**, slight regression)
- Swarm avg success: `0.9063 -> 0.9063` (**flat**)
- Swarm min success: `0.75 -> 0.75` (**flat**)
- Swarm p95 latency: `330ms -> 330ms` (**flat**)
- Scorecard timestamp anomaly: `year 2771 -> year 2086` (**improved but still invalid**)
- Swarm benchmark metadata contract: **fixed and stable this cycle**

---

## 3) Prioritized Bottlenecks

### P0
1. **Scorecard timestamp sanity remains broken** (`generatedAt` in future year 2086).
2. **Calibration still non-actionable** due insufficient terminal sample size.
3. **Terminal evidence remains sparse** (3/4 recommendations still `no-terminal-outcomes`).

### P1
4. **Swarm reliability floor is brittle** (`successRateMin=0.75`; target >= `0.80`).
5. **High-risk recommendation metadata gaps persist** (`required-approvers-missing`, `rollback-plan-missing`).
6. **Artifact freshness coupling is weak** (benchmark and scorecard generation times can drift significantly).

### P2
7. Throughput is healthy; next productivity gains depend on reliability quality and calibration confidence, not higher volume.

---

## 4) Target Architecture Changes

### 4.1 Cognition-core
- Enforce strict UTC timestamp validity windows at write-time and test-time.
- Keep threshold diagnostics deterministic and schema-stable.
- Improve readiness diagnostics for calibration with explicit shortfall metrics.
- Increase terminal outcome capture and mapping lineage visibility.

### 4.2 Swarm-protocol
- Harden routing behavior to improve reliability floor under degraded paths.
- Canonicalize retry/backoff reason payloads across router + orchestrator + artifacts.
- Keep benchmark metadata contract immutable and CI-enforced.

### 4.3 Skills/runtime reliability
- Fail closed for incomplete high-risk recommendation metadata.
- Keep remediation reason payloads machine-readable and policy-routable.

### 4.4 Evaluation loop
- Add artifact freshness checks (scorecard vs benchmark/daily generation windows).
- Enforce reproducible contract checks in CI and local pre-merge runs.

---

## 5) Implementation Phases

### Phase 0 — Lane hygiene and safety
1. Rebase each lane from `main` before coding and before handoff.
2. Enforce lane-pure commit scopes.
3. Require handoff bundle: changed files, validation output, commit SHA, known risks.

### Phase 1 — Contract integrity hardening
1. Fix scorecard timestamp validity and freshness checks.
2. Lock benchmark + scorecard contract assertions in tests/scripts.

### Phase 2 — Reliability floor and taxonomy
1. Improve degraded route fallback to raise minimum success floor.
2. Canonicalize retry/backoff reason taxonomy across swarm surfaces.

### Phase 3 — Calibration and outcome evidence
1. Improve terminal outcome progression instrumentation.
2. Make calibration readiness transitions explicit and testable.

### Phase 4 — Policy closure and regression-proofing
1. Enforce fail-closed high-risk metadata requirements.
2. Add repo-level contract validation script wired into CI/pre-merge workflow.

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

### Artifact contract gates
```bash
node -e "const fs=require('fs');const s=JSON.parse(fs.readFileSync('cognition-core/reports/productivity-scorecard.latest.json','utf8'));if(!s.generatedAt)throw new Error('missing scorecard generatedAt');const y=Number(String(s.generatedAt).slice(0,4));if(!(y>=2024&&y<=2100))throw new Error('scorecard generatedAt year out of range');if(!s.thresholdChecks)throw new Error('missing scorecard thresholdChecks');console.log('scorecard contract ok');"
node -e "const fs=require('fs');const b=JSON.parse(fs.readFileSync('swarm-protocol/state/simulation-benchmark.json','utf8'));if(!b.generatedAt)throw new Error('missing benchmark generatedAt');if(!b.thresholdCheck)throw new Error('missing benchmark thresholdCheck');console.log('benchmark contract ok');"
node -e "const fs=require('fs');const d=JSON.parse(fs.readFileSync('cognition-core/reports/cognition-daily.json','utf8'));if(!d.generatedAt)throw new Error('missing cognition-daily generatedAt');console.log('cognition-daily contract ok');"
node -e "const fs=require('fs');const a=JSON.parse(fs.readFileSync('cognition-core/reports/failed-outcome-audit.latest.json','utf8'));if(!a.generatedAt)throw new Error('missing failed-outcome-audit generatedAt');console.log('failed-outcome-audit contract ok');"
```

### Freshness gate (new)
```bash
node -e "const fs=require('fs');const s=JSON.parse(fs.readFileSync('cognition-core/reports/productivity-scorecard.latest.json','utf8'));const b=JSON.parse(fs.readFileSync('swarm-protocol/state/simulation-benchmark.json','utf8'));const sd=Date.parse(s.generatedAt);const bd=Date.parse(b.generatedAt);if(Number.isNaN(sd)||Number.isNaN(bd))throw new Error('invalid generatedAt parse');const diffH=Math.abs(sd-bd)/36e5;if(diffH>6)throw new Error('artifact freshness drift > 6h');console.log('artifact freshness ok',diffH.toFixed(2)+'h');"
```

Pass criteria:
- All gates pass.
- Scorecard `generatedAt` is within `2024..2100` and not future-skewed beyond policy.
- Swarm benchmark contract remains complete.
- Swarm reliability floor holds `>=0.75` and trends toward `>=0.80`.

---

## 7) Rollback Strategy

1. **Single-lane rollback**: `git revert <lane_commit_sha>`
2. **Batch rollback**: revert merged lane commits in reverse merge order.
3. **Contract rollback**: restore previous schema only if downstream parsing fails.
4. **Safety freeze**: pause merges when acceptance or contract gates fail.

---

## 8) Expected Productivity Impact (Next 1–2 cycles)

Primary targets:
- Productivity index: **97.83 -> >= 98.10**
- Cycle time: **2.355s -> <= 2.25s**
- Calibration sample: **1 -> >= 2** mapped terminal outcomes
- Swarm min success: **0.75 -> >= 0.80**
- Swarm p95 latency: **330ms -> <= 300ms**
- Timestamp integrity: eliminate future-year anomalies in scorecard artifacts

Secondary targets:
- Reduce global quality gaps (`required-approvers-missing`, `rollback-plan-missing`)
- Maintain step reduction **>=66.7%** while improving confidence quality

---

## 9) Five Independent Work Lanes (Authoritative Split)

Global lane rules:
- Rebase from `main` before coding and before handoff.
- Lane-pure commits only.
- No cross-lane file overlap.
- Each lane must submit: changed files, test outputs, commit SHA, risk notes.

### Lane 1 — Scorecard timestamp + freshness hardening
- Label: `occ-20260306-1536-lane-01-scorecard-timestamp`
- Workspace: `/Users/zacharywright/.openclaw/workspace/OpenClaw-Code-lane01`
- Scope files:
  - `cognition-core/scripts/productivity-scorecard.ts`
  - `cognition-core/src/report/scoreboard.ts`
  - `cognition-core/test/report/report-generation.test.ts`
- Required validation:
  - `npm --prefix cognition-core test -- test/report/report-generation.test.ts`
  - `npm --prefix cognition-core run scorecard`
  - scorecard contract gate from Section 6
- Commit criteria:
  - valid scorecard `generatedAt` window
  - deterministic threshold diagnostics preserved

### Lane 2 — Calibration readiness progression
- Label: `occ-20260306-1536-lane-02-calibration-progression`
- Workspace: `/Users/zacharywright/.openclaw/workspace/OpenClaw-Code-lane02`
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
  - readiness diagnostics explicit and deterministic
  - mapped/terminal accounting robust under low-sample conditions

### Lane 3 — Fail-closed high-risk metadata enforcement
- Label: `occ-20260306-1536-lane-03-fail-closed-metadata`
- Workspace: `/Users/zacharywright/.openclaw/workspace/OpenClaw-Code-lane03`
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
  - high-risk recommendations missing approvers/rollback plans are rejected
  - rejection payloads remain machine-readable

### Lane 4 — Swarm reliability floor + retry taxonomy
- Label: `occ-20260306-1536-lane-04-swarm-floor-taxonomy`
- Workspace: `/Users/zacharywright/.openclaw/workspace/OpenClaw-Code-lane04`
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
  - degraded routing floor improves or remains stable with clearer reasons
  - retry/backoff taxonomy canonicalized across outputs

### Lane 5 — Artifact contract gate + CI wiring
- Label: `occ-20260306-1536-lane-05-artifact-contract-gates`
- Workspace: `/Users/zacharywright/.openclaw/workspace/OpenClaw-Code-lane05`
- Scope files:
  - `scripts/validate-artifact-contracts.mjs` (new or enhanced)
  - `package.json` (script hook)
  - `swarm-protocol/scripts/run-simulation-benchmark.ts` (only if necessary for emitted metadata)
  - `reports/openclaw-code-improvement/*` (validation evidence output, if present)
- Required validation:
  - `node scripts/validate-artifact-contracts.mjs`
  - `npm run typecheck`
  - `npm run build`
- Commit criteria:
  - one command validates scorecard + benchmark + daily + audit contracts + freshness drift
  - command is reproducible and non-interactive for CI use

---

## 10) Merge Protocol (Mandatory)

1. Rebase lane branch on latest `main` before merge.
2. Verify lane diff is scope-pure against Section 9.
3. Attach validation outputs + commit SHA + risk notes.
4. Merge one lane at a time (lowest blast radius first: 1 -> 5).
5. After each merge, run smoke checks:
   - `npm run typecheck`
   - `npm --prefix cognition-core test -- test/learning/evaluator.test.ts`
   - `npm --prefix swarm-protocol test -- test/task-router.test.ts`
6. After all merges:
   - `npm --prefix cognition-core run scorecard`
   - `npm --prefix swarm-protocol run benchmark:simulate`
   - `node scripts/validate-artifact-contracts.mjs` (or equivalent gate set)

---

## 11) Step-by-Step Operator Manual

1. Capture baseline metrics from Section 2 artifacts.
2. Launch/continue all five lanes in Section 9 (no overlap, lane-pure).
3. Enforce `rebase-first` and `scope-pure` rules.
4. Collect lane handoff packets (files/tests/SHA/risks).
5. Merge sequentially via Section 10 protocol.
6. Regenerate scorecard + benchmark + contract validation outputs.
7. Compute deltas versus Section 2 baseline.
8. Publish concise operator report with:
   - research inputs used
   - blueprint diff summary
   - lane labels/statuses
   - merged commits
   - validation status
   - productivity delta
   - next 6h priorities
