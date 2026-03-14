---
name: joint-digital-order-watermark-recall-and-authenticity-cell
description: Authenticate, recall, and reissue digital orders when watermark, signing, or distribution integrity is suspect. Use when commanders must contain spoofed or stale orders without stalling tempo.
---

# Joint Digital Order Watermark Recall And Authenticity Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm affected order types, release authorities, distribution paths, and timing sensitivity before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the suspect order set, watermark or signature anomaly, affected units, and commander intent.
2. Build authenticate, recall, reissue, quarantine, and voice-confirm branches with explicit tempo and trust tradeoffs.
3. Bind each recommendation to order-routing, signing, and acknowledgment tools plus protocolized outputs.
4. Publish degraded-mode branches when order provenance, acknowledgment chains, or watermark verification falls below threshold.

## Required Output Format

1. Situation snapshot.
2. Recommended order-integrity branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Digital-order authenticity packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: order-integrity board, recall-and-reissue ladder, and acknowledgment exception ledger.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-digital-order-watermark-recall-v1` with `protocol_stack_id=ps-joint-digital-order-watermark-recall-stack-v1`.
- Alternate: commander countersign board plus manual order-acknowledgment sequence.
- Degraded: advisory-only order hold with dual-channel human confirmation.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-DIGITAL-ORDER-WATERMARK-001` for critical recommendations.
- Prioritize these protocol families for this domain: signed order manifests, `USMTF`, `STIX/TAXII`, and `API/JSON`.
- Include source system, refresh UTC, confidence, acknowledgment status, and unresolved order-path gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run protocol-conformance and acknowledgment checks from `../_shared/references/us-joint-protocol-assurance-drill.md`.
- If release authority, order provenance, or receipt integrity is uncertain, downgrade to advisory-only and require human command review.

## Guardrails

- Do not fabricate valid orders, confirmed recipients, or command approvals.
- Separate suspected watermark anomalies from confirmed compromise.
- Treat any branch that can affect fires, maneuver, or nuclear-support orders as high-consequence.
