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
- [ ] Typed contracts for reports, decisions, and handoffs.
- [ ] Versioning + migration helpers.
- [ ] Validation hooks on write/read.

### 6) Simulation & Benchmark Harness
Objective: stress-test routing, orchestration, and failure behavior.
- [ ] Scenario DSL (timeouts, flaky workers, overload).
- [ ] Benchmark runner with repeatable seeds.
- [ ] Regression thresholds in CI.

## Later

### 7) Policy/Safety Layer
Objective: prevent unsafe or non-compliant actions by default.
- [ ] Pre-dispatch policy checks with explicit denials.
- [ ] Redaction/sanitization filters for sensitive payloads.
- [ ] Signed audit logs for post-incident review.

### 8) Cost/Latency Optimizer
Objective: dynamically optimize execution quality vs cost vs speed.
- [ ] Per-task budget/latency constraints.
- [ ] Adaptive routing by historical performance.
- [ ] Explainable optimization decisions.

### 9) Unified Operator CLI
Objective: one control plane for debugging and operations.
- [ ] `status`, `queue`, `replay`, `reroute`, `drain` commands.
- [ ] Live tail for task lifecycle events.
- [ ] Human override commands with full audit trail.

## Build Order
1. Durable Task Memory
2. Live Agent Registry
3. Human Review Gates
4. Workflow DAG Executor
5. Simulation & Benchmark Harness
