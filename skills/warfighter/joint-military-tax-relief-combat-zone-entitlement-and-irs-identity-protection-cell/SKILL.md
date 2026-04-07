---
name: joint-military-tax-relief-combat-zone-entitlement-and-irs-identity-protection-cell
description: Preserve combat-zone tax relief, extension eligibility, military tax-document continuity, and IRS identity protection for U.S. warfighters and families during deployment, mobilization, casualty response, or cyber disruption. Use when tax-process failures are beginning to create readiness, legitimacy, or household financial risk.
---

# Joint Military Tax Relief Combat Zone Entitlement And IRS Identity Protection Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter tax-relief and fiscal-identity continuity decisions.
- Confirm affected tax years, duty status, combat-zone or contingency eligibility, document availability, and fraud indicators before recommending action.
- Keep outputs unclassified by default and minimize tax-sensitive data unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using tax deadlines, duty-location evidence, pay or LES discrepancies, fraud indicators, and household risk.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in tax compliance, refund or extension timing, privacy, and readiness impact.
3. Identify branch triggers for combat-zone certification failure, IRS identity-theft notice, W-2 or LES mismatch, state-tax residency dispute, and casualty-linked filing escalation.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and tax-relief risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: tax-relief continuity board, entitlement verification ladder, and IRS identity-protection packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-TAXID-304`, `tool_suite_id=ts-joint-military-tax-relief-combat-zone-entitlement-irs-identity-protection-v1`, and `protocol_stack_id=ps-joint-military-tax-relief-combat-zone-entitlement-irs-identity-protection-stack-v1`.
- Alternate: select a mission-adjacent finance, pay-continuity, or personnel-records suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual tax-risk roster with advisory-only prioritization until entitlement evidence, tax documents, and fraud posture are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-MILITARY-TAX-IDENTITY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: military tax case board, combat-zone certification tracker, LES or W-2 discrepancy ledger, and IRS identity-protection queue.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed tax notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If entitlement evidence, tax authority, or fraud status is uncertain, downgrade to advisory-only and request human fiscal review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and notice-authenticity integrity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported tax promises, refund timing assumptions, combat-zone evidence gaps, and identity-fraud exposure before recommending action.
- Do not fabricate tax authority, refund status, or IRS protective actions.
