---
name: joint-aviation-incentive-pay-aeronautical-order-and-gate-month-continuity-cell
description: Preserve aviation incentive pay, aeronautical-order validity, and gate-month continuity when record drift or recertification delays threaten U.S. warfighter flight status, compensation, or assignment viability.
---

# Joint Aviation Incentive Pay Aeronautical Order And Gate Month Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter aviation-pay, aeronautical-order, and flight-status continuity decisions.
- Confirm affected aircrew population, aviation-service category, aeronautical-order posture, gate-month timeline, waiver status, and approval authority before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using aeronautical-order status, gate-month currency, flight-record drift, incentive-pay exposure, and assignment or sortie impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in pay legitimacy, aircrew availability, safety confidence, and administrative burden.
3. Identify branch triggers for expired aeronautical orders, missed gate months, stale aviation records, waiver delays, and recoupment exposure.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and aviation-readiness risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: aviation-pay continuity board, aeronautical-order correction ladder, and gate-month readiness packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-AVPAY-378`, `tool_suite_id=ts-joint-aviation-incentive-pay-aeronautical-order-gate-month-continuity-v1`, and `protocol_stack_id=ps-joint-aviation-incentive-pay-aeronautical-order-gate-month-continuity-stack-v1`.
- Alternate: select a mission-adjacent compensation, medical-readiness, or personnel-records suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual aviation-status roster with advisory-only sequencing until aeronautical-order validity, gate-month evidence, and human aviation-resource review are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-AVIATION-PAY-AERO-ORDER-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: aviation-service record board, aeronautical-order tracker, gate-month or flight-record ledger, and waiver-routing queue.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed aviation notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If aeronautical-order authority, flight-status evidence, or incentive-pay legitimacy is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and gate-month evidence clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported flight-pay promises, stale aeronautical orders, waiver drift, and unsafe crew-availability assumptions before recommending action.
- Do not fabricate aeronautical-order approval, gate-month completion, flying-status restoration, or pay-entitlement outcomes.
