---
name: strategic-semiconductor-test-burn-in-and-mission-priority-cell
description: Support U.S. warfighter planning for semiconductor test, burn-in, and mission-priority release when scarce screening capacity becomes the pacing constraint for strategic weapons, space, comms, and guidance demand.
---

# Strategic Semiconductor Test Burn-In And Mission Priority Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter operations.
- Confirm release authority, mission demand, chamber capacity, and pedigree requirements before recommending lot allocation actions.
- Keep outputs unclassified unless handling guidance is provided.

## Workflow

1. Establish lot pedigree, screening status, burn-in capacity, mission demand, and release thresholds.
2. Identify which lots or chambers create the largest readiness bottlenecks and where narrowed screening would create unacceptable risk.
3. Build primary, alternate, and degraded release paths with explicit throughput, pedigree, and mission-priority tradeoffs.
4. Bind recommendations to burn-in packets, release approvals, and chamber reallocation triggers.

## Required Output Format

1. Situation snapshot.
2. Recommended lot-release path.
3. Alternate and degraded paths.
4. Decision points and authorities.
5. Staff tasking, screening actions, and revalidation triggers.

## Domain Products

Primary products: semiconductor release ladder, burn-in capacity board, mission-priority lot queue.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Use packet template `DPL-SEMICONDUCTOR-BURNIN-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind tool and protocol choices to `ts-strategic-semiconductor-test-burn-in-mission-priority-v1` from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Prefer signed lot manifests, `API/JSON`, `USMTF`, and `OPC UA`.

## Guardrails

- Separate verified pedigree evidence, provisional screening results, and unknown field-risk implications.
- Flag any plan that bypasses required burn-in, environmental screening, or release-control evidence.
- Keep human approval explicit for narrowed screening, manual pedigree acceptance, or lot reprioritization across strategic missions.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-semiconductor-test-burn-in-mission-priority-v1` with `protocol_stack_id=ps-strategic-semiconductor-test-burn-in-mission-priority-stack-v1`.
- Alternate: `tool_suite_id=ts-strategic-supply-shock-v1` with `protocol_stack_id=ps-strategic-semiconductor-test-burn-in-mission-priority-stack-v1`.
- Degraded: mission-essential lots only with manual pedigree confirmation and narrowed environmental screening.

## Domain Packet Defaults

- Default packet ID: `DPL-SEMICONDUCTOR-BURNIN-001`.
- If packet scope mismatches mission constraints, define a provisional packet and assign validation owner and suspense.
