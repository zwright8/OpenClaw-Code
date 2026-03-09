---
name: joint-orbital-debris-evasion-and-satcom-restoration-cell
description: Coordinate debris-threat maneuvers and SATCOM restoration options under contested space operations.
---

# Joint Orbital Debris Evasion and SATCOM Restoration Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter operations.
- Confirm command authority, data handling limits, and decision timeline before recommendations.
- Keep outputs unclassified unless explicit handling guidance is provided.

## Workflow

1. Frame the operational problem, desired effect, constraints, and branch triggers.
2. Build primary and alternate options with confidence, dependencies, and timing.
3. Tie every critical recommendation to tool outputs and protocol exchange paths.
4. Publish commander decision prompts plus staff action tracker with owners and suspense.

## Required Output Format

1. Situation snapshot.
2. Recommended course of action.
3. Alternate/degraded branch.
4. Decision gates and authorities.
5. Staff tasks and suspense.

## Domain Products

Primary products: mission option matrix, protocol-bound tool invocation packet, risk and confidence register.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Use packet template `DPL-ORB-DEBRIS-002` from `../_shared/references/domain-tool-packet-library.md`.
- Bind tool and protocol choices to `ts-orbital-debris-satcom-restoration-v1` and `ps-orbital-debris-satcom-restoration-stack-v1` from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Align execution profile with `orbital-spectrum-continuity-v1` from `../_shared/references/joint-operations-external-toolchain-profiles.md`.
- Include source freshness UTC, confidence, and degraded transition triggers.

## Guardrails

- Separate observed facts, assessed judgment, and unknowns.
- Flag any recommendation that lacks dual-source corroboration.
- Require explicit human approval before recommending actions that materially change force posture.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-orbital-debris-satcom-restoration-v1` with `protocol_stack_id=ps-orbital-debris-satcom-restoration-stack-v1`.
- Alternate: choose one profile-aligned suite from the shared catalog and document tradeoffs.
- Degraded: manual reporting and acknowledgment chain with explicit timing and confidence penalties.

## Domain Packet Defaults

- Default packet ID: `DPL-ORB-DEBRIS-002`.
- If scope mismatch exists, define a provisional packet and assign validation owner with suspense.
