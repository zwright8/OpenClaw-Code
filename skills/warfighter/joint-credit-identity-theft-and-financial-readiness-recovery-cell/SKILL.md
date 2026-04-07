---
name: joint-credit-identity-theft-and-financial-readiness-recovery-cell
description: Restore trusted financial identity, credit access, and fraud-response continuity for U.S. warfighters and military households after cyber compromise, disaster disruption, or document loss. Use when credit or identity failures are degrading readiness, mobility, or emergency-assistance eligibility.
---

# Joint Credit Identity Theft And Financial Readiness Recovery Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter credit, identity-theft, and financial-recovery decisions.
- Confirm fraud indicators, affected accounts or bureaus, emergency cash posture, and household risk before recommending action.
- Keep outputs unclassified by default and minimize financial identifiers unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using fraud reports, credit access disruption, account lockouts, emergency cash demand, and readiness impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in fraud containment, liquidity, privacy, and household stability.
3. Identify branch triggers for credit freeze, bureau dispute, pay diversion suspicion, travel-card compromise, and emergency-assistance escalation.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and credit-recovery risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: identity-fraud response board, credit-recovery ladder, and financial-readiness stabilization packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-CREDIT-306`, `tool_suite_id=ts-joint-credit-identity-theft-financial-readiness-recovery-v1`, and `protocol_stack_id=ps-joint-credit-identity-theft-financial-readiness-recovery-stack-v1`.
- Alternate: select a mission-adjacent relief-assistance, tax-identity, or compensation-continuity suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual fraud-priority roster with advisory-only sequencing until identity, account status, and assistance eligibility are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-CREDIT-IDENTITY-RECOVERY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: credit-dispute case board, fraud-alert tracker, identity-proof ledger, and emergency-assistance routing queue.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed dispute notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If identity proof, fraud evidence, or financial authority is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and notice-authenticity integrity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported fraud claims, premature credit assumptions, banking lockout risk, and privacy leakage before recommending action.
- Do not fabricate bureau decisions, lender actions, or restored credit status.
