---
name: joint-federal-student-loan-deferment-fafsa-and-college-reentry-continuity-cell
description: Preserve federal student-loan protections, FAFSA or enrollment continuity, and college reentry timing for warfighters or dependents when mobilization, PCS, injury, or transition interrupts education-finance stability.
---

# Joint Federal Student Loan Deferment FAFSA And College Reentry Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter education-finance and college-reentry continuity decisions.
- Confirm affected borrowers or students, mobilization or transition posture, loan-servicer status, FAFSA or enrollment deadlines, and decision authority before recommending action.
- Keep outputs unclassified by default and minimize financial-aid detail or student data unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using student-loan posture, deferment or forbearance risk, FAFSA or enrollment deadlines, academic reentry barriers, and readiness or retention impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in debt protection, education continuity, administrative burden, and household stability.
3. Identify branch triggers for servicer error, missed FAFSA window, transcript or enrollment mismatch, mobilization orders delay, and school reentry breakdown.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and education-finance risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: student-loan protection board, FAFSA or enrollment ladder, and college-reentry continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-STULOAN-326`, `tool_suite_id=ts-joint-federal-student-loan-deferment-fafsa-college-reentry-continuity-v1`, and `protocol_stack_id=ps-joint-federal-student-loan-deferment-fafsa-college-reentry-continuity-stack-v1`.
- Alternate: select a mission-adjacent education-benefits, financial-readiness, or personnel-records suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual education-finance priority roster with advisory-only sequencing until loan posture, school status, and military-order evidence are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-STUDENT-LOAN-FAFSA-REENTRY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: student-loan servicer case board, FAFSA or enrollment-status tracker, military deferment or forbearance queue, and academic reentry ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `PESC XML`, signed education-finance notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If loan evidence, school status, or deferment authority is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and education-eligibility clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported deferment promises, FAFSA assumptions, transcript or enrollment shortcuts, and debt-relief overclaim before recommending action.
- Do not fabricate loan status, school acceptance, FAFSA outcomes, or aid restoration.
