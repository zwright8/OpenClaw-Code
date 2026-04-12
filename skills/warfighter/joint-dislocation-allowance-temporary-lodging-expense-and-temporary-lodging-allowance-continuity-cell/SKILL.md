---
name: joint-dislocation-allowance-temporary-lodging-expense-and-temporary-lodging-allowance-continuity-cell
description: Preserve Dislocation Allowance (DLA), Temporary Lodging Expense (TLE), and Temporary Lodging Allowance (TLA) continuity when PCS, safehaven, or delayed housing creates cost shocks that can sideline U.S. warfighters and their families.
---

# Joint Dislocation Allowance Temporary Lodging Expense And Temporary Lodging Allowance Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter relocation-entitlement and temporary-lodging continuity decisions.
- Confirm orders posture, CONUS or OCONUS movement status, family composition, lodging dates, receipt quality, and reporting deadlines before recommending action.
- Keep outputs unclassified by default and minimize personally identifiable information unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using PCS or safehaven orders, DLA posture, TLE or TLA eligibility window, lodging-cost exposure, and household cash-flow risk.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in lawful reimbursement, speed, household stability, and fraud exposure.
3. Identify branch triggers for amended orders, safehaven extension, lodging-cap exhaustion, receipt deficiencies, and reimbursement denial.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and lodging-entitlement risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: DLA and TLE or TLA decision board, temporary-lodging cash-flow ladder, and move-continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-DLATLE-396`, `tool_suite_id=ts-joint-dislocation-allowance-temporary-lodging-expense-temporary-lodging-allowance-continuity-v1`, and `protocol_stack_id=ps-joint-dislocation-allowance-temporary-lodging-expense-temporary-lodging-allowance-continuity-stack-v1`.
- Alternate: select a mission-adjacent PCS, finance, or housing-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual lodging-entitlement roster with advisory-only sequencing until orders, dates, and receipt evidence are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-DLA-TLE-TLA-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: orders-amendment board, lodging-cost and receipt validator, DLA and TLE or TLA entitlement tracker, and check-in or checkout deadline ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed lodging notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If orders legitimacy, safehaven posture, or receipt evidence is uncertain, downgrade to advisory-only and request human finance or personnel review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and entitlement-window clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported reimbursement promises, duplicate-payment risk, lodging fraud indicators, and unsafe temporary-housing assumptions before recommending action.
- Do not fabricate orders, safehaven authority, lodging availability, or reimbursement approval.
