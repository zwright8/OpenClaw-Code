---
name: strategic-guidance-seeker-imu-and-accelerometer-priority-cell
description: Allocate scarce seekers, inertial measurement units, accelerometers, and screening capacity across precision munitions and strategic weapons. Use when component shortages shape operational readiness or release confidence.
---

# Strategic Guidance Seeker IMU and Accelerometer Priority Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter operations.
- Confirm demand signal, certification boundaries, and release authority before recommending action.
- Keep outputs unclassified unless handling guidance is provided.

## Workflow

1. Define the component bottleneck, affected weapon families, and readiness priorities.
2. Pull pedigree data, environmental screening capacity, and lot-release constraints from the selected toolchain.
3. Build primary, alternate, and degraded allocation paths with explicit certification and safety triggers.
4. Bind recommendations to authority gates, acknowledgment checks, and staff ownership.

## Required Output Format

1. Situation snapshot.
2. Recommended primary action path.
3. Alternate and degraded paths.
4. Decision points and authorities.
5. Staff tasking and suspense.

## Domain Products

Primary products: seeker allocation board, inertial-component risk ladder, lot release priorities.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Use packet template `DPL-GUIDANCE-SEEKER-IMU-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind tool and protocol choices to `ts-strategic-guidance-seeker-imu-accelerometer-priority-v1` from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Prefer signed component manifests, `API/JSON`, `USMTF`, and `OPC UA` for machine-to-machine exchanges.

## Guardrails

- Separate observed pedigree and screening status, assessed release confidence, and unknowns.
- Flag missing component traceability, unverified environmental-test assumptions, and any allocation that bypasses lot certification controls.
- Keep human approval explicit before reallocating seekers or inertial components across high-consequence weapons programs.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-guidance-seeker-imu-accelerometer-priority-v1` with `protocol_stack_id=ps-strategic-guidance-seeker-imu-accelerometer-priority-stack-v1`.
- Alternate: `tool_suite_id=ts-strategic-supply-shock-v1` with `protocol_stack_id=ps-sanctioned-supply-substitution-denial-stack-v1`.
- Degraded: mission-essential lots only with manual pedigree verification and conservative release thresholds.

## Domain Packet Defaults

- Default packet ID: `DPL-GUIDANCE-SEEKER-IMU-001`.
- If packet scope mismatches mission constraints, define a provisional packet and assign validation owner and suspense.
