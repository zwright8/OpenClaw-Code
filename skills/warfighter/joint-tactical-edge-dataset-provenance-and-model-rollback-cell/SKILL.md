---
name: joint-tactical-edge-dataset-provenance-and-model-rollback-cell
description: Restore trusted tactical-edge datasets and models after corruption, drift, or tampering indicators. Use when edge-enabled sensing, routing, or decision aids may need provenance validation and rollback before commanders rely on them.
---

# Joint Tactical Edge Dataset Provenance And Model Rollback Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm affected edge systems, baseline snapshots, rollback authorities, and mission threads before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the edge-data trust problem with affected datasets, model versions, corruption indicators, and commander decision points.
2. Build retain, rollback, isolate, snapshot-only, and revalidate branches with explicit mission and trust tradeoffs.
3. Bind each recommendation to concrete integrity, registry, and rollback tools plus packetized outputs.
4. Publish degraded-mode branches when checksum evidence, baseline availability, or release authority falls below threshold.

## Required Output Format

1. Situation snapshot.
2. Recommended trust-restoration branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Dataset-rollback packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: dataset provenance ledger, rollback trigger table, and trusted-edge release board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-tactical-edge-dataset-provenance-rollback-v1` with `protocol_stack_id=ps-joint-tactical-edge-dataset-provenance-rollback-stack-v1`.
- Alternate: manual checksum board plus baseline snapshot ledger.
- Degraded: approved-baseline snapshots only with human release for edge updates.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-TACTICAL-EDGE-DATASET-ROLLBACK-001` for critical recommendations.
- Prioritize these protocol families for this domain: signed dataset manifests, `API/JSON`, `STIX/TAXII`, and `USMTF`.
- Include source system, refresh UTC, confidence, affected mission threads, and unresolved baseline gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run provenance and rollback-assurance checks from `../_shared/references/us-joint-protocol-assurance-drill.md` and `../_shared/references/mission-assurance-checklist.md`.
- If checksum evidence, baseline availability, or rollback authority is uncertain, downgrade to advisory-only and assign remediation owners.

## Guardrails

- Do not fabricate integrity evidence, rollback success, or deployment authority.
- Do not provide instructions for corrupting models, tampering with datasets, or bypassing attestation controls.
- Separate observed trust failures from inferred adversary cause.
