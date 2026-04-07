---
name: joint-new-parent-convalescent-leave-lactation-and-milk-shipment-continuity-cell
description: Preserve new-parent leave, postpartum follow-up, lactation support, milk-shipment continuity, and newborn enrollment so warfighters are not sidelined by preventable administrative or care-fragmentation failures after birth. Use when new-parent friction is beginning to affect readiness, recovery, or family stability.
---

# Joint New Parent Convalescent Leave Lactation And Milk Shipment Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter new-parent continuity decisions spanning leave, postpartum care, newborn enrollment, lactation support, and breast-milk storage or shipment.
- Confirm delivery timeline, medical risk, leave authority posture, newborn enrollment status, travel or PCS pressure, and refrigeration or shipping constraints before recommending action.
- Keep outputs unclassified by default and minimize PII or protected health information unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using birth timeline, convalescent or parental leave posture, follow-up appointment risk, newborn eligibility gaps, and cold-chain constraints.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in maternal or infant safety, privacy, leave stability, and family burden.
3. Identify branch triggers for NICU admission, leave denial or curtailment, newborn documentation gaps, milk spoilage risk, PCS travel, and caregiver collapse.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and new-parent continuity risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: new-parent continuity board, leave-and-coverage action ladder, and lactation or milk-shipment assurance packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-NEWPARENT-319`, `tool_suite_id=ts-dependent-care-transition-v1`, and `protocol_stack_id=ps-new-parent-continuity-stack-v1`.
- Alternate: select a mission-adjacent family-readiness, benefits, or medical-access suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual mother-or-infant risk board with advisory-only guidance until leave authority, newborn identity, and follow-up care posture are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-NEWPARENT-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: leave-tracker queue, postpartum follow-up board, lactation room and refrigeration map, milk-shipment chain ledger, and newborn enrollment status queue.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NIEM`, signed leave or enrollment notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Use the `Personnel and Family Readiness Casework` and `Benefits and Eligibility Bridge` playbooks when leave, newborn enrollment, and medical follow-up must move together.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If medical urgency, leave authority, or newborn eligibility evidence is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Protect maternal recovery, infant safety, privacy, and equitable access before recommending action.
- Do not fabricate leave approvals, appointment availability, newborn eligibility, or cold-chain viability.
