---
name: joint-military-star-exchange-credit-and-essential-purchase-continuity-cell
description: Preserve Military Star or exchange-credit access, essential-purchase continuity, and hardship repayment sequencing when retail-credit disruption starts to degrade U.S. warfighter household stability, duty readiness, or emergency resilience.
---

# Joint Military Star Exchange Credit And Essential Purchase Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter exchange-credit, essential-purchase, and household-liquidity continuity decisions.
- Confirm affected households, account posture, delinquency or freeze status, essential-purchase need, hardship indicators, and support-lane authority before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using account-access posture, essential-item needs, payment or delinquency status, household shock, and readiness or morale impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in liquidity speed, debt burden, retail continuity, and administrative overhead.
3. Identify branch triggers for account freeze, missed payment, emergency-purchase need, delinquency escalation, and relief-assistance crossover.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and exchange-credit risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: exchange-credit stability board, essential-purchase recovery ladder, and household-liquidity bridge packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-MSTAR-376`, `tool_suite_id=ts-joint-military-star-exchange-credit-essential-purchase-continuity-v1`, and `protocol_stack_id=ps-joint-military-star-exchange-credit-essential-purchase-continuity-stack-v1`.
- Alternate: select a mission-adjacent family-readiness, relief-assistance, or compensation suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual essential-purchase roster with advisory-only sequencing until account posture, item priority, and human financial review are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-MILITARY-STAR-EXCHANGE-CREDIT-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: exchange-credit account board, essential-purchase tracker, hardship repayment queue, and household-needs ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed retail-credit notices, `API/JSON`, `S/MIME`, `OIDC/SAML`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If account ownership, payment posture, or relief authority is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and household-needs clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported credit-line promises, emergency-purchase abuse risk, delinquency escalation, and essential-item deprivation before recommending action.
- Do not fabricate credit approval, payment deferral, hardship concession, or item availability.
