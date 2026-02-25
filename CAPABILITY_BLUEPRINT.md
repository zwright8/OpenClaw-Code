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

### 26) Truth-Seeking Hypothesis Engine
Objective: maintain explicit hypotheses, update confidence from evidence, and drive experiments that reduce uncertainty.
- [x] Multi-source evidence normalization (readiness, drift, incidents, governor, explicit signals).
- [x] Deterministic posterior confidence scoring with support/contradiction traces.
- [x] Experiment/evidence recommendation tasks for uncertain and unlikely hypotheses.

### 27) Curiosity Agenda Planner
Objective: prioritize hypothesis investigations into execution lanes under experiment-capacity constraints.
- [x] Curiosity scoring from uncertainty, contradiction pressure, criticality, and mission coupling.
- [x] `now`/`next`/`backlog` lane assignment with capacity-aware deferral.
- [x] Curiosity agenda + recommendation task generation.

### 28) Humanity Impact Guardrail
Objective: enforce pro-humanity execution standards by scoring likely human benefit vs harm before action.
- [x] Multi-source task/mission/launch impact assessment.
- [x] Deterministic `aligned`/`review_required`/`blocked` posture decisions.
- [x] Mitigation/safeguard task generation for non-aligned items.

### 29) Constitution Alignment Engine
Objective: continuously score operations against the core constitution: truth-seeking, pro-humanity, and curiosity.
- [x] Principle-scoring model with configurable weights.
- [x] Compliance-tier decisions (`aligned`, `caution`, `non_compliant`) and blocking reasons.
- [x] Constitution remediation task generation.

### 30) Constitutional Execution Controller
Objective: enforce constitution-aware launch gating by turning alignment outcomes into dispatch/throttle/pause behavior.
- [x] Launch-batch gating with `active`/`caution`/`paused` modes.
- [x] Constitution + humanity recommendation merge for mitigation planning.
- [x] Dispatch and mitigation task conversion from constitutional execution plans.

### 31) Societal Outcome Simulator
Objective: forecast multi-horizon societal impact of intervention choices before execution.
- [x] Baseline + intervention normalization into weighted societal score projections.
- [x] Trajectory classification (`improving`, `stable`, `declining`) with risk alerts.
- [x] Intervention adoption/review task generation from simulation results.

### 32) Intervention Portfolio Optimizer
Objective: choose intervention bundles under budget and risk limits to maximize projected societal benefit.
- [x] Candidate bundle enumeration with deterministic ranking objective.
- [x] Feasibility gating across budget, risk, intervention-count, and humanity floor constraints.
- [x] Portfolio recommendation task generation for adopt/review/rebalance workflows.

### 33) Long-Horizon Externality Forecaster
Objective: project second-order societal effects over multi-year horizons before committing interventions.
- [x] Multi-year projection model combining direct intervention effects and second-order externality factors.
- [x] Feedback-loop modeling for reinforcing and balancing long-term dynamics.
- [x] Long-horizon mitigation/reinforcement recommendation task generation.

### 34) Equity Impact Analyzer
Objective: quantify distribution of benefit, harm, and access across communities before rollout decisions.
- [x] Group-level impact projection across benefit, harm, and access dimensions.
- [x] Equity posture scoring with disparity, vulnerability-harm, and fairness-index thresholds.
- [x] Equity mitigation/proceed recommendation tasks for vulnerable-group safeguards and rollout adjustments.

### 35) Community Feedback Harvester
Objective: ingest and structure real-world community feedback into actionable planning signals.
- [x] Multi-channel feedback normalization with sentiment, urgency, harm-risk, and theme tagging.
- [x] Deterministic duplicate collapsing with theme-level aggregation across regions.
- [x] Recommendation task generation for high-risk mitigation, investigation, and transparent community response.

### 36) Public Benefit Opportunity Miner
Objective: discover and prioritize the highest-leverage opportunities for measurable social good.
- [x] Opportunity scoring model across benefit, equity, urgency, feasibility, evidence, and population scale.
- [x] Capacity/budget-aware lane scheduling for `now`/`next`/`backlog` execution.
- [x] Launch/validate/unblock task generation from ranked opportunity pipeline.

