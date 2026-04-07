---
name: joint-va-home-loan-guaranty-foreclosure-avoidance-and-housing-stability-cell
description: Preserve VA home-loan guaranty continuity, foreclosure-avoidance actions, closing timelines, and housing stability for U.S. warfighters during mobilization, PCS, casualty recovery, or transition. Use when housing-system friction is starting to degrade readiness, retention, or lawful availability.
---

# Joint VA Home Loan Guaranty Foreclosure Avoidance And Housing Stability Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter housing-stability and VA home-loan continuity decisions.
- Confirm affected households, loan or closing posture, PCS or separation timeline, legal-support availability, and financial-stability indicators before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using loan status, delinquency or closing timeline, housing risk, military-move or transition pressure, and command deadlines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in housing stability, readiness protection, privacy exposure, and administrative burden.
3. Identify branch triggers for foreclosure notice, failed closing, temporary-housing gap, loan-servicer nonresponse, and legal-escalation threshold.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and housing-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: housing-stability board, VA loan intervention ladder, and transition-housing packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-VAHOME-317`, `tool_suite_id=ts-joint-va-home-loan-guaranty-foreclosure-avoidance-housing-stability-v1`, and `protocol_stack_id=ps-joint-va-home-loan-guaranty-foreclosure-avoidance-housing-stability-stack-v1`.
- Alternate: select a mission-adjacent civil-relief, compensation, or family-readiness suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual housing-risk roster with advisory-only action until loan status, counselor input, and legal authority are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-VA-HOME-LOAN-HOUSING-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: VA home-loan case board, loan-servicer coordination queue, foreclosure or delinquency tracker, and housing-counselor liaison ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed lender notices, `API/JSON`, `S/MIME`, `MISMO`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If loan status, lender response, counselor evidence, or legal authority is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and acknowledgment integrity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported housing promises, missing lender evidence, privacy leakage, and foreclosure-timing uncertainty before recommending action.
- Do not fabricate loan status, loss-mitigation approval, closing dates, or housing-counselor commitments.
