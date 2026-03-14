---
name: homeland-military-civil-autonomous-evacuation-convoy-arbitration-cell
description: Arbitrate mixed military and civil autonomous evacuation convoy movement when roads, custody checks, and life-safety priorities collide. Use when homeland disaster or attack conditions force machine-assisted convoy prioritization.
---

# Homeland Military Civil Autonomous Evacuation Convoy Arbitration Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm evacuation authorities, route ownership, convoy autonomy limits, and civil life-safety priorities before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the evacuation problem with convoy demand, route capacity, autonomy trust posture, and public-safety constraints.
2. Build one recommended arbitration branch plus alternatives for stagger, escort, divert, or manual-control fallback.
3. Bind each recommendation to convoy routing, public-safety traffic, and identity-screening tools with explicit protocolized outputs.
4. Publish degraded-mode branches when autonomy confidence, road status, or custody verification falls below threshold.

## Required Output Format

1. Situation snapshot.
2. Recommended convoy arbitration branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now, next, and pre-delegated.
5. Staff tasking by owner and suspense.
6. Evacuation convoy packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: convoy release ladder, life-safety route-priority matrix, autonomy fallback control board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-autonomous-evacuation-convoy-arbitration-v1` with `protocol_stack_id=ps-homeland-autonomous-evacuation-convoy-arbitration-stack-v1`.
- Alternate: civil emergency-operations traffic board plus military convoy movement tracker.
- Degraded: human-driven convoys only with checkpoint releases and voice-confirmed priority lanes.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-AUTON-EVAC-CONVOY-001` for critical recommendations.
- Prioritize these protocol families for this domain: `NIMS/ICS`, `CoT`, `NIEM`, `API/JSON`, and `USMTF`.
- Include source system, refresh UTC, confidence, custody bottlenecks, and unresolved life-safety tradeoffs in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run assurance checks from `../_shared/references/us-joint-protocol-assurance-drill.md` and `../_shared/references/mission-assurance-checklist.md`.
- If route authority, convoy identity integrity, or autonomy override control is uncertain, downgrade to advisory-only and require human command review.

## Guardrails

- Do not fabricate road-clearance status, family-link verification, or convoy autonomy performance.
- Separate confirmed road availability from modeled travel-time estimates.
- Flag disability-access, pediatric, hazardous-cargo, and civil-rights constraints early.
