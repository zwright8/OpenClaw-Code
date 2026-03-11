---
name: joint-autonomous-surface-resupply-lane-risk-governance-cell
description: Govern autonomous surface-resupply lane risk under contested maritime conditions. Use when uncrewed or minimally crewed logistics routes need safety, legal, and mission assurance controls.
---

# Joint Autonomous Surface Resupply Lane Risk Governance Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter operations.
- Confirm maritime authority boundaries, rules, and collision-risk tolerances.
- Keep recommendations advisory until approved by designated command authority.

## Workflow

1. Build a lane-risk picture: threat, weather, congestion, and vehicle health.
2. Compare routing branches by survivability, delivery reliability, and signature risk.
3. Define autonomy-governance checkpoints, human takeover triggers, and fail-safe behavior.
4. Publish synchronization plan with port, escort, and sustainment stakeholders.

## Required Output Format

1. Situation snapshot.
2. Recommended routing and governance branch.
3. Alternate/degraded branches.
4. Decision gates and authorities.
5. Staff actions and suspense.

## Domain Products

Primary products: lane risk ledger, autonomy authority matrix, resupply continuity timeline.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/us-joint-protocol-assurance-drill.md`.
- Use packet mappings from `../_shared/references/domain-tool-packet-library.md`.
- Bind suite/stack selections to `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-maritime-undersea-v1` with `protocol_stack_id=ps-geo-maritime-stack-v1`.
- Alternate: `tool_suite_id=ts-logistics-distribution-v1` with `protocol_stack_id=ps-maritime-harbor-restoration-stack-v1`.
- Degraded: convoy timing board + authenticated voice checkpoint acknowledgments.

## Guardrails

- Enforce explicit human decision gates for mission branches that raise escalation risk.
- If autonomy confidence drops below threshold, shift to constrained mode.
- Track custody and audit records for every major route decision.
