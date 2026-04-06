---
name: civil-affairs-key-leader-engagement-commitment-and-grievance-ledger-cell
description: Track key-leader engagements, promises, grievances, and closure actions to preserve legitimacy in stability operations. Use when commanders need auditable civil commitments instead of ad hoc memory and rumor-driven drift.
---

# Civil Affairs Key Leader Engagement Commitment And Grievance Ledger Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter civil-engagement, commitment-tracking, and grievance-resolution decisions.
- Confirm engagement schedule, local power brokers, outstanding promises, grievance backlog, and approval authorities before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using pending engagements, unresolved grievances, local trust indicators, rumor pressure, and commander decision deadlines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in legitimacy, access preservation, staff burden, and overcommitment risk.
3. Identify branch triggers for promise slippage, security incidents, grievance escalation, compensation requests, and rumor acceleration.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and trust-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: KLE commitment ledger, grievance closure board, and local-trust risk tracker.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-civil-affairs-kle-commitment-grievance-ledger-v1` with `protocol_stack_id=ps-civil-affairs-kle-commitment-grievance-ledger-stack-v1`.
- Alternate: select a mission-adjacent civil-affairs, public-affairs, or tactical language-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: verbal engagement log only with no new commitments released until human staff validates ownership and suspense.

## Domain Packet Defaults

- Default packet ID: `DPL-KLE-COMMITMENT-GRIEVANCE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: engagement calendar board, commitment ledger, grievance-triage queue, and local-influence or rumor map.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `OGC`, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If promise ownership, compensation authority, or local-partner identity is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and commitment-acknowledgment integrity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag duplicate promises, uncompensated losses, unverifiable grievances, and mismatched local expectations before recommending action.
- Do not fabricate local consent, tribal or municipal commitments, or grievance closure.
