---
name: joint-servicemembers-civil-relief-act-foreclosure-lease-eviction-and-rate-cap-enforcement-cell
description: Protect U.S. warfighters and eligible households from unlawful foreclosure, lease friction, eviction pressure, repossession, and rate-cap violations under the Servicemembers Civil Relief Act. Use when mobilization, deployment, or crisis disruption puts civil-legal protection at risk.
---

# Joint Servicemembers Civil Relief Act Foreclosure Lease Eviction And Rate Cap Enforcement Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter SCRA-protection and civil-legal continuity decisions.
- Confirm duty status, affected debts or housing actions, court or lender timeline, and legal-assistance availability before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using deployment or mobilization orders, lender or landlord actions, court deadlines, and household vulnerability.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in legal protection, speed, privacy exposure, and readiness impact.
3. Identify branch triggers for foreclosure hold, lease termination, eviction notice, interest-rate overcharge, repossession, and emergency legal escalation.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and SCRA-protection risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: SCRA protection board, housing-and-credit enforcement ladder, and legal-escalation packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-SCRA-302`, `tool_suite_id=ts-joint-servicemembers-civil-relief-act-foreclosure-lease-eviction-rate-cap-enforcement-v1`, and `protocol_stack_id=ps-joint-servicemembers-civil-relief-act-foreclosure-lease-eviction-rate-cap-enforcement-stack-v1`.
- Alternate: select a mission-adjacent civil-relief, family-readiness, or compensation-continuity suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual legal triage roster with no coercive or declarative legal recommendation beyond confirmed human legal review.

## Domain Packet Defaults

- Default packet ID: `DPL-SCRA-HOUSING-CREDIT-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: SCRA action board, foreclosure or eviction notice tracker, lender-servicer compliance queue, and legal-assistance escalation ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed court or lender notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If orders evidence, state-law applicability, or legal authority is uncertain, downgrade to advisory-only and request human legal review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and notice-authenticity integrity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported legal claims, deadline slippage, landlord or lender noncompliance, and household displacement risk before recommending action.
- Do not fabricate court relief, legal outcomes, or lender concessions.
