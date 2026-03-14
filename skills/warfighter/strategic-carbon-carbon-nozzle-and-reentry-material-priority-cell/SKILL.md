---
name: strategic-carbon-carbon-nozzle-and-reentry-material-priority-cell
description: Allocate carbon-carbon, ablatives, nozzle materials, and high-temperature composites across strategic missile, reentry, and space systems. Use when constrained thermal-protection materials shape readiness or deterrence timelines.
---

# Strategic Carbon-Carbon Nozzle and Reentry Material Priority Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter operations.
- Confirm strategic demand, certification boundaries, and material-release authority before recommending action.
- Keep outputs unclassified unless handling guidance is provided.

## Workflow

1. Define the material bottleneck, affected programs, and readiness priorities.
2. Pull pedigree records, furnace and layup capacity, and lot-release constraints from the selected toolchain.
3. Build primary, alternate, and degraded allocation paths with explicit certification and safety triggers.
4. Bind recommendations to authority gates, acknowledgment checks, and staff ownership.

## Required Output Format

1. Situation snapshot.
2. Recommended primary action path.
3. Alternate and degraded paths.
4. Decision points and authorities.
5. Staff tasking and suspense.

## Domain Products

Primary products: material allocation board, nozzle throughput ledger, strategic readiness risk ladder.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Use packet template `DPL-CARBON-CARBON-NOZZLE-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind tool and protocol choices to `ts-strategic-carbon-carbon-nozzle-reentry-material-priority-v1` from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Prefer signed material-cert manifests, `API/JSON`, `USMTF`, and `OPC UA` for machine-to-machine exchanges.

## Guardrails

- Separate observed pedigree and furnace status, assessed release confidence, and unknowns.
- Flag unverified material traceability, certification gaps, and any allocation that bypasses safety or quality release controls.
- Keep human approval explicit before reallocating certified lots across strategic programs.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-carbon-carbon-nozzle-reentry-material-priority-v1` with `protocol_stack_id=ps-strategic-carbon-carbon-nozzle-reentry-material-priority-stack-v1`.
- Alternate: `tool_suite_id=ts-strategic-supply-shock-v1` with `protocol_stack_id=ps-sanctioned-supply-substitution-denial-stack-v1`.
- Degraded: mission-essential lots only with manual pedigree review and conservative release thresholds.

## Domain Packet Defaults

- Default packet ID: `DPL-CARBON-CARBON-NOZZLE-001`.
- If packet scope mismatches mission constraints, define a provisional packet and assign validation owner and suspense.
