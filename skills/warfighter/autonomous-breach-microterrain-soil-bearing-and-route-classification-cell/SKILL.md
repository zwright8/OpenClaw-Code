---
name: autonomous-breach-microterrain-soil-bearing-and-route-classification-cell
description: Classify breach routes by microterrain, soil-bearing capacity, and machine mobility constraints. Use when autonomous engineer systems or heavy vehicles need trustworthy route release under contested conditions.
---

# Autonomous Breach Microterrain Soil Bearing And Route Classification Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm vehicle classes, breach authorities, geotechnical constraints, and commander decision timelines before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the obstacle belt, microterrain profile, soil-bearing uncertainty, and autonomous breach-system limits.
2. Build one recommended route-release branch plus alternatives to reinforce, bypass, delay, or manually scout routes.
3. Bind each recommendation to terrain-sensing, soil-classification, and route-risk tools with explicit protocolized outputs.
4. Publish degraded-mode branches when soil confidence, route telemetry, or heavy-vehicle release authority falls below threshold.

## Required Output Format

1. Situation snapshot.
2. Recommended route-classification branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now, next, and pre-delegated.
5. Staff tasking by owner and suspense.
6. Breach-route packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: soil-bearing classification board, breach-route release matrix, engineer support priority ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-autonomous-breach-soil-bearing-route-classification-v1` with `protocol_stack_id=ps-autonomous-breach-soil-bearing-route-classification-stack-v1`.
- Alternate: engineer obstacle board plus manual ground-truth worksheet.
- Degraded: limited-weight route release only with human reconnaissance and commander-approved safety margins.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-BREACH-SOIL-BEARING-001` for critical recommendations.
- Prioritize these protocol families for this domain: `OGC`, `CoT`, `VMF`, `API/JSON`, and `USMTF`.
- Include source system, refresh UTC, confidence, load-class assumptions, and unresolved soil or telemetry gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run assurance checks from `../_shared/references/us-joint-protocol-assurance-drill.md` and `../_shared/references/mission-assurance-checklist.md`.
- If soil classification, route confirmation, or heavy-vehicle release authority is uncertain, downgrade to advisory-only and require human command review.

## Guardrails

- Do not fabricate soil-bearing strength, route clearance, or autonomy reliability.
- Separate sensed terrain anomalies from confirmed route denial.
- Flag civilian infrastructure, unexploded ordnance, and floodplain risks early.
