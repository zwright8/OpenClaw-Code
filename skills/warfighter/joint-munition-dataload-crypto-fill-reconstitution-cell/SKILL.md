---
name: joint-munition-dataload-crypto-fill-reconstitution-cell
description: Reconstitute trusted munition dataloads and crypto fills after compromise, loss, or urgent relocation without breaking release authority. Use when strike, defense, or EW systems need verified mission-data and key-material continuity.
---

# Joint Munition Dataload Crypto Fill Reconstitution Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm affected weapon or EW families, compromise scope, release authority, rekey timelines, and commander decision points before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the dataload and crypto-fill architecture, trust anchors, storage locations, and affected mission threads.
2. Detect corruption, custody loss, stale mission data, expired fills, or transport interruptions that could break operational release.
3. Build reconstitute, rekey, quarantine, relocate, and fallback branches with explicit readiness and authority tradeoffs.
4. Bind each recommendation to concrete KMI, mission-data validation, and packetized trust outputs.

## Required Output Format

1. Situation snapshot.
2. Recommended reconstitution branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Dataload and crypto-fill packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: dataload recovery branch matrix, fill-status trust ledger, and release-authority sequence.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-munition-dataload-crypto-fill-reconstitution-v1` with `protocol_stack_id=ps-joint-munition-dataload-crypto-fill-reconstitution-stack-v1`.
- Alternate: manual key-custody board plus mission-data checksum worksheet.
- Degraded: human-verified limited release only with commander-approved fallback loads.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-MUNITION-DATALOAD-CRYPTO-001` for critical recommendations.
- Prioritize these protocol families for this domain: `X.509/PKI`, signed mission-data manifests, `API/JSON`, and `USMTF`.
- Include source system, refresh UTC, confidence, affected families, and unresolved trust-anchor gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run trust and release checks from `../_shared/references/us-joint-protocol-assurance-drill.md` and `../_shared/references/mission-assurance-checklist.md`.
- If custody, checksum integrity, or authority is uncertain, downgrade to advisory-only and assign remediation owners.

## Guardrails

- Do not produce executable weapon-targeting data, actual key material, or bypasses to release safeguards.
- Separate observed trust failures from inferred compromise cause.
- Surface authority, interoperability, and timing risks before recommending re-release.
