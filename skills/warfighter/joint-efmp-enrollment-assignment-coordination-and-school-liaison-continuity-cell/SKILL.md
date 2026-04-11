---
name: joint-efmp-enrollment-assignment-coordination-and-school-liaison-continuity-cell
description: Preserve EFMP enrollment, assignment coordination, and school-liaison continuity when special-needs family requirements threaten PCS timing, command sponsorship, or dependent education stability for U.S. warfighters.
---

# Joint EFMP Enrollment Assignment Coordination And School Liaison Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter family-readiness decisions where EFMP enrollment and assignment screening affect lawful movement, school support, or household stability.
- Confirm affected family members, EFMP posture, assignment or PCS timeline, school-support dependencies, and decision authority before recommending action.
- Keep outputs unclassified by default and minimize protected medical or dependent detail unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using EFMP enrollment posture, assignment-coordination status, school-liaison needs, command-sponsorship pressure, and household readiness impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in family support, move timing, privacy, and force availability.
3. Identify branch triggers for missing enrollment updates, denied assignment coordination, command-sponsorship delay, school-placement failure, and records mismatch.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and family-support decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and EFMP-assignment risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: EFMP assignment board, school-support continuity ladder, and family-movement decision packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-EFMPSL-357`, `tool_suite_id=ts-joint-efmp-enrollment-assignment-coordination-school-liaison-continuity-v1`, and `protocol_stack_id=ps-joint-efmp-enrollment-assignment-coordination-school-liaison-continuity-stack-v1`.
- Alternate: select a mission-adjacent family-readiness, education, or medical-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual EFMP-priority roster with advisory-only sequencing until enrollment status, school capacity, and human support authority are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-EFMP-ASSIGNMENT-SCHOOL-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: EFMP enrollment tracker, assignment-coordination board, school-liaison queue, and special-needs support crosswalk.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NIEM`, signed family-support notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If EFMP status, medical constraints, or school-support legitimacy is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and assignment-support clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Protect medical privacy, education rights, caregiver consent, and special-needs support assumptions before recommending action.
- Do not fabricate EFMP enrollment, assignment approval, school placement, or command-sponsorship outcomes.

## Domain Toolchain Override (2026-04-11, Expansion Wave LXXXIX Addendum)

- Add `toolchain_id=TC-SCHTRN-364`, `tool_suite_id=ts-joint-military-child-school-transfer-transcript-graduation-continuity-v1`, and `protocol_stack_id=ps-joint-military-child-school-transfer-transcript-graduation-continuity-stack-v1` when EFMP assignment coordination also depends on transcript survivability, enrollment timing, or graduation-credit protection across school transfers.
- Add `packet_id=DPL-SCHOOL-TRANSFER-GRAD-001` for branches that materially alter special-needs school continuity, movement timing, or dependent-education legitimacy.
