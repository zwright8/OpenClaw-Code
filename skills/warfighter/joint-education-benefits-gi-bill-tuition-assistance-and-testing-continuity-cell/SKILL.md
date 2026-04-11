---
name: joint-education-benefits-gi-bill-tuition-assistance-and-testing-continuity-cell
description: Preserve GI Bill, tuition assistance, credentialing, and high-stakes testing continuity for U.S. warfighters and eligible family members during mobilization, PCS, casualty recovery, or disaster disruption. Use when education-benefit breaks are beginning to create readiness, retention, or transition risk.
---

# Joint Education Benefits GI Bill Tuition Assistance And Testing Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter education-benefit and transition-readiness decisions.
- Confirm affected servicemembers or dependents, benefit status, school or testing deadlines, command timeline, and privacy constraints before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using program eligibility, enrollment or certification backlog, testing windows, and readiness or separation timelines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in degree progress, credential timing, readiness, and administrative burden.
3. Identify branch triggers for GI Bill transfer failure, tuition-assistance hold, school-certifying-official outage, exam cancellation, and records mismatch.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and education-benefit risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: education-benefit continuity board, certification or testing recovery ladder, and transition-readiness packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-EDBEN-301`, `tool_suite_id=ts-joint-education-benefits-gi-bill-tuition-assistance-testing-continuity-v1`, and `protocol_stack_id=ps-joint-education-benefits-gi-bill-tuition-assistance-testing-continuity-stack-v1`.
- Alternate: select a mission-adjacent personnel-records, family-readiness, or relief-assistance suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual priority roster with advisory-only benefit sequencing until eligibility, school status, and testing windows are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-ED-BENEFITS-GIBILL-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: education-benefit case board, school-certifying-official tracker, exam or testing continuity queue, and eligibility-evidence ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed education notices, `API/JSON`, `S/MIME`, `PESC XML`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If eligibility evidence, school certification, or benefit authority is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag lost enrollment evidence, unsupported tuition promises, testing-window misses, and transition-readiness gaps before recommending action.
- Do not fabricate eligibility, funding authority, school acceptance, or exam availability.

## Domain Toolchain Override (2026-04-11, Expansion Wave LXXXVIII Addendum)

- Add `toolchain_id=TC-GITEB-358`, `tool_suite_id=ts-joint-post-9-11-gi-bill-transferability-dependent-education-yellow-ribbon-continuity-v1`, and `protocol_stack_id=ps-joint-post-9-11-gi-bill-transferability-dependent-education-yellow-ribbon-continuity-stack-v1` when education continuity depends on transferability elections, dependent use, or Yellow Ribbon participation rather than only direct warfighter enrollment.
- Add `toolchain_id=TC-MYCAA-359`, `tool_suite_id=ts-strategic-military-spouse-mycaa-portable-training-career-reentry-v1`, and `protocol_stack_id=ps-strategic-military-spouse-mycaa-portable-training-career-reentry-stack-v1` when spouse training restart or portable credential continuity materially changes household education resilience and transition confidence.
- Add `packet_id=DPL-GI-BILL-TEB-YELLOW-RIBBON-001` and `packet_id=DPL-MYCAA-TRAINING-CAREER-001` for branches that materially alter family education portability, training continuity, or transition confidence.
