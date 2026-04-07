---
name: strategic-military-child-youth-behavioral-health-and-school-reintegration-cell
description: Protect warfighter readiness by stabilizing military-child behavioral health, school reintegration, and caregiver support after evacuation, PCS disruption, or prolonged crisis. Use when household stress is starting to degrade retention, attendance, or family readiness.
---

# Strategic Military Child Youth Behavioral Health And School Reintegration Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter family readiness where child or youth behavioral health and school reintegration affect force availability and retention.
- Confirm affected population, school-disruption pattern, clinical-support posture, caregiver constraints, and senior-leader decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using school-status disruption, youth stress indicators, caregiver burden, clinical-capacity gaps, and relocation or PCS timelines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in family stability, privacy, clinical risk, and readiness impact.
3. Identify branch triggers for crisis referral, special-education disruption, telehealth fallback, and school-placement instability.
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

Primary products: child and youth risk matrix, school-reintegration ladder, and caregiver-support escalation packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-YOUTHBH-292`, `tool_suite_id=ts-strategic-military-child-youth-behavioral-health-school-reintegration-v1`, and `protocol_stack_id=ps-strategic-military-child-youth-behavioral-health-school-reintegration-stack-v1`.
- Alternate: select a mission-adjacent family-readiness, behavioral-health, or school-transport suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual family-support board with advisory-only reintegration planning until clinical posture, school placement, and guardian consent are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-CHILD-YOUTH-BEHAVIORAL-SCHOOL-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: youth behavioral-health tracker, school-placement board, caregiver-support ledger, and telehealth or crisis-referral queue.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NIEM`, signed school-status notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If guardian consent, clinical authority, or school-placement legitimacy is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Protect privacy, trauma-sensitive handling, educational accommodations, and caregiver consent before recommending action.
- Do not fabricate diagnoses, school placements, counseling availability, or command approval.