### 37) Harm Escalation Early-Warning
Objective: detect trajectories likely to escalate into broad social harm and trigger rapid mitigation.
- [x] Multi-signal risk model across incidents, community alerts, equity posture, and long-horizon trajectories.
- [x] Deterministic escalation-level classification (`normal`/`watch`/`warning`/`severe`/`critical`) with response windows.
- [x] Containment/review/monitoring task generation for proactive harm mitigation workflows.

### 38) Misuse Behavior Detector
Objective: detect emerging misuse and abuse signatures early and convert them into enforceable actions.
- [x] Abuse-signature detection across event streams (`jailbreak`, `scam`, `exfiltration`, `harassment`, `fraud`).
- [x] Actor-level misuse risk scoring and global threat-level classification.
- [x] Restriction/investigation/rule-hardening task generation from detected misuse patterns.

### 39) Adversarial Robustness Fuzzer
Objective: continuously stress-test agent surfaces against adversarial manipulation and quantify exposure risk.
- [x] Multi-attack fuzz-case generation (`prompt_injection`, `policy_evasion`, `data_exfiltration`, `tool_misuse`, `social_engineering`).
- [x] Deterministic exploitability scoring with per-target robustness summaries and threat levels.
- [x] Guardrail patching, capability-disable, retest, and monitoring task generation from findings.

### 40) Explainability Narrative Generator
Objective: translate complex decision telemetry into understandable human-facing narratives.
- [x] Ranked reason synthesis from constitutional, safety, readiness, and misuse signals.
- [x] Uncertainty analysis with counterfactual checks and readability scoring.
- [x] Publish/evidence-request/simplification task generation for explainability operations.

### 41) Evidence Provenance Graph
Objective: track lineage and trustworthiness of claims by explicitly connecting evidence support and contradiction paths.
- [x] Claim/evidence graph construction with support, contradiction, and derivation edges.
- [x] Deterministic claim trust scoring and trust-tier classification from confidence + source reliability.
- [x] Verification/contradiction-resolution/source-coverage task generation from provenance outcomes.

### 42) Counterfactual Policy Lab
Objective: test policy alternatives against simulated outcomes before committing governance changes.
- [x] Baseline/variant policy simulation across safety, throughput, equity, trust, cost, and risk outcomes.
- [x] Variant ranking with baseline deltas and uncertainty-aware tradeoff analysis.
- [x] Adopt/pilot/investigate recommendation task generation for policy decision workflows.

### 43) Policy Diff Simulator
Objective: quantify impact deltas between policy variants and expose the largest governance tradeoffs.
- [x] Pairwise variant diff matrix across overall score, risk, safety, throughput, equity, trust, and parameter distance.
- [x] Dominance ranking to identify top policy candidates under multi-objective scoring.
- [x] Alignment/gap-investigation/convergence task generation from diff analysis.

### 44) Value Conflict Resolver
Objective: explicitly resolve conflicts between competing ethical objectives with auditable tradeoff decisions.
- [x] Objective conflict matrix across score gaps, thresholds, and volatility pressure.
- [x] Action evaluation against weighted multi-objective utility plus threshold-violation penalties.
- [x] Balanced-action/mediation/signal-gathering task generation for governance resolution workflows.

### 45) Multi-Stakeholder Preference Modeler
Objective: model diverse stakeholder priorities and expose consensus vs divergence before key decisions.
- [x] Stakeholder utility modeling across configurable preference axes and influence weights.
- [x] Option consensus scoring with divergence matrix across stakeholder groups.
- [x] Consensus adoption, divergence mediation, and missing-preference task generation.

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
26. Truth-Seeking Hypothesis Engine
27. Curiosity Agenda Planner
28. Humanity Impact Guardrail
29. Constitution Alignment Engine
30. Constitutional Execution Controller
31. Societal Outcome Simulator
32. Intervention Portfolio Optimizer
33. Long-Horizon Externality Forecaster
34. Equity Impact Analyzer
35. Community Feedback Harvester
36. Public Benefit Opportunity Miner
37. Harm Escalation Early-Warning
38. Misuse Behavior Detector
39. Adversarial Robustness Fuzzer
40. Explainability Narrative Generator
41. Evidence Provenance Graph
42. Counterfactual Policy Lab
43. Policy Diff Simulator
44. Value Conflict Resolver
45. Multi-Stakeholder Preference Modeler
