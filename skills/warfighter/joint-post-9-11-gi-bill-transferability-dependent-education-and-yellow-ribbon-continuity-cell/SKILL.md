---
name: joint-post-9-11-gi-bill-transferability-dependent-education-and-yellow-ribbon-continuity-cell
description: Preserve Post-9/11 GI Bill transferability, dependent education use, and Yellow Ribbon continuity when service obligations, school timelines, or records drift threaten family education plans and retention trust.
---

# Joint Post-9/11 GI Bill Transferability Dependent Education And Yellow Ribbon Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter and dependent education-portability decisions.
- Confirm affected personnel or dependents, transferability posture, service-obligation status, school timelines, and decision authority before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using transferability election posture, dependent education timeline, Yellow Ribbon exposure, records integrity, and retention or transition impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in education continuity, service obligation, household stability, and administrative burden.
3. Identify branch triggers for missed transfer elections, obligation mismatch, school-certification failure, Yellow Ribbon loss, and dependent-record drift.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and education-benefits decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and education-transfer risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: transferability decision board, dependent-education continuity ladder, and Yellow Ribbon protection packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-GITEB-358`, `tool_suite_id=ts-joint-post-9-11-gi-bill-transferability-dependent-education-yellow-ribbon-continuity-v1`, and `protocol_stack_id=ps-joint-post-9-11-gi-bill-transferability-dependent-education-yellow-ribbon-continuity-stack-v1`.
- Alternate: select a mission-adjacent education-benefits, personnel-records, or transition-services suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual education-transfer roster with advisory-only sequencing until election posture, obligations, and school status are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-GI-BILL-TEB-YELLOW-RIBBON-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: education-benefit transfer tracker, dependent-school or program ledger, Yellow Ribbon participation board, and service-obligation evidence queue.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `PESC XML`, signed education notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If transferability evidence, service-obligation status, or school certification is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and dependent-education clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported transferability promises, obligation assumptions, dependent-school mismatches, and unfounded funding continuity claims before recommending action.
- Do not fabricate GI Bill elections, Yellow Ribbon participation, dependent eligibility, or school outcomes.
