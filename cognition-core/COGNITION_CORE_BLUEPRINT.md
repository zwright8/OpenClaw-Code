# Cognition Core Blueprint

## 1. Mission
`cognition-core` should continuously measure agent performance, detect drift, learn from errors, and emit executable improvement tasks.

Core outcomes:
- Quantify reliability/performance drift from session logs.
- Quantify learning drift from memory artifacts.
- Learn recurring failure signatures over time.
- Recommend and operationalize new skill acquisition.

## 2. Hard Requirements

### 2.1 Runtime
- Node.js 20+ (recommended).
- `npm install` completed at repo root and in `cognition-core`.
- Read access to session logs, task journal, and memory files.
- Write access to `cognition-core/reports/`.

### 2.2 Required Inputs
- Session index JSON:
  - Default: `~/.openclaw/agents/main/sessions/sessions.json`
  - Must include `updatedAt` and either `sessionFile` or `sessionId`.
- Session event files (`*.jsonl`):
  - Must include `message` events for tool call/result observability.
- Task outcome store:
  - Default: `../swarm-protocol/state/tasks.journal.jsonl`
  - Must persist task lifecycle with `taskId`, `status`, `attempts`, timestamps.
- Memory root:
  - Default: `~/.openclaw/workspace/memory`
  - Markdown files with incident/lesson/action content.
- Skill catalog (recommended):
  - Default: `../skills/generated/runtime.catalog.json`
  - Used to map failure patterns to concrete skill candidates.

### 2.3 Persistent State
- Learning state file:
  - Default: `cognition-core/reports/learning-state.json`
  - Must survive across runs to track recurring error streaks and mastery trend.

## 3. Data Contract Minimums

### 3.1 Session Metadata Contract
- `updatedAt: number` (unix ms or sec supported through normalization).
- `sessionFile: string` or `sessionId: string`.

### 3.2 Session Event Contract (minimum for analytics)
- Tool call signal:
  - `type: "message"`, `message.role: "assistant"`, `message.content[].type in {"toolCall","tool_call","function_call"}`.
- Tool result signal:
  - `type: "message"`, `message.role: "toolResult"`, `message.toolName`, optional `message.isError`, optional `details.durationMs`.

### 3.3 Outcome Contract (minimum for learning loop)
- `taskId`, `status`, optional `target`, `attempts`, `createdAt`, `closedAt`.
- Optional enrichment strongly recommended:
  - `lastError.code`, `lastError.message`, capability hints in `request.context`.

## 4. Runtime Pipeline

1. **Telemetry analysis**
- `scripts/analyze-history.ts`
- Produces log performance summary + trend comparison + memory drift analysis.

2. **Remediation planning**
- `src/log-analyzer-v2.ts` + `scripts/plan-remediation-tasks.ts`
- Converts reliability regressions into executable remediation tasks.

3. **Learning loop**
- `scripts/learn-from-outcomes.ts`
- Produces:
  - `errorTaxonomy` (failure classes + recurring signatures)
  - `skillGrowthPlan` (focus areas + suggested skills)
  - `state` (persistent learning trend)

4. **Skill-growth operationalization**
- `scripts/plan-skill-growth-tasks.ts`
- Converts `skillGrowthPlan.focusAreas` into schema-valid `task_request` payloads.

## 5. Reliability and Drift Gates

### 5.1 Reliability Gates
- Reliability score target: `>= 90`.
- Tool error rate target: `< 5%` for frequently called tools (`calls >= 5`).
- Malformed JSONL lines target: `0` in steady state.

### 5.2 Learning Gates
- Failure drift in learning state should trend `stable` or `improving`.
- Recurring error signatures should not increase run-over-run.
- Skill-growth tasks should be generated when drift is `watch` or `critical`.

### 5.3 Memory Drift Gates
- Reflection coverage target: `>= 1.0` (lessons/actions keep pace with errors).
- Memory drift target: not `critical` for consecutive runs.

## 6. Output Artifacts

Expected core artifacts:
- `reports/cognition-report.json`
- `reports/cognition-report.md`
- `reports/memory-guardrails.json`
- `reports/memory-guardrails.md`
- `reports/memory-guardrails-backfill.json`
- `reports/memory-guardrails-backfill.md`
- `reports/remediation-tasks.json`
- `reports/learning-loop.json`
- `reports/learning-loop.md`
- `reports/learning-state.json`
- `reports/skill-growth-tasks.json`
- `reports/cognition-iteration-plan.json`
- `reports/cognition-iteration-plan.md`
- `reports/cognition-iteration-tasks.json`
- `reports/iteration-history.jsonl`
- `reports/readiness.json`
- `reports/readiness.md`

If these are not generated, the system is operationally incomplete.

## 7. Operating Commands

From `cognition-core/`:
- Analyze telemetry and drift:
  - `npm run analyze`
- Learn from outcomes and persist state:
  - `npm run learn:loop`
- Audit memory template compliance:
  - `npm run memory:guardrails`
- Backfill missing memory sections:
  - `npm run memory:backfill`
- Generate curiosity-driven iteration hypotheses and experiment tasks:
  - `npm run iterate:plan`
- Generate remediation tasks:
  - `npm run plan:tasks`
- Generate skill-growth tasks:
  - `npm run plan:skills`
- Run full pipeline + readiness gates:
  - `npm run build:full`
- Validate integrity:
  - `npm test`
  - `npm run typecheck`

## 8. Failure Modes and Required Guards

- Missing sessions index or session files:
  - Must fail clearly with actionable error text.
- Sparse or malformed task outcomes:
  - Must continue with normalized fallbacks; never crash silently.
- Missing skill catalog:
  - Must still output focus areas using fallback skill keywords.
- Missing memory directory:
  - Must skip memory drift cleanly or disable via `--no-memory`.
- State corruption:
  - Must allow bootstrapping from empty/null state.

## 9. Definition of Done (Production-Ready Cognition Core)

- End-to-end run generates all artifacts in Section 6.
- Tests and typecheck pass consistently.
- Remediation tasks and skill-growth tasks are schema-valid and dispatchable.
- Learning state evolves across runs (run count increments, trend fields update).
- Drift alerts are actionable (not just descriptive) and produce concrete tasks.
- Iteration plan is generated each run and appended to `iteration-history.jsonl` for novelty-aware planning.
