---
name: joint-hazardous-duty-jump-dive-and-special-duty-pay-certification-continuity-cell
description: Preserve hazardous-duty, jump, dive, and special-duty pay certification continuity when qualification drift or missing orders threaten U.S. warfighter deployability, compensation, or billet eligibility.
---

# Joint Hazardous Duty Jump Dive And Special Duty Pay Certification Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter hazardous-duty qualification, certification, and incentive-pay continuity decisions.
- Confirm affected population, duty category, qualification currency, special-duty orders posture, incentive-pay status, and approval authority before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using qualification expiry, jump or dive currency, special-duty orders status, pay exposure, and billet or deployment impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in safety, compensation legitimacy, availability, and administrative burden.
3. Identify branch triggers for expired currency, missing orders, failed refresher training, medical restriction, and recoupment exposure.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and qualification-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: hazardous-duty certification board, qualification-recovery ladder, and special-duty pay continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-HAZPAY-379`, `tool_suite_id=ts-joint-hazardous-duty-jump-dive-special-duty-pay-certification-continuity-v1`, and `protocol_stack_id=ps-joint-hazardous-duty-jump-dive-special-duty-pay-certification-continuity-stack-v1`.
- Alternate: select a mission-adjacent compensation, medical-readiness, or training-readiness suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual qualification roster with advisory-only sequencing until certification evidence, orders status, and human safety review are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-HAZDUTY-JUMP-DIVE-CERT-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: hazardous-duty certification board, jump or dive currency ledger, special-duty orders tracker, and incentive-pay monitor.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed qualification notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If qualification evidence, duty-order authority, or incentive-pay legitimacy is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and certification evidence clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported pay promises, unsafe qualification assumptions, expired currency, and order-legitimacy gaps before recommending action.
- Do not fabricate jump or dive currency, special-duty orders, waiver approval, or pay-entitlement outcomes.
