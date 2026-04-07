---
name: joint-space-launch-hazard-area-and-civil-warning-integration-cell
description: Synchronize launch or reentry hazard areas with civil marine, air, and public-warning channels when space operations intersect populated routes. Use when commanders need launch assurance without breaking civil-safety coordination.
---

# Joint Space Launch Hazard Area And Civil Warning Integration Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm launch windows, debris footprints, public-warning authorities, marine and air corridors, and commander decision timelines before producing recommendations.
- Keep outputs advisory-only by default and require explicit human command approval for branches that materially change hazard-release posture.

## Workflow

1. Frame the launch or reentry hazard geometry, public-warning pathways, and failure modes most exposed to delayed or conflicting alerts.
2. Build primary and alternate warning, corridor-closure, and launch-delay branches with explicit tradeoffs in mission tempo, public safety, and strategic signaling.
3. Bind each recommendation to concrete launch-control, civil-warning, and route-management tools plus packetized outputs.
4. Run authority, acknowledgment, and public-warning checks before publishing commander-facing recommendations.

## Required Output Format

1. Situation snapshot.
2. Recommended launch-warning branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Hazard-warning packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: hazard-area synchronization plan, civil warning acknowledgment ledger, and launch-window branch matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-space-launch-hazard-area-civil-warning-integration-v1` with `protocol_stack_id=ps-joint-space-launch-hazard-area-civil-warning-integration-stack-v1`.
- Alternate: manual hazard-area board plus protected civil-warning call tree.
- Degraded: launch hold or restricted corridor release only with manual maritime, aviation, and civil readback.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-SPACE-LAUNCH-HAZARD-CIVIL-WARNING-001` for critical recommendations.
- Prioritize these protocol families for this domain: `AIXM/FIXM`, `AIS/NMEA`, `CCSDS`, `EDXL-DE/CAP`, `API/JSON`, and `USMTF`.
- Include source system, refresh UTC, confidence, warning status, and unresolved footprint or acknowledgment gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run cross-source validation from `../_shared/references/mission-assurance-checklist.md`.
- If footprint confidence, public-warning authority, or civil acknowledgment is uncertain, downgrade to advisory-only and assign closure actions.

## Guardrails

- Do not fabricate debris footprints, FAA or harbor authority approvals, or public-warning reach.
- Separate observed launch-system facts from inferred political or public reaction.
- Surface treaty, range-safety, and public-trust consequences of warning delays early.
