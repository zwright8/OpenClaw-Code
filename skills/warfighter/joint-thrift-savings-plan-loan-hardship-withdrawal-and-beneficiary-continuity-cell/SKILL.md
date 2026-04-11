---
name: joint-thrift-savings-plan-loan-hardship-withdrawal-and-beneficiary-continuity-cell
description: Preserve TSP access, loan or hardship-withdrawal routing, contribution continuity, and beneficiary accuracy when emergency cash shocks, login failure, or life-event record drift threaten U.S. warfighter household stability or survivor intent.
---

# Joint Thrift Savings Plan Loan Hardship Withdrawal And Beneficiary Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter TSP-access, emergency-liquidity, and beneficiary-legitimacy decisions.
- Confirm affected population, account-access posture, hardship driver, loan or withdrawal timeline, beneficiary dependencies, and privacy constraints before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using TSP access failure, loan or hardship need, contribution posture, beneficiary or survivor intent, and household stability impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in liquidity speed, retirement impact, beneficiary integrity, and administrative burden.
3. Identify branch triggers for lockout, rejected loan request, hardship-withdrawal documentation gap, stale beneficiary election, and payroll-contribution mismatch.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and TSP-continuity risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: TSP access-recovery board, hardship or loan decision ladder, and beneficiary-continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-TSPHL-373`, `tool_suite_id=ts-joint-thrift-savings-plan-loan-hardship-withdrawal-beneficiary-continuity-v1`, and `protocol_stack_id=ps-joint-thrift-savings-plan-loan-hardship-withdrawal-beneficiary-continuity-stack-v1`.
- Alternate: select a mission-adjacent retirement, compensation, or survivor-benefits suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual retirement-liquidity roster with advisory-only sequencing until account ownership, emergency need, and human financial review are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-TSP-LOAN-HARDSHIP-BENEFICIARY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: TSP account-access tracker, loan or hardship case board, beneficiary-election ledger, and payroll-contribution monitor.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed financial notices, `API/JSON`, `S/MIME`, `OIDC/SAML`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If account ownership, hardship evidence, or beneficiary authority is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and beneficiary-evidence clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported withdrawal promises, beneficiary mismatch, account-takeover risk, and retirement-harm tradeoffs before recommending action.
- Do not fabricate TSP loans, hardship approvals, beneficiary changes, or account recovery outcomes.
