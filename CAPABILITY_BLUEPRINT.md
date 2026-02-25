# Capability Blueprint

This document defines the high-impact capabilities needed to turn OpenClaw-Code into a production-grade agent operating substrate for both autonomous agents and human teams.

## Principles
- Build primitives that are composable across projects (`cognition-core` + `swarm-protocol`).
- Prefer observability and recovery over raw speed.
- Keep every capability testable in isolation.
- Ship in slices: useful immediately, extensible later.

## Now (In Progress)

### 1) Durable Task Memory
Objective: task orchestration survives process crashes/restarts.
- [x] Add persistent task store (`append log + snapshot`) for orchestrator state.
- [x] Add orchestrator `hydrate()` and `flush()` lifecycle.
- [x] Add recovery tests (restart replay, terminal-state consistency).

### 2) Live Agent Registry
Objective: route tasks using real-time agent health/capability data.
- [x] Build heartbeat-backed registry.
- [x] Add stale-agent pruning and availability summary.
- [x] Expose `routeTask` adapter for orchestrator integration.

### 3) Human Review Gates
Objective: allow safe human checkpoints for high-risk tasks.
- [x] Add `approval_required` task metadata and pause/resume state.
- [x] Add deterministic policy engine (`priority`, `capabilities`, `risk tags`).
- [x] Emit approval queue artifacts for operators.

## Next

### 4) Workflow DAG Executor
Objective: run multi-step plans with dependencies and retries.
- [x] DAG schema (`nodes`, `edges`, `retry policy`).
- [x] Execution engine with failure isolation and resumability.
- [x] Critical path metrics + per-node telemetry.

### 5) Shared Memory Contracts
Objective: standardized artifacts between agents/humans/tools.
- [x] Typed contracts for reports, decisions, and handoffs.
- [x] Versioning + migration helpers.
- [x] Validation hooks on write/read.

### 6) Simulation & Benchmark Harness
Objective: stress-test routing, orchestration, and failure behavior.
- [x] Scenario DSL (timeouts, flaky workers, overload).
- [x] Benchmark runner with repeatable seeds.
- [x] Regression thresholds in CI.

## Later

### 7) Policy/Safety Layer
Objective: prevent unsafe or non-compliant actions by default.
- [x] Pre-dispatch policy checks with explicit denials.
- [x] Redaction/sanitization filters for sensitive payloads.
- [x] Signed audit logs for post-incident review.

### 8) Cost/Latency Optimizer
Objective: dynamically optimize execution quality vs cost vs speed.
- [x] Per-task budget/latency constraints.
- [x] Adaptive routing by historical performance.
- [x] Explainable optimization decisions.

### 9) Unified Operator CLI
Objective: one control plane for debugging and operations.
- [x] `status`, `queue`, `replay`, `reroute`, `drain` commands.
- [x] Live tail for task lifecycle events.
- [x] Human override commands with full audit trail.

### 10) Shared World-State Graph
Objective: consistent, queryable model of what the swarm currently believes.
- [ ] Cross-contract indexing and entity linking.
- [ ] Temporal snapshots and diff views.
- [ ] Confidence scoring for each fact edge.

### 11) Learning Loop Engine
Objective: convert incidents/outcomes into automatic policy + prompt improvements.
- [ ] Outcome ingestion contracts from completed tasks.
- [ ] Counterfactual replay over historical traces.
- [ ] Suggested improvements with measurable expected impact.

### 12) Capability Marketplace
Objective: discover, evaluate, and route to specialized skills dynamically.
- [ ] Skill metadata contracts (quality, cost, latency, risk).
- [ ] Runtime skill probing/verification.
- [ ] Auto-retirement for stale or failing skills.

### 13) Tool Sandbox Orchestrator
Objective: run risky actions inside constrained environments by default.
- [ ] Per-task sandbox profile selection.
- [ ] Deterministic execution logs and replay tokens.
- [ ] Escalation workflow for privileged actions.

### 14) Human-Agent Collaboration UX
Objective: make coordination legible and fast for operators.
- [ ] Task timeline with approvals, retries, and causal links.
- [ ] “Why this decision?” explanations generated from telemetry.
- [ ] One-click intervention actions with audit trails.

### 15) Federation & Trust Layer
Objective: coordinate across organizations without central trust assumptions.
- [ ] Signed inter-swarm envelopes and key rotation.
- [ ] Tenant-aware policy boundaries.
- [ ] Protocol bridge for heterogeneous agent stacks.

## Build Order
1. Durable Task Memory
2. Live Agent Registry
3. Human Review Gates
4. Workflow DAG Executor
5. Shared Memory Contracts
6. Simulation & Benchmark Harness
