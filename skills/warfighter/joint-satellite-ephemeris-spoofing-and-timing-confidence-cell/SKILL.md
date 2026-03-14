---
name: joint-satellite-ephemeris-spoofing-and-timing-confidence-cell
description: Detect ephemeris spoofing and preserve timing confidence for joint space-enabled operations. Use when commanders need trusted orbital and timing data for navigation, fires, communications, or warning missions.
---

# Joint Satellite Ephemeris Spoofing And Timing Confidence Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm affected constellations, mission dependencies, alternate timing paths, and command authorities before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the ephemeris or timing anomaly, affected mission threads, and commander decision thresholds.
2. Separate observed timing drift, orbital-data mismatch, suspected spoof indicators, and unknowns.
3. Build retain, cross-check, re-baseline, isolate, and fallback-timing branches with explicit mission-risk tradeoffs.
4. Bind each recommendation to concrete SDA, timing-integrity, and navigation-assurance tools plus packetized outputs.

## Required Output Format

1. Situation snapshot.
2. Recommended timing-confidence branch and rationale.
3. Alternative branches with invalidation triggers.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Ephemeris/timing packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: ephemeris integrity ledger, timing-confidence ladder, and fallback synchronization matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-satellite-ephemeris-spoof-timing-confidence-v1` with `protocol_stack_id=ps-satellite-ephemeris-spoof-timing-confidence-stack-v1`.
- Alternate: independent ephemeris cross-check board plus terrestrial timing-fallback worksheet.
- Degraded: mission-essential timing windows only with conservative drift thresholds.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-EPHEMERIS-SPOOF-001` for critical recommendations.
- Prioritize these protocol families for this domain: `CCSDS`, `API/JSON`, `USMTF`, and signed timing manifests.
- Include source system, refresh UTC, confidence, cross-check status, and unresolved orbital-data gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run protocol and timing-assurance checks from `../_shared/references/us-joint-protocol-assurance-drill.md`.
- If ephemeris provenance, timing integrity, or fallback authority is uncertain, downgrade to advisory-only and require human command review.

## Guardrails

- Do not fabricate orbital confidence, timing stability, or safe employment of degraded PNT.
- Distinguish observed drift from confirmed adversary spoofing.
- Surface downstream risk to fires, airspace, SATCOM, and warning systems early.
