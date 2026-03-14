---
name: joint-ground-robotics-teleoperation-spectrum-safety-cell
description: Control teleoperated ground robots when link margin, spectrum contention, or autonomy fallback threatens engineer or EOD missions. Use when ground robots need safe command paths in contested electromagnetic environments.
---

# Joint Ground Robotics Teleoperation Spectrum Safety Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter operations.
- Confirm mission authority, robot classes, spectrum ownership, and fallback behaviors before recommending action.
- Keep outputs unclassified unless handling guidance is provided.

## Workflow

1. Define the teleoperation problem, robot tasks, and electromagnetic constraints.
2. Pull link health, control latency, spectrum assignments, and fallback state from the selected toolchain.
3. Build primary, alternate, and degraded control paths with explicit lost-link and fratricide triggers.
4. Bind recommendations to safety release authority, acknowledgment checks, and staff ownership.

## Required Output Format

1. Situation snapshot.
2. Recommended primary action path.
3. Alternate and degraded paths.
4. Decision points and authorities.
5. Staff tasking and suspense.

## Domain Products

Primary products: teleop-control matrix, spectrum-safe task windows, lost-link fallback ladder.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Use packet template `DPL-GROUND-ROBOTICS-TELEOP-SPECTRUM-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind tool and protocol choices to `ts-joint-ground-robotics-teleoperation-spectrum-safety-v1` from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Prefer `CoT`, `VMF`, `DDS/ROS 2`, `API/JSON`, and `USMTF` for machine-to-machine exchanges.

## Guardrails

- Separate observed link health, assessed control safety, and unknowns.
- Flag unverified spectrum assignments, autonomy fallbacks with unclear authority, and any plan that outruns lost-link recovery.
- Keep human approval explicit before switching to autonomous fallback or entering a contested spectrum lane.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-ground-robotics-teleoperation-spectrum-safety-v1` with `protocol_stack_id=ps-joint-ground-robotics-teleoperation-spectrum-safety-stack-v1`.
- Alternate: `tool_suite_id=ts-spectrum-governance-v1` with `protocol_stack_id=ps-ew-spectrum-priority-stack-v1`.
- Degraded: line-of-sight teleoperation only with human spotter chain and manual spectrum hold points.

## Domain Packet Defaults

- Default packet ID: `DPL-GROUND-ROBOTICS-TELEOP-SPECTRUM-001`.
- If packet scope mismatches mission constraints, define a provisional packet and assign validation owner and suspense.
