---
name: strategic-semiconductor-test-burn-in-and-mission-priority-cell
description: Support U.S. warfighter planning for strategic semiconductor test, burn-in, and mission-priority release. Use when scarce screened components constrain weapons, space, communications, or sensing readiness.
---

# Strategic Semiconductor Test Burn In And Mission Priority Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter operations.
- Confirm lot pedigree, chamber capacity, screening status, and mission demand before recommending action.
- Keep outputs unclassified unless handling guidance is provided.

## Workflow

1. Build the current component, chamber, and screening picture with lot pedigree and queue state.
2. Identify the most mission-critical shortages, bottlenecks, and release blockers.
3. Build primary, alternate, and degraded allocation paths with explicit yield, safety, and readiness tradeoffs.
4. Bind recommendations to release packets, test-completion gates, and strategic approval points.

## Required Output Format

1. Situation snapshot.
2. Recommended screening and release path.
3. Alternate and degraded paths.
4. Decision points and authorities.
5. Staff tasking, lot actions, and suspense.

## Domain Products

Primary products: semiconductor release ladder, burn-in capacity board, mission-priority lot queue.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Use packet template `DPL-SEMICONDUCTOR-BURNIN-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind tool and protocol choices to `ts-strategic-semiconductor-test-burn-in-mission-priority-v1` from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Prefer signed lot manifests, `API/JSON`, `USMTF`, and `OPC UA`.

## Guardrails

- Separate verified pedigree, screened lots, and assumed yield.
- Flag any plan that shortcuts burn-in, radiation screening, or release authority for schedule reasons alone.
- Keep human approval explicit for reprioritizing lots away from other strategic missions.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-semiconductor-test-burn-in-mission-priority-v1` with `protocol_stack_id=ps-strategic-semiconductor-test-burn-in-mission-priority-stack-v1`.
- Alternate: `tool_suite_id=ts-strategic-supply-shock-v1` with `protocol_stack_id=ps-strategic-semiconductor-test-burn-in-mission-priority-stack-v1`.
- Degraded: mission-essential lots only with manual pedigree confirmation, narrowed screening queue, and UTC release board.

## Domain Packet Defaults

- Default packet ID: `DPL-SEMICONDUCTOR-BURNIN-001`.
- If packet scope mismatches mission constraints, define a provisional packet and assign validation owner and suspense.
