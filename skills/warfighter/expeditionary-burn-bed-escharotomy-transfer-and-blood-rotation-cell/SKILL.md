---
name: expeditionary-burn-bed-escharotomy-transfer-and-blood-rotation-cell
description: Balance austere burn-care transfers, escharotomy capacity, and blood rotation under contested movement. Use when survival depends on matching burn severity to scarce surgical and transfusion resources.
---

# Expeditionary Burn Bed Escharotomy Transfer And Blood Rotation Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm burn severity mix, bed availability, escharotomy capability, blood inventory, and movement constraints before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the burn-care network with patient acuity, receiving-facility capacity, transfusion stress, and transport constraints.
2. Build transfer, hold, stage, rotate-blood, and redirect branches with explicit survival and transport tradeoffs.
3. Bind each recommendation to concrete patient-regulation, blood-management, and routing tools plus packetized outputs.
4. Publish degraded-mode branches when burn-bed status, surgical capability, or blood availability falls below threshold.

## Required Output Format

1. Situation snapshot.
2. Recommended burn-transfer branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Burn-transfer packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: burn transfer matrix, escharotomy-capacity ledger, and blood-rotation priority board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-expeditionary-burn-bed-transfer-blood-rotation-v1` with `protocol_stack_id=ps-expeditionary-burn-bed-transfer-blood-rotation-stack-v1`.
- Alternate: manual burn board plus blood-rotation worksheet.
- Degraded: life-saving burn transfers only with conservative transfusion thresholds.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-BURN-BED-ESCHAROTOMY-TRANSFER-001` for critical recommendations.
- Prioritize these protocol families for this domain: `HL7/FHIR`, `USMTF`, NATO APP-11/ADatP-3 aligned exchange, and `API/JSON`.
- Include source system, refresh UTC, confidence, blood constraints, and unresolved receiving-facility gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run clinical-safety and movement-assurance checks from `../_shared/references/mission-assurance-checklist.md`.
- If clinical authority, bed status, or blood-availability evidence is uncertain, downgrade to advisory-only and assign remediation owners.

## Guardrails

- Do not fabricate burn-bed capacity, surgical capability, blood inventory, or movement clearance.
- Separate observed care limits from inferred cause.
- Surface life-safety, ethics, and host-nation constraints early.
