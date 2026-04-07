---
name: reserve-component-employer-esgr-and-income-shock-continuity-cell
description: Protect Reserve and Guard mobilization by stabilizing employer coordination, ESGR or USERRA friction, and household income shock. Use when activation reliability depends on civilian-employer continuity and auditable support options for mobilizing warfighters.
---

# Reserve Component Employer ESGR And Income Shock Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter Reserve and Guard mobilization where civilian employer friction or household income shock threatens force availability.
- Confirm force package, activation timeline, employer categories, legal-support posture, and commander decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using mobilization demand, employer-notification status, ESGR or USERRA dispute posture, pay-delay risk, and household income fragility.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in activation speed, legal sufficiency, employer legitimacy, and family stability.
3. Identify branch triggers for employer refusal, hardship deferral, emergency financial support, and legal escalation.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: employer-continuity board, ESGR or USERRA escalation ladder, and income-shock mitigation packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-ESGR-291`, `tool_suite_id=ts-reserve-component-employer-esgr-income-shock-continuity-v1`, and `protocol_stack_id=ps-reserve-component-employer-esgr-income-shock-continuity-stack-v1`.
- Alternate: select a mission-adjacent mobilization, pay-continuity, or family-readiness suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual employer-contact ledger with advisory-only hardship routing until legal posture, pay timing, and employer acknowledgment are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-EMPLOYER-ESGR-INCOME-SHOCK-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: employer-notification board, ESGR or USERRA case tracker, household income-gap ledger, and emergency-assistance routing queue.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed employer notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If mobilization authority, employer acknowledgment, or hardship evidence is uncertain, downgrade to advisory-only and request command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported employer commitments, privacy exposure, inequitable hardship handling, and unlawful activation assumptions before recommending action.
- Do not fabricate employer responses, ESGR or USERRA outcomes, pay timing, or financial assistance availability.
