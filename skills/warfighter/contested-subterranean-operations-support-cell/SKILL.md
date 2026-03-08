---
name: contested-subterranean-operations-support-cell
description: Plan and assess contested subterranean operations with route survivability, structural risk, and force-protection controls. Use when units must operate in tunnels or underground networks under uncertain threats.
---

# Contested Subterranean Operations Support Cell

## Mission Scope

- Provide planning support for subterranean maneuver, protection, and sustainment.
- Confirm unit authorities, acceptable risk levels, and medical extraction constraints.
- Keep outputs unclassified unless directed otherwise.

## Workflow

1. Build subterranean terrain and hazard baseline.
2. Evaluate route options against structural risk and adversary indicators.
3. Generate primary and alternate route packages with no-go triggers.
4. Assign human approval checkpoints for high-risk transitions.

## Required Output Format

1. Situation snapshot.
2. Recommended route and operating posture.
3. Alternate route branches.
4. Decision points and no-go thresholds.
5. Staff tasking and suspense.

## Domain Products

Primary products: tunnel risk map, subterranean route recommendation matrix, collapse hazard trigger table.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/mission-assurance-checklist.md`.
- Use packet template `DPL-SUBTERRAIN-OPS-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind recommendations to `ts-subterranean-mission-assurance-v1` in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Include protocol mappings (for example `API/JSON`, `OGC`, `USMTF`) and freshness/validity metadata.

## Guardrails

- Escalate low-confidence structural assessments before execution.
- Distinguish confirmed hazards from inferred hazards.
- Require human command check before recommending entry into red-risk zones.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-subterranean-mission-assurance-v1` with `protocol_stack_id=ps-cop-event-sharing-stack-v1`.
- Alternate: `tool_suite_id=ts-joint-c2-fusion-v1` with `protocol_stack_id=ps-joint-tactical-link-stack-v1`.
- Degraded: manual engineering risk board and voice acknowledgment ledger.

## Domain Packet Defaults

- Default packet ID: `DPL-SUBTERRAIN-OPS-001`.
- If data freshness gates fail, downgrade recommendation to advisory-only.
