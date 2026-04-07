---
name: homeland-postpartum-lactation-infant-formula-and-diaper-continuity-cell
description: Protect postpartum, lactation, infant-formula, and diaper support continuity during domestic disruptions affecting military communities. Use when warfighter readiness and family stability depend on maternal and infant care not collapsing during response operations.
---

# Homeland Postpartum Lactation Infant Formula And Diaper Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter maternal-health, infant-support, and caregiver-continuity decisions during domestic emergencies.
- Confirm postpartum and infant population at risk, medical constraints, lactation-support availability, formula or diaper inventory, and transport or shelter status before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using maternal-health status, infant feeding requirements, lactation support needs, caregiver availability, and disruption to clinics, pharmacies, or shelters.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in medical risk, privacy, logistics burden, and readiness impact.
3. Identify branch triggers for NICU or postpartum transfer, lactation-equipment failure, formula substitution, and caregiver or shelter escalation.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: postpartum support matrix, lactation-and-formula continuity ladder, and maternal-infant escalation packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-POSTPARTUM-284`, `tool_suite_id=ts-homeland-postpartum-lactation-infant-formula-diaper-continuity-v1`, and `protocol_stack_id=ps-homeland-postpartum-lactation-infant-formula-diaper-continuity-stack-v1`.
- Alternate: select a mission-adjacent medical-regulation, AFN mass-care, or pharmacy suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual maternal-infant roster with life-safety prioritization only until clinical review, supply status, and caregiver support are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-POSTPARTUM-LACTATION-FORMULA-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: maternal-care status board, lactation DME support tracker, infant-formula inventory ledger, and caregiver continuity queue.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NIEM`, `CAP`, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If maternal-clinical authority, infant-supply safety, or caregiver continuity is uncertain, downgrade to advisory-only and request medical review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported medical claims, privacy exposure, unsafe formula substitution, and caregiver shortfalls before recommending action.
- Do not fabricate diagnoses, prescription authority, inventory levels, caregiver coverage, or approvals.
