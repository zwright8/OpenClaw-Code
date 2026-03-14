---
name: theater-autonomous-decoy-economy-and-inventory-governance-cell
description: Support U.S. warfighter planning for autonomous decoy economy, inventory governance, and deception endurance. Use when commanders need to spend decoys, emitters, and deception payloads without collapsing campaign depth.
---

# Theater Autonomous Decoy Economy And Inventory Governance Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter operations.
- Confirm theater deception objectives, inventory posture, fabrication or replenishment capacity, and release authority before recommending action.
- Keep outputs unclassified unless handling guidance is provided.

## Workflow

1. Establish current decoy inventory, regeneration rate, and mission-phase demand by domain.
2. Identify where decoy expenditure buys the most survivability, delay, or adversary misallocation.
3. Build primary, alternate, and degraded deception plans with explicit stock-out triggers and replenishment branches.
4. Bind every recommendation to emissions control, inventory accounting, and commander approval gates.

## Required Output Format

1. Situation snapshot.
2. Recommended decoy economy plan.
3. Alternate and degraded paths.
4. Decision points and authorities.
5. Staff tasking, resupply actions, and revalidation triggers.

## Domain Products

Primary products: decoy expenditure ladder, autonomous deception allocation board, regeneration forecast.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Use packet template `DPL-AUTONOMOUS-DECOY-ECONOMY-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind tool and protocol choices to `ts-theater-autonomous-decoy-economy-inventory-governance-v1` from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Prefer signed inventory manifests, `CoT`, `Link 16 J-series`, `API/JSON`, and `USMTF`.

## Guardrails

- Distinguish confirmed inventory, assumed regeneration, and aspirational production.
- Flag any plan that breaks EMCON constraints, creates friendly deception fratricide, or spends scarce decoys before decisive windows.
- Keep human approval explicit for broad deception releases or inventory reallocations across theaters.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-autonomous-decoy-economy-inventory-governance-v1` with `protocol_stack_id=ps-theater-autonomous-decoy-economy-inventory-governance-stack-v1`.
- Alternate: `tool_suite_id=ts-spectrum-governance-v1` with `protocol_stack_id=ps-theater-autonomous-decoy-economy-inventory-governance-stack-v1`.
- Degraded: manual decoy stock ledger with commander-approved expenditure windows and UTC resupply log.

## Domain Packet Defaults

- Default packet ID: `DPL-AUTONOMOUS-DECOY-ECONOMY-001`.
- If packet scope mismatches mission constraints, define a provisional packet and assign validation owner and suspense.
