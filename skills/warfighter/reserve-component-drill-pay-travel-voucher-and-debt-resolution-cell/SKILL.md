---
name: reserve-component-drill-pay-travel-voucher-and-debt-resolution-cell
description: Preserve Reserve and Guard drill-pay, travel-voucher, and debt-resolution continuity when administrative errors begin to sideline otherwise available warfighters. Use when pay friction, debt notices, or travel reimbursement failure are degrading lawful force availability.
---

# Reserve Component Drill Pay Travel Voucher And Debt Resolution Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. Reserve Component and National Guard pay-continuity and mobilization-availability decisions.
- Confirm affected members, orders or drill status, pay-discrepancy type, debt or garnishment posture, and command timeline before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using duty status, certified attendance, travel evidence, debt posture, and hardship or readiness impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in speed, fiscal legitimacy, fraud exposure, and staff burden.
3. Identify branch triggers for missing drill certification, rejected travel claim, erroneous debt, unpaid arrears, and command-directed hardship escalation.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and pay-disruption trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: drill-pay discrepancy board, debt-resolution ladder, and travel-reimbursement exception packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-DRILLPAY-309`, `tool_suite_id=ts-reserve-component-drill-pay-travel-voucher-debt-resolution-v1`, and `protocol_stack_id=ps-reserve-component-drill-pay-travel-voucher-debt-resolution-stack-v1`.
- Alternate: select a mission-adjacent mobilization, compensation, or relief-assistance suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual pay-priority roster with advisory-only sequencing until attendance, orders, and debt legitimacy are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-DRILL-PAY-DEBT-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: drill-pay discrepancy board, attendance certification queue, debt remission or waiver tracker, and travel-claim reconciliation ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed pay notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If duty status, certified attendance, debt legitimacy, or reimbursement authority is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported debt collection, uncompensated travel, inconsistent attendance evidence, and hardship spillover before recommending action.
- Do not fabricate orders, duty status, pay authority, debt waiver, or reimbursement approval.

## Domain Toolchain Override (2026-04-11, Expansion Wave XCI Addendum)

- Add `toolchain_id=TC-IDTRST-374`, `tool_suite_id=ts-reserve-component-idt-rst-at-good-year-continuity-v1`, and `protocol_stack_id=ps-reserve-component-idt-rst-at-good-year-continuity-stack-v1` when drill-pay legitimacy, attendance certification, or travel-reimbursement trust depends on IDT evidence, RST approvals, AT orders, or good-year preservation.
- Add `packet_id=DPL-RESERVE-IDT-RST-AT-GOODYEAR-001` for branches that materially alter pay legitimacy, attendance confidence, or commander trust in Reserve or Guard availability.
