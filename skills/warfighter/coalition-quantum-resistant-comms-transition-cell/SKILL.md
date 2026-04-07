---
name: coalition-quantum-resistant-comms-transition-cell
description: Coordinate coalition transition to quantum-resistant communications with mission continuity safeguards. Use when planning phased crypto modernization, interoperability risk controls, and fallback comms governance.
---

# Coalition Quantum-Resistant Comms Transition Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Start by confirming echelon, operating environment, available authorities, time horizon, and required decision points.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem using these core inputs: battlespace status, force posture, partner and civil constraints, and mission objectives.
2. Identify assumptions, decision thresholds, and what intelligence or reporting would invalidate the current plan.
3. Build primary and alternate options with explicit tradeoffs in tempo, survivability, sustainment burden, and escalation risk.
4. Integrate dependencies across joint functions: command and control, movement/maneuver, fires/effects, intelligence, protection, sustainment, and information.
5. Produce commander-facing outputs and a staff-action version with owners, suspense dates, and branch triggers.

## Required Output Format

Deliver results in this order:

1. Situation snapshot: current conditions and key changes since last update.
2. Recommended option: one clearly stated recommendation and rationale.
3. Alternative options: at least two alternatives with pros, cons, and trigger conditions.
4. Decision points: what must be decided now, later, or pre-delegated.
5. Staff tasking: who does what by when.

## Domain Products

Primary products for this skill: PQC transition readiness board, coalition key-rollover synchronization packet, and interoperability risk branches.

## External Tools and Protocol Integration

- Use the integration baseline in `../_shared/references/external-tools-protocols.md` and name the exact tools selected for this mission set.
- Select at least one primary system-of-record and one cross-check source before final recommendations.
- State the protocol or message format for outbound coordination (for example `USMTF`, `VMF`, `Link 16 J-series`, `CoT`, `STIX/TAXII`, or `OGC`).
- Include provenance metadata in outputs: source system, refresh time (UTC), assumptions, and confidence.
- Use adapter guidance in `../_shared/references/external-tool-endpoints-and-adapters.md` for endpoint schemas, transport, and fallback behavior.

## Interoperability and Assurance Checks

- Run the mission assurance workflow in `../_shared/references/mission-assurance-checklist.md` before final release.
- Apply authority and release controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include a degraded-mode branch when any critical dependency misses refresh SLA or acknowledgement gates.

## Domain Toolchain Binding

- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and `../_shared/references/domain-tool-packet-library.md` to bind recommendations to concrete tools and packet templates.
- Include `tool_suite_id`, `protocol_stack_id`, `packet_id`, `primary_system`, `cross_check_system`, `refresh_sla_minutes`, and `degraded_fallback` for each critical recommendation.
- If no matching profile exists, define a provisional profile and assign a validation owner with suspense.

## Guardrails

- Flag gaps where assumptions exceed evidence.
- Separate facts, assessed judgments, and unknowns.
- Do not fabricate authorities, approvals, or source reporting.
- Keep recommendations advisory-only until required human command approvals are recorded.

## Domain Toolchain Override (2026-03-12, Warfighter Expansion Wave XXIV)

- Add `tool_suite_id=ts-coalition-quantum-resistant-comms-transition-v1` + `protocol_stack_id=ps-coalition-quantum-resistant-comms-transition-stack-v1` for this mission domain as default external integration profile.
- Add `packet_id=DPL-COALITION-QUANTUM-RESISTANT-COMMS-TRANSITION-001` for mission branches that can alter force posture, mission risk, or escalation dynamics.
- If data freshness, authority, or protocol acknowledgment is incomplete, downgrade to advisory-only and issue explicit command decision prompts.
