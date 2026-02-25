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
- [x] Cross-contract indexing and entity linking.
- [x] Temporal snapshots and diff views.
- [x] Confidence scoring for each fact edge.

### 11) Learning Loop Engine
Objective: convert incidents/outcomes into automatic policy + prompt improvements.
- [x] Outcome ingestion contracts from completed tasks.
- [x] Counterfactual replay over historical traces.
- [x] Suggested improvements with measurable expected impact.

### 12) Capability Marketplace
Objective: discover, evaluate, and route to specialized skills dynamically.
- [x] Skill metadata contracts (quality, cost, latency, risk).
- [x] Runtime skill probing/verification.
- [x] Auto-retirement for stale or failing skills.

### 13) Tool Sandbox Orchestrator
Objective: run risky actions inside constrained environments by default.
- [x] Per-task sandbox profile selection.
- [x] Deterministic execution logs and replay tokens.
- [x] Escalation workflow for privileged actions.

### 14) Human-Agent Collaboration UX
Objective: make coordination legible and fast for operators.
- [x] Task timeline with approvals, retries, and causal links.
- [x] “Why this decision?” explanations generated from telemetry.
- [x] One-click intervention actions with audit trails.

### 15) Federation & Trust Layer
Objective: coordinate across organizations without central trust assumptions.
- [x] Signed inter-swarm envelopes and key rotation.
- [x] Tenant-aware policy boundaries.
- [x] Protocol bridge for heterogeneous agent stacks.

### 16) Autonomous Recovery Supervisor
Objective: automatically detect incidents and generate executable recovery plans.
- [x] Incident detection across orchestration and simulation telemetry.
- [x] Structured remediation action planning.
- [x] Auto-generated recovery task requests.

### 17) Capability Drift Sentinel
Objective: detect quality regressions across memory, routing, and skills before outages.
- [x] Baseline/current drift detection across multiple subsystems.
- [x] Prioritized drift alert generation.
- [x] Mitigation task generation for closed-loop recovery.

### 18) Autonomous Mission Planner
Objective: compile high-level goals into execution-ready workflow plans.
- [x] Profile-aware plan decomposition (analysis, incident, change management).
- [x] Risk, approval, and sandbox hint propagation into plan nodes.
- [x] Conversion to schema-valid workflow and task request artifacts.

### 19) Mission Readiness Gate
Objective: preflight mission plans against real execution constraints before launch.
- [x] Capability coverage analysis across healthy agents and active skills.
- [x] Approval and sandbox policy checks per mission node.
- [x] Readiness scoring with remediation task generation.

### 20) Adaptive Execution Governor
Objective: continuously adapt dispatch policy based on mission, drift, incident, and queue pressure signals.
- [x] Multi-signal risk scoring with deterministic execution modes.
- [x] Mode-specific dispatch guardrails (throttle, blocking, approval escalation).
- [x] Action planning with schema-valid mitigation task generation.

### 21) Command Briefing Center
Objective: provide unified, human-readable operational briefs with executable follow-up actions.
- [x] Signal fusion across readiness, governor, drift, and incident contexts.
- [x] Severity/headline synthesis with ranked concerns.
- [x] Markdown + task-request outputs for human and autonomous consumers.

### 22) Mission Portfolio Manager
Objective: prioritize and schedule multiple missions under capacity constraints using impact, urgency, readiness, and risk.
- [x] Deterministic portfolio scoring with transparent breakdowns.
- [x] Lane assignment (`now`/`next`/`hold`) with capacity-aware deferral.
- [x] Portfolio launch + unblock task generation.

### 23) Mission Forecast Lab
Objective: run what-if planning scenarios over mission portfolios and recommend the best operating configuration.
- [x] Scenario override engine (readiness/risk/priority/capacity).
- [x] Comparative scoring against baseline with lane delta outputs.
- [x] Scenario adoption and follow-up task generation.

### 24) Autonomous Approval Engine
Objective: eliminate human approval bottlenecks with machine approval decisions and auditable evidence.
- [x] `bypass_all` and `policy_assisted` approval-bypass modes.
- [x] Queue-level auto-approval processing and follow-up task generation.
- [x] Deterministic autonomous approval audit payloads.

### 25) Autonomous Mission Launcher
Objective: convert prioritized mission lanes into executable launch batches with autonomous approval decisions.
- [x] Launch-batch compiler for `now` lane missions from portfolio/forecast.
- [x] Integrated approval-bypass gating per launch candidate.
- [x] Dispatch + follow-up task generation for immediate/deferred/blocked missions.

## Build Order
1. Durable Task Memory
2. Live Agent Registry
3. Human Review Gates
4. Workflow DAG Executor
5. Shared Memory Contracts
6. Simulation & Benchmark Harness
7. Policy/Safety Layer
8. Cost/Latency Optimizer
9. Unified Operator CLI
10. Shared World-State Graph
11. Learning Loop Engine
12. Capability Marketplace
13. Tool Sandbox Orchestrator
14. Human-Agent Collaboration UX
15. Federation & Trust Layer
16. Autonomous Recovery Supervisor
17. Capability Drift Sentinel
18. Autonomous Mission Planner
19. Mission Readiness Gate
20. Adaptive Execution Governor
21. Command Briefing Center
22. Mission Portfolio Manager
23. Mission Forecast Lab
24. Autonomous Approval Engine
25. Autonomous Mission Launcher
