---
name: theater-expeditionary-mortuary-affairs-cold-chain-and-dna-ledger-cell
description: Preserve remains accountability, refrigeration continuity, and DNA chain-of-custody in expeditionary theaters. Use when combat losses, disaster conditions, or infrastructure outages threaten dignified handling and identification confidence.
---

# Theater Expeditionary Mortuary Affairs Cold Chain And DNA Ledger Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm remains handling authorities, refrigeration capacity, DNA collection policy, religious or cultural constraints, and next-of-kin timelines.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame current remains flow, cold-chain status, identification backlog, and transfer-node constraints.
2. Separate verified identification evidence, refrigeration limits, contamination or decomposition risk, and unknowns.
3. Build hold, transfer, augment, split, and emergency-preservation branches with explicit tradeoffs in dignity, accuracy, and throughput.
4. Bind each branch to remains accountability, refrigeration telemetry, DNA ledger, and notification-tracking tools.
5. Publish authority gates, site-security requirements, and revalidation triggers for each transfer or preservation decision.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternative branches with triggers.
4. Decision points now, next, and pre-delegated.
5. Staff task tracker with owners and suspense.
6. Mortuary DNA packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: remains-flow board, cold-chain survivability matrix, DNA custody ledger.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-mortuary-cold-chain-dna-ledger-v1` with `protocol_stack_id=ps-theater-mortuary-cold-chain-dna-ledger-stack-v1`.
- Alternate: `tool_suite_id=ts-pow-mia-fusion-v1` with `protocol_stack_id=ps-cold-chain-assurance-stack-v1`.
- Packet default: `packet_id=DPL-MORTUARY-DNA-LEDGER-001`.
- Degraded: manual remains ledger, cold-box triage board, and dual-witness DNA custody forms.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md`, `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, and `../_shared/references/domain-tool-packet-library.md`.
- Prioritize signed custody manifests, `NIEM`, `HL7/FHIR`, `API/JSON`, and `USMTF`.
- Include chain-of-custody status, refrigeration freshness, identification confidence, and handling caveats in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run `../_shared/references/mission-assurance-checklist.md` before release.
- If custody integrity, identification confidence, or disposition authority is uncertain, downgrade to advisory-only.

## Guardrails

- Do not fabricate identification, notification status, or remains-transfer authority.
- Preserve dignity and legal traceability over throughput pressure.
- Surface environmental, security, and family-notification consequences before recommending delay or relocation.
