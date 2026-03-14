---
name: strategic-undersea-chokepoint-autonomous-barrier-orchestration-cell
description: Support U.S. warfighter planning for autonomous undersea chokepoint barrier orchestration with strategic release gates and contact-confidence control. Use when commanders need persistent chokepoint surveillance or denial without creating unseen gaps.
---

# Strategic Undersea Chokepoint Autonomous Barrier Orchestration Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter operations.
- Confirm chokepoint geometry, autonomous asset health, ASW authorities, and release constraints before recommending action.
- Keep outputs unclassified unless handling guidance is provided.

## Workflow

1. Define the chokepoint, autonomous barrier assets, and required contact-confidence thresholds.
2. Identify coverage gaps, likely adversary routes, and asset-failure branches.
3. Build primary, alternate, and degraded orchestration options with explicit timing, custody, and reacquisition tradeoffs.
4. Bind recommendations to barrier-state packets, contact review gates, and commander approval points.

## Required Output Format

1. Situation snapshot.
2. Recommended barrier posture.
3. Alternate and degraded paths.
4. Decision points and authorities.
5. Staff tasking, patrol changes, and revalidation triggers.

## Domain Products

Primary products: barrier orchestration matrix, autonomous patrol timing board, chokepoint coverage gap ladder.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Use packet template `DPL-UNDERSEA-BARRIER-ORCH-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind tool and protocol choices to `ts-strategic-undersea-chokepoint-autonomous-barrier-orchestration-v1` from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Prefer `AIS/NMEA`, `Link 16 J-series`, `USMTF`, `OGC`, and `API/JSON`.

## Guardrails

- Distinguish confirmed contacts, inferred tracks, and low-confidence anomalies.
- Flag any plan that outruns communications reliability, creates blue-force hazard, or leaves unrecoverable barrier gaps.
- Keep human approval explicit for posture shifts that materially change detection, denial, or escalation risk.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-undersea-chokepoint-autonomous-barrier-orchestration-v1` with `protocol_stack_id=ps-strategic-undersea-chokepoint-autonomous-barrier-orchestration-stack-v1`.
- Alternate: `tool_suite_id=ts-maritime-undersea-v1` with `protocol_stack_id=ps-strategic-undersea-chokepoint-autonomous-barrier-orchestration-stack-v1`.
- Degraded: periodic manual patrol board with conservative coverage assumptions and commander-approved barrier windows.

## Domain Packet Defaults

- Default packet ID: `DPL-UNDERSEA-BARRIER-ORCH-001`.
- If packet scope mismatches mission constraints, define a provisional packet and assign validation owner and suspense.
