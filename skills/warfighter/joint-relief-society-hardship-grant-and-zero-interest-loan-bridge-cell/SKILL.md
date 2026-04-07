---
name: joint-relief-society-hardship-grant-and-zero-interest-loan-bridge-cell
description: Protect family stability by bridging emergency assistance from military relief societies and hardship programs when pay, PCS, or casualty shocks hit warfighters. Use when financial friction is starting to become a readiness problem.
---

# Joint Relief Society Hardship Grant And Zero Interest Loan Bridge Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter emergency-assistance decisions where hardship grants, zero-interest loans, or command-endorsed relief determine household stability and readiness.
- Confirm affected population, hardship category, assistance-program availability, command endorsement posture, and time-sensitive bills or travel needs before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using hardship severity, pay or PCS disruption, casualty or family emergency impacts, assistance-program status, and household timeline pressure.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in household stabilization, fraud risk, privacy, and command burden.
3. Identify branch triggers for delayed pay, denied claims, lodging or utility shutoff risk, and program-capacity shortfalls.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and hardship-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: hardship triage board, grant or loan approval ladder, and emergency-assistance bridge packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-RELIEF-300`, `tool_suite_id=ts-joint-relief-society-hardship-grant-zero-interest-loan-bridge-v1`, and `protocol_stack_id=ps-joint-relief-society-hardship-grant-zero-interest-loan-bridge-stack-v1`.
- Alternate: select a mission-adjacent pay-continuity, family-readiness, or PCS-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual hardship board with advisory-only prioritization until command endorsement, program availability, and supporting evidence are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-RELIEF-SOCIETY-HARDSHIP-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: hardship triage board, grant or loan case queue, command endorsement tracker, and arrears or emergency-expense ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed command endorsements, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If hardship evidence, command endorsement, or assistance-program legitimacy is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Protect privacy, anti-fraud controls, equitable access, and command-impartiality expectations before recommending action.
- Do not fabricate grants, loans, command endorsements, or financial distress evidence.
