---
name: joint-leave-carryover-special-leave-accrual-and-sell-back-continuity-cell
description: Preserve leave-balance legitimacy, carryover and special-leave-accrual continuity, and leave-sell-back timing when system drift or deployment tempo starts to distort U.S. warfighter readiness, recovery, or household planning.
---

# Joint Leave Carryover Special Leave Accrual And Sell Back Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter leave-balance, carryover, and sell-back continuity decisions.
- Confirm affected population, leave year or deployment timeline, SLA posture, leave-balance evidence, sell-back eligibility, and approval authority before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using leave-balance drift, SLA or carryover exposure, sell-back timing, deployment tempo, and recovery or household impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in fiscal legitimacy, recovery protection, schedule flexibility, and staff burden.
3. Identify branch triggers for use-or-lose exposure, SLA failure, wrong balances, denied leave windows, and separation or retirement sell-back conflict.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and leave-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: leave-balance integrity board, SLA-or-carryover ladder, and sell-back continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-LEAVE-370`, `tool_suite_id=ts-joint-leave-carryover-special-leave-accrual-sell-back-continuity-v1`, and `protocol_stack_id=ps-joint-leave-carryover-special-leave-accrual-sell-back-continuity-stack-v1`.
- Alternate: select a mission-adjacent compensation, retirement, or human-readiness suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual leave-risk roster with advisory-only sequencing until balance evidence, SLA basis, and human personnel review are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-LEAVE-SLA-SELLBACK-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: leave-balance tracker, use-or-lose or SLA board, sell-back eligibility queue, and deployment-tempo reconciliation ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed personnel notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If leave authority, balance evidence, or SLA basis is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and balance-reconciliation clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported leave promises, use-or-lose exposure, incorrect sell-back assumptions, and burnout or recovery tradeoffs before recommending action.
- Do not fabricate balances, approvals, SLA entitlement, or sell-back outcomes.
