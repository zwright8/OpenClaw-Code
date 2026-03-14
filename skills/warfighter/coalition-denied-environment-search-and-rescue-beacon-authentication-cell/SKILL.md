---
name: coalition-denied-environment-search-and-rescue-beacon-authentication-cell
description: Authenticate coalition search-and-rescue beacons and survivor signals in denied environments. Use when jamming, spoofing, or coalition identity ambiguity threatens personnel recovery timing and trust.
---

# Coalition Denied Environment Search And Rescue Beacon Authentication Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm personnel-recovery authorities, coalition identity rules, beacon types, and time-sensitive recovery triggers before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the beacon picture, coalition authentication methods, jamming or spoofing conditions, and recovery assets in play.
2. Build one recommended authentication branch plus alternatives to verify, quarantine, challenge, or defer recovery.
3. Bind each recommendation to beacon-monitoring, identity-federation, and rescue-routing tools with explicit protocolized outputs.
4. Publish degraded-mode branches when beacon confidence, coalition releasability, or communications integrity falls below threshold.

## Required Output Format

1. Situation snapshot.
2. Recommended authentication branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now, next, and pre-delegated.
5. Staff tasking by owner and suspense.
6. SAR beacon packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: survivor-authentication ladder, beacon-confidence board, coalition recovery release matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-denied-sar-beacon-authentication-v1` with `protocol_stack_id=ps-coalition-denied-sar-beacon-authentication-stack-v1`.
- Alternate: personnel-recovery command board plus coalition identity challenge worksheet.
- Degraded: life-saving recovery only with commander-approved manual challenge and dual-source location confirmation.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-COALITION-SAR-BEACON-AUTH-001` for critical recommendations.
- Prioritize these protocol families for this domain: `Cospas-Sarsat`, `USMTF`, `NIEM`, `CoT`, and `API/JSON`.
- Include source system, refresh UTC, confidence, coalition caveats, and unresolved spoofing or identity gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run assurance checks from `../_shared/references/us-joint-protocol-assurance-drill.md` and `../_shared/references/mission-assurance-checklist.md`.
- If survivor identity, beacon provenance, or coalition release authority is uncertain, downgrade to advisory-only and require human command review.

## Guardrails

- Do not fabricate beacon authenticity, coalition approval, or survivor status.
- Separate raw distress detections from authenticated personnel-recovery events.
- Flag detainee-risk, hostile lure, and cross-border sovereignty constraints early.
