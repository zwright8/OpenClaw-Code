---
name: expeditionary-renal-replacement-and-crush-injury-surge-cell
description: Coordinate austere renal replacement, crush-syndrome triage, and consumable allocation. Use when prolonged field care, entrapment casualties, or dialysis disruption threaten survival and evacuation timing.
---

# Expeditionary Renal Replacement And Crush Injury Surge Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter crush-injury, renal-failure, and prolonged-field-care decisions.
- Confirm casualty load, lab-confidence limits, consumable inventory, transport timelines, and clinical authority before recommending action.
- Keep outputs unclassified by default and protect patient privacy unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem using casualty counts, crush-duration estimates, renal-failure indicators, transport constraints, and available dialysis or blood support.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in survivability, consumable burn, staff burden, and evacuation timing.
3. Identify branch triggers for dialysis rationing, potassium-control escalation, device failure, and transfer to higher-echelon care.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and senior-clinician decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: renal replacement triage ladder, crush-injury consumables burn-down board, and casualty transfer prioritization matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-expeditionary-renal-replacement-crush-surge-v1` with `protocol_stack_id=ps-expeditionary-renal-replacement-crush-surge-stack-v1`.
- Alternate: select a mission-adjacent force-health, transfusion, or sustainment suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: lifesaving triage and manual electrolyte-control board only with command-approved transfer prioritization.

## Domain Packet Defaults

- Default packet ID: `DPL-RENAL-CRUSH-SURGE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: critical-care flowsheet, chemistry and urine-output board, dialysis-device status ledger, and med-log consumables tracker.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, signed device manifests, `API/JSON`, `USMTF`, and `NIEM` where patient movement intersects civil facilities.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If laboratory confidence, transfer authority, or renal-device readiness is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag crush-duration uncertainty, hyperkalemia risk, device downtime, and transport shortfalls before recommending action.
- Do not fabricate laboratory values, medical approvals, or casualty disposition decisions.
