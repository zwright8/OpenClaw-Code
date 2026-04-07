---
name: joint-seabed-sensor-grid-cable-sabotage-hunt-cell
description: Hunt sabotage and restore confidence in seabed sensor grids and military undersea cables. Use when commanders need localization, response sequencing, and mission continuity under seabed attack.
---

# Joint Seabed Sensor Grid Cable Sabotage Hunt Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm threatened cable or sensor segments, protected waters, restoration authorities, and time-to-mission-loss before issuing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame suspected sabotage, affected sensor or cable nodes, and mission threads at risk.
2. Separate confirmed faults, suspected tamper indicators, environmental confounders, and unresolved gaps.
3. Build contain, localize, deceive, repair, and reroute branches with explicit tradeoffs in survivability, attribution confidence, and ISR degradation.
4. Bind each branch to seabed telemetry, ROV or AUV tasking, cable-fault localization, and maritime COP tools.
5. Publish staff actions, authority gates, and revalidation triggers tied to restoration progress.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternative branches with triggers.
4. Decision points now, next, and pre-delegated.
5. Staff task tracker with owners and suspense.
6. Seabed sabotage packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: seabed fault localization board, sensor coverage degradation map, repair-security synchronization matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-seabed-sensor-grid-cable-sabotage-hunt-v1` with `protocol_stack_id=ps-joint-seabed-sensor-grid-cable-sabotage-hunt-stack-v1`.
- Alternate: `tool_suite_id=ts-maritime-undersea-v1` with `protocol_stack_id=ps-undersea-datacenter-cable-defense-stack-v1`.
- Packet default: `packet_id=DPL-SEABED-SABOTAGE-HUNT-001`.
- Degraded: bearing-only contact board and manual maintenance-diversion ledger.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md`, `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, and `../_shared/references/domain-tool-packet-library.md`.
- Prioritize `OTH-Gold`, `AIS/NMEA`, `OGC`, `API/JSON`, signed maintenance manifests, and `USMTF`.
- Include source system, refresh UTC, cable or node pedigree, confidence, and repair-security assumptions in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- If attribution, sovereignty, or repair-right authority is uncertain, downgrade to advisory-only and require human command review.

## Guardrails

- Do not fabricate sabotage attribution, cable access rights, or repair-completion confidence.
- Distinguish deliberate sabotage from geohazard, maintenance error, and sensor calibration drift.
- Surface risk to warning, undersea ISR, and friendly maritime traffic safety early.
