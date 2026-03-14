---
name: theater-dynamic-no-strike-geofence-drift-and-integrity-cell
description: Detect and govern drift in dynamic no-strike and restricted-target geofences. Use when commanders need confidence that targeting, airspace, and fires systems still honor approved protected boundaries.
---

# Theater Dynamic No-Strike Geofence Drift And Integrity Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm approved no-strike lists, protected sites, update cadence, and target-release authorities before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the protected geofences, source authorities, update path, and mission systems consuming the boundaries.
2. Detect drift, stale replication, datum mismatch, or rule-engine conflicts that could invalidate protected-zone integrity.
3. Build hold, reconcile, reissue, and manual-approval branches with explicit risk-to-civilians and risk-to-mission tradeoffs.
4. Bind each recommendation to targeting, geospatial, and command-approval tools plus packetized outputs.

## Required Output Format

1. Situation snapshot.
2. Recommended integrity branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Geofence assurance packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: no-strike geofence integrity board, protected-boundary drift ledger, and release-hold recommendation matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-no-strike-geofence-integrity-v1` with `protocol_stack_id=ps-theater-no-strike-geofence-integrity-stack-v1`.
- Alternate: manual protected-target overlay plus commander-approved hold-fire board.
- Degraded: no-dynamic-update posture with human-only protected-boundary release.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-NO-STRIKE-GEOFENCE-001` for critical recommendations.
- Prioritize these protocol families for this domain: `VMF`, `USMTF`, `OGC`, and `API/JSON`.
- Include source system, refresh UTC, confidence, geospatial datum notes, and unresolved protection gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run interoperability and targeting-assurance checks from `../_shared/references/mission-assurance-checklist.md`.
- If boundary provenance, protected-site update authority, or acknowledgment integrity is uncertain, downgrade to advisory-only and require human command review.

## Guardrails

- Do not fabricate no-strike authorities, geofence freshness, or safe-to-fire determinations.
- Separate confirmed boundary drift from suspected system mismatch.
- Prioritize civilian-protection and law-of-war compliance over tempo when integrity is uncertain.
