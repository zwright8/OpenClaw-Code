---
name: joint-special-education-iep-504-and-early-intervention-continuity-cell
description: Preserve IEP, 504, and early-intervention continuity for military children when relocation, outage, mobilization, or disaster disruption threatens dependent stability and warfighter availability. Use when education-support failure begins to degrade household resilience or force focus.
---

# Joint Special Education IEP 504 And Early Intervention Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter dependent special-education and early-intervention continuity decisions.
- Confirm affected children, legal education plan status, school or provider disruption, caregiver posture, and privacy constraints before recommending action.
- Keep outputs unclassified by default and minimize PII or protected education and health information unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using IEP or 504 status, therapy continuity, school transfer timing, caregiver bandwidth, and readiness impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in child stability, lawful service delivery, family burden, and staff effort.
3. Identify branch triggers for plan lapse, school district or installation-school delay, therapy-provider outage, guardian consent gap, and transportation or safehaven disruption.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and education-support risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: IEP or 504 continuity board, early-intervention service ladder, and school-support exception packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-IEP504-310`, `tool_suite_id=ts-joint-special-education-iep-504-early-intervention-continuity-v1`, and `protocol_stack_id=ps-joint-special-education-iep-504-early-intervention-continuity-stack-v1`.
- Alternate: select a mission-adjacent family-readiness, EFMP, or school-transport suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual high-needs roster with advisory-only service prioritization until plan status, guardian consent, and provider availability are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-IEP-504-EARLY-INTERVENTION-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: school-liaison case board, IEP or 504 continuity tracker, early-intervention appointment queue, and caregiver advocacy ledger.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NIEM`, signed school or therapy notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If guardian consent, education-plan authority, or provider availability is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported special-education promises, unsafe service gaps, school-transfer discontinuity, and caregiver overload before recommending action.
- Do not fabricate school placement, legal education-plan status, therapy availability, or transportation support.
