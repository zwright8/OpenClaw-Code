---
name: contested-megacity-autonomous-evacuation-corridor-governance-cell
description: Coordinate autonomous and crewed evacuation corridors in contested megacities. Use when military and civil actors must preserve life-safety movement under kinetic, cyber, or CBRN pressure.
---

# Contested Megacity Autonomous Evacuation Corridor Governance Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Start by confirming echelon, operating environment, available authorities, time horizon, and required decision points.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem using operational context, threat indicators, and supportability constraints.
2. Identify assumptions, invalidation criteria, and authority boundaries before generating options.
3. Build primary and alternate options with tradeoffs in mission effect, survivability, sustainment burden, interoperability, and escalation risk.
4. Bind each option to concrete external tools and protocol exchanges with degraded-mode fallbacks.
5. Produce commander-facing recommendations plus staff tasking and validation gates.

## Required Output Format

Deliver results in this order:

1. Situation snapshot.
2. Recommended option and rationale.
3. Alternative options with triggers.
4. Decision points and approval gates.
5. Staff tasking and suspense.

## Domain Products

Primary products for this skill: evacuation corridor control plan, autonomy liability matrix, shelter throughput synchronization board.

## External Tools and Protocol Integration

- Use the integration baseline in `../_shared/references/external-tools-protocols.md` and select a mission-fit `toolchain_profile_id` from `../_shared/references/joint-operations-external-toolchain-profiles.md`.
- Prioritize these tool families for this domain: city traffic digital twin systems, emergency management EOC platforms, autonomous vehicle fleet orchestrators, ISR route-risk feeds.
- Prioritize these protocol families for this domain: NIMS/ICS, EDXL-DE/CAP, OGC WFS.
- Map each recommendation to `tool_suite_id`, `protocol_stack_id`, and `packet_id` from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and `../_shared/references/domain-tool-packet-library.md`.
- Include provenance for every tool-driven claim: source system, UTC refresh time, confidence, and known gaps.

## Validation and Assurance

- Run `../_shared/references/mission-assurance-checklist.md` before release.
- Apply authority gating from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- If tool health, legal basis, or data freshness is insufficient, downgrade output to `advisory_only: true` and publish a degraded branch.

## Guardrails

- Separate facts, assessed judgments, and unknowns.
- Flag legal, ROE, policy, and coalition releaseability constraints early.
- Do not fabricate authorities, classified sources, or external system outputs.
- Provide decision support only; do not provide executable targeting, firing, or weapons-employment instructions.
- Require explicit human command approval before recommendations that can alter force posture, engagement authority, or escalation risk.
