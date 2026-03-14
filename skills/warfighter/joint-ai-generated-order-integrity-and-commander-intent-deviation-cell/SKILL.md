---
name: joint-ai-generated-order-integrity-and-commander-intent-deviation-cell
description: Detect drift between AI-generated orders and authenticated commander intent. Use when machine-assisted planning accelerates order production but trust, version control, or intent fidelity is in doubt.
---

# Joint AI Generated Order Integrity And Commander Intent Deviation Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm commander intent sources, order-release authorities, model usage boundaries, and decision timelines before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the order set, intent source documents, model outputs, and distribution paths that require integrity review.
2. Build one recommended trust branch plus alternatives to hold, countersign, reissue, or constrain machine-generated tasking.
3. Bind each recommendation to order-authentication, semantic-drift, and acknowledgment-ledger tools with explicit protocolized outputs.
4. Publish degraded-mode branches when provenance, countersignature status, or downstream acknowledgment integrity falls below threshold.

## Required Output Format

1. Situation snapshot.
2. Recommended order-integrity branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now, next, and pre-delegated.
5. Staff tasking by owner and suspense.
6. AI-order integrity packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: intent-deviation matrix, order hold-or-release ladder, acknowledgment exception ledger.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-ai-order-intent-integrity-v1` with `protocol_stack_id=ps-joint-ai-order-intent-integrity-stack-v1`.
- Alternate: signed digital-order recall board plus commander-intent comparison worksheet.
- Degraded: dual-channel human countersign and manual readback confirmation before order release.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-AI-ORDER-INTENT-001` for critical recommendations.
- Prioritize these protocol families for this domain: signed order manifests, `USMTF`, `STIX/TAXII`, and `API/JSON`.
- Include source system, refresh UTC, confidence, compared intent sources, and unresolved version-control gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run assurance checks from `../_shared/references/us-joint-protocol-assurance-drill.md` and `../_shared/references/mission-assurance-checklist.md`.
- If commander-intent provenance, digital-signature trust, or acknowledgment-chain integrity is uncertain, downgrade to advisory-only and require human command review.

## Guardrails

- Do not fabricate commander intent, model confidence, or release authority.
- Separate semantic drift findings from formatting or routing errors.
- Flag synthetic-media, replay, and stale-order risks early.
