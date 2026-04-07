---
name: joint-dependent-special-needs-transport-education-and-medical-continuity-cell
description: Preserve special-needs dependent transport, education-plan execution, therapy access, and medical continuity during deployment, evacuation, school closure, or installation disruption. Use when dependent special-needs gaps can degrade U.S. warfighter readiness, retention, or family safety.
---

# Joint Dependent Special Needs Transport Education And Medical Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter dependent special-needs transport, education, and medical continuity decisions.
- Confirm dependent support requirements, IEP or 504 obligations, transport constraints, therapy or medication dependencies, caregiver capacity, and decision timelines before recommending action.
- Keep outputs unclassified by default and minimize personally identifiable information unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using dependent needs, school or therapy disruption, transport availability, medical support gaps, and family readiness impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in safety, legal sufficiency, privacy exposure, and continuity speed.
3. Identify branch triggers for transport failure, school closure, therapy lapse, caregiver unavailability, and shelter or lodging relocation.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and special-needs continuity trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: special-needs continuity board, transport and therapy ladder, and dependent-support risk tracker.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-dependent-special-needs-education-medical-continuity-v1` with `protocol_stack_id=ps-joint-dependent-special-needs-education-medical-continuity-stack-v1`.
- Alternate: select a mission-adjacent family-readiness, medical-support, or shelter-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual dependent-support roster with no unsupported education or medical continuity guarantee beyond confirmed human coordination.

## Domain Packet Defaults

- Default packet ID: `DPL-DEPENDENT-SPECIAL-NEEDS-CONTINUITY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: dependent-needs case board, accessible transport scheduler, therapy continuity tracker, and medical support ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `HL7/FHIR`, `CAP`, signed care notices, `API/JSON`, and `S/MIME`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If special-needs support requirements, transport eligibility, or medical continuity authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and acknowledgment integrity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsafe transport assumptions, therapy lapses, education-plan discontinuity, and caregiver overload before recommending action.
- Do not fabricate disability status, school obligations, or medical clearances.
