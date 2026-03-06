# Cognition-Core Blueprint (v1)

## Vision
Cognition-core should be the **decision intelligence layer** for OpenClaw:
- observes execution and environment signals,
- reasons about risk/priority/impact,
- produces concrete plans,
- verifies outcomes,
- continuously improves policy and skill quality.

In practice: cognition-core becomes the operating brain that converts raw logs/events into reliable business actions.

---

## Product Goals
1. **Reliable situational awareness**: unified, queryable timeline of what happened.
2. **Actionable intelligence**: prioritized recommendations with evidence and confidence.
3. **Safe autonomy**: fail-closed decisions with policy gates and human-approval routing.
4. **Continuous learning**: measurable uplift over time via outcome feedback loops.
5. **Operational usability**: day/week/month reports for real business operations.

## Non-Goals (v1)
- Fully autonomous irreversible actions without policy gates.
- Black-box recommendations without traceability.
- Overfitting to one provider/model.

---

## Target Architecture

### 1) Signal Ingestion Layer
**Purpose:** Ingest event streams from OpenClaw runtime, gateway, messaging, CI/CD, and business ops.

- Inputs:
  - gateway logs (connect/disconnect/restarts)
  - skill execution artifacts
  - subagent outcomes
  - repo/CI events
  - CRM + revenue signals
- Output: normalized event envelope (`CognitionEvent`)

### 2) Normalization + Enrichment Layer
**Purpose:** Convert heterogeneous logs into typed events + enrich with context.

- Functions:
  - schema validation
  - dedupe
  - entity extraction
  - risk labeling
  - source confidence scoring

### 3) State + Memory Layer
**Purpose:** Maintain durable operational state for planning and trend analysis.

- Artifacts:
  - incident/state snapshots
  - memory graph
  - task/journal timeline
  - baseline metrics windows

### 4) Reasoning Engines
**Purpose:** Generate actionable intelligence from current state.

- Engines:
  - anomaly detector
  - root-cause analyzer
  - counterfactual simulator
  - remediation planner
  - revenue-impact scorer

### 5) Policy + Approval Layer
**Purpose:** Enforce risk posture before recommendations become action.

- fail-closed on missing risk metadata
- explicit tiering: low/medium/high/critical
- human approval requirements for high/critical outputs

### 6) Execution Planning Layer
**Purpose:** Convert recommendations into executable task DAGs for swarm-protocol.

- output:
  - prioritized tasks
  - dependencies
  - owner routing suggestions
  - verification criteria

### 7) Learning + Evaluation Layer
**Purpose:** Measure recommendation quality and improve over time.

- score outcomes against predictions
- learn policy threshold adjustments
- maintain promotion/hold/demote signals for skills

### 8) Interfaces + Reporting Layer
**Purpose:** Expose cognition outputs to humans and automation.

- CLI scripts
- JSON state artifacts
- markdown ops reports
- dashboard-ready metrics

---

## Code Architecture (Target)

```
cognition-core/
  src/
    contracts/
      events.ts
      state.ts
      recommendations.ts
      policies.ts
    ingest/
      gateway-ingest.ts
      runtime-ingest.ts
      business-ingest.ts
    normalize/
      event-normalizer.ts
      enrichment.ts
      dedupe.ts
    state/
      state-store.ts
      snapshots.ts
      memory-index.ts
    reasoning/
      anomaly.ts
      root-cause.ts
      counterfactual.ts
      remediation.ts
      impact-scoring.ts
    policy/
      policy-engine.ts
      approval-gates.ts
      fail-closed.ts
    planner/
      dag-compiler.ts
      task-packager.ts
    learning/
      evaluator.ts
      threshold-tuner.ts
      feedback-loop.ts
    report/
      markdown.ts
      json.ts
      scoreboard.ts
  scripts/
    ingest.ts
    analyze.ts
    plan.ts
    evaluate.ts
    report.ts
  test/
    contracts/
    ingest/
    policy/
    planner/
    learning/
```

---

## Core Contracts (must exist)

### CognitionEvent
- `eventId`
- `ts`
- `source`
- `type`
- `severity`
- `entities[]`
- `payload`
- `confidence`
- `riskTier`

### CognitionRecommendation
- `recommendationId`
- `title`
- `reasoning`
- `evidence[]`
- `priority`
- `riskTier`
- `requiresHumanApproval`
- `estimatedImpact`
- `verificationPlan`

### CognitionTask
- `taskId`
- `owner`
- `dependencies[]`
- `commands/actions`
- `successCriteria`
- `rollbackPlan`

---

## Step-by-Step Build Plan (Code-Complete Path)

## Phase 0 — Baseline + Contracts
1. Add typed contracts for events/state/recommendations/tasks.
2. Add schema validators and fixtures.
3. Add contract tests.

**Exit criteria:** all core contracts validated and versioned.

## Phase 1 — Ingestion Pipeline
1. Build ingestion adapters for gateway/runtime/business artifacts.
2. Add deterministic normalization + dedupe.
3. Persist normalized event stream.

**Exit criteria:** one command ingests last 24h and outputs valid normalized event set.

## Phase 2 — Reasoning + Prioritization
1. Implement anomaly + root-cause + impact scoring.
2. Implement remediation generator with confidence scoring.
3. Emit ranked recommendation list.

**Exit criteria:** recommendations reproducible from same inputs.

## Phase 3 — Policy + Safe Planning
1. Implement fail-closed policy engine.
2. Add approval gating and risk-tier enforcement.
3. Compile approved recommendations into task DAG.

**Exit criteria:** no high/critical task emitted without approval marker.

## Phase 4 — Learning Loop
1. Compare planned vs actual outcomes.
2. Add threshold tuner and recommendation quality metrics.
3. Write improvement decisions to state artifacts.

**Exit criteria:** weekly evaluation report shows measurable recommendation quality metrics.

## Phase 5 — Interface + Ops Integration
1. Add unified CLI (`cognition run`) for ingest→analyze→plan→evaluate→report.
2. Add markdown and JSON outputs for operators.
3. Integrate with swarm/skills state files.

**Exit criteria:** one command produces operator-ready report + machine-actionable tasks.

---

## Reliability/Quality Gates
- Typecheck + tests pass.
- Determinism checks on same input snapshot.
- Policy fail-closed tests for missing risk metadata.
- Backward-compat schema migration notes.

---

## Monday Launch-Focused Deliverables
1. `cognition-core/scripts/run.ts` orchestrator.
2. `reports/cognition-daily.md` and `reports/cognition-daily.json`.
3. `skills/state/cognition-recommendations.json`.
4. `skills/state/cognition-task-dag.json`.
5. `skills/state/cognition-evaluation.json`.

---

## 5-Agent Build Execution Plan

1. **Agent A — Contracts + State Foundations**
   - Build contracts, validators, typed state store.

2. **Agent B — Ingestion + Normalization**
   - Build adapters and deterministic event normalization.

3. **Agent C — Reasoning + Policy Engine**
   - Build anomaly/root-cause/remediation and fail-closed policy.

4. **Agent D — Planner + Swarm Integration**
   - Build DAG compiler and task packaging for execution.

5. **Agent E — Evaluation + Reporting + Orchestrator**
   - Build learning/evaluation/reporting and unified run command.

Each agent ships independently to `main` with validation and integration checkpoints.
