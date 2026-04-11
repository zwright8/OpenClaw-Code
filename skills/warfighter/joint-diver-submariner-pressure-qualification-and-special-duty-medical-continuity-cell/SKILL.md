---
name: joint-diver-submariner-pressure-qualification-and-special-duty-medical-continuity-cell
description: Preserve diver, submariner, and undersea special-duty medical qualification continuity when pressure exposure, screening backlog, or return-to-duty friction threatens U.S. warfighter undersea readiness.
---

# Joint Diver Submariner Pressure Qualification And Special Duty Medical Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter undersea special-duty medical-readiness decisions.
- Confirm affected personnel, pressure-exposure history, qualification posture, sea-duty requirements, and medical authority before recommending action.
- Keep outputs unclassified by default and minimize protected health information unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using exposure history, qualification status, special-duty screening backlog, return-to-duty requirements, and mission timeline.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in crew safety, undersea readiness, medical certainty, and manning burden.
3. Identify branch triggers for qualification lapse, chamber or physiology event, temporary sea-duty restriction, and delayed medical adjudication.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and undersea-readiness risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: undersea medical-qualification board, pressure-exposure ladder, and special-duty readiness packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-SPECIALMED-393`, `tool_suite_id=ts-joint-diver-submariner-pressure-qualification-special-duty-medical-continuity-v1`, and `protocol_stack_id=ps-joint-diver-submariner-pressure-qualification-special-duty-medical-continuity-stack-v1`.
- Alternate: select a mission-adjacent dive-medicine, IMR, or aeromedical-waiver suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual undersea-medical roster with advisory-only sequencing until qualification evidence, exposure status, and medical review are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-DIVER-SUBMARINER-MEDQUAL-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: special-duty medical board, pressure-qualification ledger, hyperbaric or physiology incident tracker, and sea-duty status board.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NIEM`, signed special-duty medical notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If qualification evidence, exposure history, or medical authority is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and readiness-evidence integrity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported return-to-duty assumptions, missing exposure evidence, chamber-capacity confusion, and privacy risk before recommending action.
- Do not fabricate special-duty clearance, dive or submarine qualification, or medical approval.
