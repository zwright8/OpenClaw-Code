---
name: theater-electronic-warfare-range-safety-and-deconfliction-cell
description: Coordinate EW range operations with safety gates and spectrum deconfliction controls. Use when high-tempo EW testing or rehearsal must avoid fratricide, unsafe exposure, and mission-system interference.
---

# Theater Electronic Warfare Range Safety and Deconfliction Cell

## Mission Scope

- Support theater-level EW range governance and safe execution.
- Confirm range authorities, safety standards, and protected-system constraints.
- Keep products unclassified unless handling guidance requires otherwise.

## Workflow

1. Build event timeline and emitter inventory baseline.
2. Assess spectrum conflicts, safety corridors, and protected-node impacts.
3. Produce primary and alternate scheduling with release/hold gates.
4. Establish degraded-mode procedures and authority checkpoints.

## Required Output Format

1. Situation snapshot.
2. Recommended range schedule and safety posture.
3. Alternate schedule/degraded option.
4. Decision points and authority triggers.
5. Staff tasking and suspense.

## Domain Products

Primary products: EW deconfliction matrix, safety gate checklist, release/hold timeline.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/us-joint-protocol-assurance-drill.md`.
- Use packet template `DPL-EW-RANGE-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind recommendations to `ts-ew-range-safety-v1` in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Include protocol mappings (for example `VMF`, `API/JSON`, `USMTF`) and interop gate results.

## Guardrails

- Do not approve release windows without fratricide-spectrum checks.
- Elevate safety uncertainty to no-go or constrained-employment recommendations.
- Require command authorization records for all high-power emission windows.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-ew-range-safety-v1` with `protocol_stack_id=ps-joint-spectrum-management-stack-v1`.
- Alternate: `tool_suite_id=ts-spectrum-governance-v1` with `protocol_stack_id=ps-cop-event-sharing-stack-v1`.
- Degraded: fixed low-risk emission windows with manual safety checks.

## Domain Packet Defaults

- Default packet ID: `DPL-EW-RANGE-001`.
- If safety gates fail, output must be `NO-GO` with corrective actions.
