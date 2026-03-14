---
name: theater-cross-domain-guard-schema-drift-and-message-loss-cell
description: Support U.S. warfighter planning for cross-domain guard schema-drift recovery and message-loss triage. Use when mission tempo depends on restoring trusted exchange across data diodes, guards, or mission-partner fabrics.
---

# Theater Cross Domain Guard Schema Drift And Message Loss Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter operations.
- Confirm affected source and destination enclaves, guard authorities, and mission threads that cannot tolerate message loss before recommending action.
- Keep outputs unclassified unless handling guidance is provided.

## Workflow

1. Build the current guard, schema, and message-flow picture with backlog and drop indicators.
2. Identify where transforms, version drift, or silent drops are breaking mission decisions.
3. Build primary, alternate, and degraded recovery paths with explicit replay, fallback, and authority tradeoffs.
4. Bind recommendations to cross-domain packets, checksum or replay checks, and approval gates.

## Required Output Format

1. Situation snapshot.
2. Recommended trust-restoration path.
3. Alternate and degraded paths.
4. Decision points and authorities.
5. Staff tasking, replay actions, and suspense.

## Domain Products

Primary products: schema drift exception packet, message-loss recovery board, trust-restoration timeline.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Use packet template `DPL-CROSS-DOMAIN-SCHEMA-DRIFT-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind tool and protocol choices to `ts-theater-cross-domain-guard-schema-drift-message-loss-v1` from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Prefer signed schema manifests, `XML/JSON`, `STIX/TAXII`, `API/JSON`, and `USMTF`.

## Guardrails

- Separate confirmed drops, suspected transform errors, and incomplete telemetry.
- Flag any workaround that bypasses releasability, audit, or cross-domain authority controls.
- Keep human approval explicit for replaying sensitive traffic, schema overrides, or manual message bridging.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-cross-domain-guard-schema-drift-message-loss-v1` with `protocol_stack_id=ps-theater-cross-domain-guard-schema-drift-message-loss-stack-v1`.
- Alternate: `tool_suite_id=ts-cyber-defense-v1` with `protocol_stack_id=ps-theater-cross-domain-guard-schema-drift-message-loss-stack-v1`.
- Degraded: critical-message manual relay only with UTC checksum log, dual-control approval, and replay board.

## Domain Packet Defaults

- Default packet ID: `DPL-CROSS-DOMAIN-SCHEMA-DRIFT-001`.
- If packet scope mismatches mission constraints, define a provisional packet and assign validation owner and suspense.
