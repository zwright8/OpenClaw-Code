---
name: joint-military-driver-qualification-cdl-hazmat-and-convoy-license-continuity-cell
description: Preserve military-driver qualification, CDL or hazmat endorsements, and convoy-license continuity when operator drift or safety restrictions begin to slow U.S. warfighter sustainment and force flow.
---

# Joint Military Driver Qualification Cdl Hazmat And Convoy License Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter driver-readiness and sustainment-mobility continuity decisions.
- Confirm affected operators, platform or cargo type, qualification posture, safety restrictions, and approval authority before recommending action.
- Keep outputs unclassified by default and minimize personally identifiable information unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using operator availability, CDL or hazmat endorsement status, convoy-license currency, safety incidents, and mission timeline.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in force flow, legal sufficiency, operator safety, and administrative burden.
3. Identify branch triggers for endorsement lapse, mishap restriction, expired convoy certification, and insufficient qualified-driver depth.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and driver-readiness risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: driver-readiness board, endorsement recovery ladder, and convoy-license continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-CDLHAZ-395`, `tool_suite_id=ts-joint-military-driver-qualification-cdl-hazmat-convoy-license-continuity-v1`, and `protocol_stack_id=ps-joint-military-driver-qualification-cdl-hazmat-convoy-license-continuity-stack-v1`.
- Alternate: select a mission-adjacent contested-logistics, movement-control, or safety-governance suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual master-driver roster with advisory-only sequencing until endorsement evidence, safety posture, and command review are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-MIL-DRIVER-CDL-HAZMAT-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: driver-qualification board, CDL or hazmat endorsement tracker, convoy-license ledger, and mishap or restriction review queue.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `AAMVA CDLIS`, signed qualification notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If qualification evidence, mishap status, or cargo-safety posture is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and driver-legitimacy clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported license claims, hazmat-endorsement gaps, unsafe workarounds, and operator fatigue or mishap exposure before recommending action.
- Do not fabricate CDL or hazmat authority, convoy qualification, or safety approval.
