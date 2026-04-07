---
name: strategic-cash-vault-disconnected-pay-agent-and-anti-diversion-cell
description: Coordinate strategic cash-vault integrity, disconnected pay-agent routing, and anti-diversion controls. Use when deployed pay continuity depends on physical currency custody, austere disbursement nodes, or fraud-resistant emergency payroll.
---

# Strategic Cash Vault Disconnected Pay Agent and Anti Diversion Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm cash holdings, courier posture, pay-agent authorities, biometric or roster verification options, and diversion risk before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with vault posture, disbursement demand, courier or pay-agent routes, verification confidence, and commander priorities.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in payroll continuity, theft exposure, accountability burden, and labor stability.
3. Identify branch triggers for custody break, biometric outage, route denial, or counterfeit suspicion.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and finance decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: cash custody ladder, pay-agent route matrix, and anti-diversion control board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-cash-vault-disconnected-pay-agent-anti-diversion-v1` with `protocol_stack_id=ps-strategic-cash-vault-disconnected-pay-agent-anti-diversion-stack-v1`.
- Alternate: select a mission-adjacent disbursing, finance-continuity, or fraud-response suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: command-approved priority disbursements only with dual-custody paper control, time-bounded cash issue, and manual reconciliation.

## Domain Packet Defaults

- Default packet ID: `DPL-CASH-VAULT-ANTIDIVERSION-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: cash-vault ledger, biometric or roster verification board, pay-agent route tracker, and fraud analytics desk.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed cash manifests, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If custody integrity, pay-agent verification, or disbursement authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag dual-custody failure, diversion indicators, verification blind spots, and counterfeit risk before recommending action.
- Do not fabricate cash-on-hand, pay verification, or disbursement authority.
