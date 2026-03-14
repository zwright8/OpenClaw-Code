---
name: homeland-base-potable-water-restart-biofilm-legionella-control-cell
description: Restart base potable-water systems while controlling biofilm, Legionella, and mission-critical water quality risk. Use when installations recover from outages, contamination, or prolonged stagnation.
---

# Homeland Base Potable Water Restart Biofilm Legionella Control Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm affected facilities, outage duration, hospital and dormitory exposure, sampling authority, and mission timelines before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the water-system restart condition, affected populations, contamination indicators, and life-safety priorities.
2. Build flush, isolate, disinfect, sample, and mission-support workaround branches with explicit health and facility tradeoffs.
3. Bind each recommendation to water-quality, facility-control, and public-health tools plus protocolized outputs.
4. Publish degraded-mode branches when sampling confidence, treatment capacity, or facility isolation cannot keep pace with risk.

## Required Output Format

1. Situation snapshot.
2. Recommended water-restart branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Water-restart control packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: facility restart matrix, water-quality risk board, and sampling-and-release ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-base-water-restart-biofilm-control-v1` with `protocol_stack_id=ps-homeland-base-water-restart-biofilm-control-stack-v1`.
- Alternate: preventive-medicine board plus civil utility sampling witness.
- Degraded: restricted-potable-use posture with mission-essential facility release only.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-WATER-RESTART-BIOFILM-001` for critical recommendations.
- Prioritize these protocol families for this domain: `HL7/FHIR`, `NIMS/ICS`, `API/JSON`, and `USMTF`.
- Include source system, refresh UTC, confidence, sampling status, and unresolved health-protection gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run mission-assurance and public-health checks from `../_shared/references/mission-assurance-checklist.md`.
- If water-quality evidence, facility release authority, or medical-surveillance status is uncertain, downgrade to advisory-only and require human command review.

## Guardrails

- Do not fabricate sampling results, disinfection completion, or safe-to-drink releases.
- Separate confirmed contamination from conservative protective assumptions.
- Flag medical-treatment facilities, child-development centers, and barracks with immunocompromised occupants early.
