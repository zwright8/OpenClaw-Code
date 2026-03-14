---
name: expeditionary-austere-pediatric-casualty-surge-balancing-cell
description: Balance pediatric casualty loads across austere expeditionary care networks. Use when commanders and medical planners must protect children and noncombatants without collapsing military trauma capacity.
---

# Expeditionary Austere Pediatric Casualty Surge Balancing Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm care capabilities, pediatric specialty limits, movement constraints, host-nation coordination, and decision timelines before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame casualty demand, pediatric capability gaps, evacuation options, and commander priorities.
2. Build primary and alternate balancing branches with explicit tradeoffs in transport time, survivability, bed use, and force-readiness impact.
3. Bind each recommendation to patient-regulation, bed-status, blood, and evacuation tools plus packetized outputs.
4. Publish degraded-mode branches when pediatric specialists, blood products, or transport lanes fall below threshold.

## Required Output Format

1. Situation snapshot.
2. Recommended balancing branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Pediatric surge packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: pediatric surge balancing board, specialty-capability gap ledger, and evacuation prioritization ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-expeditionary-pediatric-casualty-surge-v1` with `protocol_stack_id=ps-expeditionary-pediatric-casualty-surge-stack-v1`.
- Alternate: coalition pediatric specialty matching board plus manual transport triage queue.
- Degraded: life-saving-only redistribution with conservative transfer thresholds and recurring UTC reassessment.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-PEDS-CASUALTY-SURGE-001` for critical recommendations.
- Prioritize these protocol families for this domain: `HL7/FHIR`, `USMTF`, `API/JSON`, and `NATO APP-11/ADatP-3` where coalition routing applies.
- Include source system, refresh UTC, confidence, treatment-limitation notes, and unresolved care gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run medical-movement and releasability checks from `../_shared/references/mission-assurance-checklist.md`.
- If clinical authority, movement clearance, or receiving-facility status is uncertain, downgrade to advisory-only and assign remediation owners.

## Guardrails

- Do not fabricate bed availability, pediatric specialty capacity, or evacuation clearance.
- Distinguish confirmed capacity from estimated surge tolerance.
- Surface civilian-protection, ethics, and host-nation constraints early.
