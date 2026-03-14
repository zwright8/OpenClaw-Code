---
name: strategic-space-ground-station-traveling-wave-tube-and-cryogenic-receiver-surge-cell
description: Protect space-ground-station availability when traveling-wave tubes, cryogenic receivers, or RF chain components become scarce. Use when SDA, SATCOM, or missile-warning support depends on constrained ground nodes.
---

# Strategic Space Ground Station Traveling Wave Tube And Cryogenic Receiver Surge Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm supported missions, antenna and RF-chain dependencies, spare inventories, and restoration authority before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the ground-station demand, failed or aging RF components, mission priorities, and commander constraints.
2. Build allocate, swap, defer-maintenance, reroute, and surge-repair branches with explicit mission-coverage tradeoffs.
3. Bind each recommendation to SATCOM, SDA, and industrial-support tools plus protocolized outputs.
4. Publish degraded-mode branches when trusted spares, cryogenic performance, or ground-station reroute capacity falls below threshold.

## Required Output Format

1. Situation snapshot.
2. Recommended ground-station surge branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Space-ground-station packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: RF-chain allocation board, ground-station coverage matrix, and spare-pedigree risk ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-space-ground-station-twt-cryogenic-surge-v1` with `protocol_stack_id=ps-space-ground-station-twt-cryogenic-surge-stack-v1`.
- Alternate: SATCOM ground-node board plus industrial RF-component witness.
- Degraded: mission-essential nodes only with constrained uplink windows and manual retask control.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-SPACE-GROUND-STATION-TWT-001` for critical recommendations.
- Prioritize these protocol families for this domain: `CCSDS`, signed maintenance manifests, `API/JSON`, and `USMTF`.
- Include source system, refresh UTC, confidence, component pedigree, and unresolved mission-coverage gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run assurance checks from `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/readiness-certification-evidence-pack.md`.
- If component pedigree, reroute authority, or coverage validation is uncertain, downgrade to advisory-only and require human command review.

## Guardrails

- Do not fabricate spare availability, cryogenic performance, or mission reroute approval.
- Separate confirmed hardware failures from projected degradation timelines.
- Flag missile warning, NC3-supporting, and protected SATCOM mission threads early.
