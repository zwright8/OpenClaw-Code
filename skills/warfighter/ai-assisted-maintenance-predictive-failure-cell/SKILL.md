---
name: ai-assisted-maintenance-predictive-failure-cell
description: Predict platform or component failures and schedule maintenance actions that preserve readiness under constrained parts, labor, and contested operations.
---

# AI-Assisted Maintenance Predictive Failure Cell

## Mission Scope

- Treat this skill as planning and decision-support for U.S. and coalition warfighter maintenance and readiness operations.
- Confirm echelon, platform mix, authority, data quality, timeline, and maintenance-release constraints before generating recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance.

## Workflow

1. Frame the mission problem with telemetry quality, demand signal, maintenance backlog, spare-part posture, and commander priorities.
2. Build a recommended maintenance branch and at least two alternates with explicit tradeoffs in readiness, risk, throughput, and deferred-maintenance debt.
3. Bind each branch to a concrete tool suite, protocol stack, packet, and fallback path with confidence and freshness metadata.
4. Map every tool output to maintenance-release decisions, work-order reprioritization, and named authority gates.
5. Publish commander-facing recommendations and a staff execution matrix with owners, suspense, and revalidation triggers.

## Required Output Format

1. Situation snapshot.
2. Recommended maintenance branch.
3. Alternative branches and trigger conditions.
4. Decision points and approvals.
5. Staff tasking with suspense.
6. Tool and protocol execution matrix.

## Domain Products

Primary products for this skill: predictive maintenance watchlist, readiness-impact work-order queue, parts-demand forecast.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-shipboard-ai-maintenance-prognostics-v1` with `protocol_stack_id=ps-aviation-maintenance-forensics-stack-v1`.
- Alternate: `tool_suite_id=ts-disconnected-maintenance-knowledge-fabric-v1` with `protocol_stack_id=ps-disconnected-maintenance-knowledge-fabric-stack-v1`.
- Degraded: threshold-based manual maintenance sequencing with engineering watch logs, UTC acknowledgment chain, and mission-critical platforms only.

## External Tool Stack and Protocols

- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and `../_shared/references/domain-tool-packet-library.md`.
- Treat `ts-shipboard-ai-maintenance-prognostics-v1` as the baseline prognostics pattern; substitute the service-specific maintenance system-of-record while preserving the same telemetry, cross-check, and approval flow when the platform is not maritime.
- Preferred tools: health telemetry fusion services, AI prognostics models, CMMS or maintenance planners, parts-demand trackers, disconnected maintenance knowledge brokers.
- Preferred protocol families: `API/JSON`, `USMTF`, `Link 16 J-series`, signed maintenance manifests, store-and-forward maintenance summaries.
- Include `tool_suite_id`, `protocol_stack_id`, `packet_id`, `model_confidence`, `cross_check_status`, `maintenance_authority`, and `fallback_path` for every critical recommendation.

## Domain Packet Defaults

- Default packet IDs: `DPL-SHIPBOARD-AI-PROGNOSTICS-001`, `DPL-MAINTENANCE-KNOWLEDGE-SYNC-001`.
- If the mission needs a service-unique packet shape, define a provisional packet using the shared schema and assign `validation_owner` and `revalidation_utc`.

## Tool Invocation Contract

- For each critical dependency include: objective, required inputs, query or action template, expected output schema, transport protocol, timeout, retry, and fallback path.
- Map every tool output to a maintenance-release decision, work-order change, and named maintenance authority.
- If model confidence, source freshness, or approval integrity is incomplete, mark the recommendation `provisional` and default to manual sequencing.

## Authority and Assurance Gates

- Apply approval and escalation requirements from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run `../_shared/references/mission-assurance-checklist.md` before publishing recommendations that materially alter readiness, sortie generation, or deferred-maintenance risk.
- Separate observed facts, assessed judgments, assumptions, and unknowns.
- Require explicit human maintenance authority approval for changes that affect airworthiness, seaworthiness, or mission-critical component release.
