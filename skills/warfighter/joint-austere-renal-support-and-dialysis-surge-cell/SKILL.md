---
name: joint-austere-renal-support-and-dialysis-surge-cell
description: Plan austere renal replacement, dialysis triage, and consumable continuity under contested medical conditions. Use when crush injury, sepsis, burns, or chronic renal demand exceeds fixed-facility capacity.
---

# Joint Austere Renal Support And Dialysis Surge Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm casualty load, dialysis modality constraints, water purity requirements, and movement authorities before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame renal demand, available equipment, water and consumable constraints, and evacuation timing.
2. Build one recommended renal-support branch plus alternatives to surge, ration, divert, or defer treatment.
3. Bind each recommendation to patient movement, lab, and consumable-tracking tools with explicit protocolized outputs.
4. Publish degraded-mode branches when dialysis capacity, water quality, or transport confidence falls below threshold.

## Required Output Format

1. Situation snapshot.
2. Recommended renal-support branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now, next, and pre-delegated.
5. Staff tasking by owner and suspense.
6. Renal-support packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: dialysis triage matrix, renal consumables burn-rate board, patient-diversion ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-austere-renal-support-dialysis-surge-v1` with `protocol_stack_id=ps-joint-austere-renal-support-dialysis-surge-stack-v1`.
- Alternate: Role 3 nephrology board plus manual dialysis-consumable ledger.
- Degraded: life-saving renal support only with commander-approved triage thresholds and manual documentation.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-AUSTERE-RENAL-DIALYSIS-001` for critical recommendations.
- Prioritize these protocol families for this domain: `HL7/FHIR`, `USMTF`, `API/JSON`, and NATO APP-11/ADatP-3 aligned exchange.
- Include source system, refresh UTC, confidence, water-purity status, and unresolved renal-consumable gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run assurance checks from `../_shared/references/us-joint-protocol-assurance-drill.md` and `../_shared/references/mission-assurance-checklist.md`.
- If patient identity, dialysis capacity, or water-purity evidence is uncertain, downgrade to advisory-only and require human clinical command review.

## Guardrails

- Do not fabricate lab values, dialysis capacity, or water-treatment status.
- Separate acute casualty-driven renal demand from chronic sustainment demand.
- Flag pediatric, burn, and infection-control constraints early.
