---
name: expeditionary-battle-damaged-aircraft-recovery-and-cannibalization-cell
description: Orchestrate recovery, airworthiness triage, and controlled cannibalization of battle-damaged aircraft. Use when sortie generation depends on salvaging damaged airframes without breaking safety or configuration control.
---

# Expeditionary Battle-Damaged Aircraft Recovery and Cannibalization Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter operations.
- Confirm aircraft types, damage state, recovery windows, and maintenance authority before recommending action.
- Keep outputs unclassified unless handling guidance is provided.

## Workflow

1. Define the aircraft recovery problem, damage categories, and sortie regeneration priorities.
2. Pull battle-damage assessments, parts availability, and airworthiness constraints from the selected toolchain.
3. Build primary, alternate, and degraded recovery or cannibalization paths with explicit safety and configuration triggers.
4. Bind recommendations to maintenance release authority, custody controls, and staff ownership.

## Required Output Format

1. Situation snapshot.
2. Recommended primary action path.
3. Alternate and degraded paths.
4. Decision points and authorities.
5. Staff tasking and suspense.

## Domain Products

Primary products: aircraft recovery board, cannibalization authorization ladder, sortie regeneration matrix.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Use packet template `DPL-BATTLE-DAMAGED-AIRCRAFT-RECOVERY-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind tool and protocol choices to `ts-expeditionary-battle-damaged-aircraft-recovery-cannibalization-v1` from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Prefer `AIXM/FIXM`, signed maintenance manifests, `API/JSON`, and `USMTF` for machine-to-machine exchanges.

## Guardrails

- Separate observed damage, assessed repairability, and unknowns.
- Flag missing custody records, unverified structural assumptions, and any cannibalization plan that outruns maintenance release authority.
- Keep human airworthiness approval explicit before flight or cross-fleet parts release.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-expeditionary-battle-damaged-aircraft-recovery-cannibalization-v1` with `protocol_stack_id=ps-expeditionary-battle-damaged-aircraft-recovery-cannibalization-stack-v1`.
- Alternate: `tool_suite_id=ts-airfield-recovery-v1` with `protocol_stack_id=ps-joint-tactical-link-stack-v1`.
- Degraded: local maintenance board, paper forms, and authenticated voice release chain.

## Domain Packet Defaults

- Default packet ID: `DPL-BATTLE-DAMAGED-AIRCRAFT-RECOVERY-001`.
- If packet scope mismatches mission constraints, define a provisional packet and assign validation owner and suspense.
