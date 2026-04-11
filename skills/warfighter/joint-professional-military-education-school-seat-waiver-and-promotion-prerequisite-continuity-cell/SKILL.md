---
name: joint-professional-military-education-school-seat-waiver-and-promotion-prerequisite-continuity-cell
description: Preserve professional military education seat allocation, waiver routing, and promotion-prerequisite continuity when backlog or funding drift threatens U.S. warfighter promotion timing, assignment trust, or career progression.
---

# Joint Professional Military Education School Seat Waiver And Promotion Prerequisite Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter PME, waiver, and promotion-prerequisite continuity decisions.
- Confirm affected population, PME requirement, school-seat timeline, waiver posture, promotion or command-screen milestone, and approval authority before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using school-seat status, prerequisite completion evidence, waiver backlog, promotion-board timing, and billet or assignment impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in career fairness, readiness, timing, and administrative burden.
3. Identify branch triggers for lost seat allocation, waiver denial, funding shortfall, prerequisite mismatch, and cutoff-date breach.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and career-progression risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: PME seat-allocation board, waiver decision ladder, and promotion-prerequisite continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-PME-380`, `tool_suite_id=ts-joint-professional-military-education-school-seat-waiver-promotion-prerequisite-continuity-v1`, and `protocol_stack_id=ps-joint-professional-military-education-school-seat-waiver-promotion-prerequisite-continuity-stack-v1`.
- Alternate: select a mission-adjacent promotion-board, personnel-records, or talent-management suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual education-milestone roster with advisory-only sequencing until seat status, waiver authority, and prerequisite evidence are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-PME-SCHOOL-SEAT-PREREQ-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: PME seat-allocation board, prerequisite-completion ledger, waiver-routing queue, and assignment-impact tracker.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `PESC XML`, signed education notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If prerequisite evidence, school-seat authority, or waiver approval is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and prerequisite evidence clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported school-seat promises, unverified waivers, stale prerequisite data, and cutoff-date risk before recommending action.
- Do not fabricate school selection, waiver approval, prerequisite completion, or promotion outcomes.
