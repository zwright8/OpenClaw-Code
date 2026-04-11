---
name: joint-dual-military-colocation-career-field-alignment-and-dependent-care-continuity-cell
description: Preserve dual-military co-location, career-field alignment, and dependent-care continuity when join-spouse friction, mismatched orders, or simultaneous deployment pressure begins to degrade U.S. warfighter readiness or retention.
---

# Joint Dual Military Colocation Career Field Alignment And Dependent Care Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter dual-military assignment and dependent-care continuity decisions.
- Confirm affected service members, assignment windows, career-field constraints, dependent-care posture, and approval authority before recommending action.
- Keep outputs unclassified by default and minimize personally identifiable information unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using assignment timing, co-location posture, career-field manning constraints, dependent-care coverage, and deployment-conflict risk.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in assignment stability, household continuity, mission coverage, and administrative burden.
3. Identify branch triggers for order mismatch, denied co-location exception, childcare or eldercare collapse, and simultaneous deployment exposure.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and dual-military risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: co-location decision board, assignment-conflict ladder, and dependent-care continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-DUALMIL-390`, `tool_suite_id=ts-joint-dual-military-colocation-career-field-alignment-dependent-care-continuity-v1`, and `protocol_stack_id=ps-joint-dual-military-colocation-career-field-alignment-dependent-care-continuity-stack-v1`.
- Alternate: select a mission-adjacent family-readiness, personnel-distribution, or childcare-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual dual-military roster with advisory-only sequencing until assignment status, dependent-care coverage, and command review are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-DUAL-MIL-COLOCATION-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: dual-military assignment board, co-location exception queue, dependent-care coverage ledger, and deployment-conflict matrix.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `HR-XML`, signed personnel notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If assignment authority, care-plan sufficiency, or family-data accuracy is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and assignment-evidence integrity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported co-location promises, dependent-care fragility, career-field shortfalls, and retention assumptions before recommending action.
- Do not fabricate assignment approvals, co-location exceptions, or childcare coverage.
