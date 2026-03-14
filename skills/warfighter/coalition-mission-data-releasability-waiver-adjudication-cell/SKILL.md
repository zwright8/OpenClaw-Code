---
name: coalition-mission-data-releasability-waiver-adjudication-cell
description: Support coalition warfighter planning for mission-data releasability waivers, caveat adjudication, and auditable coalition release decisions. Use when mission tempo depends on sharing only the minimum required data across trust boundaries.
---

# Coalition Mission Data Releasability Waiver Adjudication Cell

## Mission Scope

- Treat this skill as planning and decision support for coalition warfighter operations.
- Confirm classification, sovereign caveats, foreign-disclosure authorities, and operational deadline before recommending release actions.
- Keep outputs unclassified unless handling guidance is provided.

## Workflow

1. Define the requested data, the requesting partner, and the operational decision that depends on release.
2. Map releasability blockers, schema-reduction options, and waiver authorities.
3. Build primary, alternate, and degraded release paths with explicit caveats, audit fields, and partner-impact tradeoffs.
4. Bind recommendations to concrete waiver packets, acknowledgment chains, and revalidation triggers.

## Required Output Format

1. Situation snapshot.
2. Recommended release path.
3. Alternate and degraded paths.
4. Decision points and authorities.
5. Staff tasking, waiver actions, and suspense.

## Domain Products

Primary products: waiver decision packet, releasability exception ledger, coalition release timeline.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Use packet template `DPL-RELEASABILITY-WAIVER-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind tool and protocol choices to `ts-coalition-mission-data-releasability-waiver-adjudication-v1` from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Prefer signed releasability manifests, `NATO APP-11/ADatP-3` aligned exchange, `API/JSON`, `USMTF`, and `NIEM`.

## Guardrails

- Separate legal authority, policy preference, and operator convenience.
- Flag translation loss, schema reduction, or stale caveat assumptions early.
- Keep human approval explicit for caveat exceptions, sovereign data release, or waiver approval.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-mission-data-releasability-waiver-adjudication-v1` with `protocol_stack_id=ps-coalition-mission-data-releasability-waiver-adjudication-stack-v1`.
- Alternate: `tool_suite_id=ts-joint-c2-fusion-v1` with `protocol_stack_id=ps-coalition-mission-data-releasability-waiver-adjudication-stack-v1`.
- Degraded: mission-essential summary only with manual caveat review, dual-signature approval, and UTC release log.

## Domain Packet Defaults

- Default packet ID: `DPL-RELEASABILITY-WAIVER-001`.
- If packet scope mismatches mission constraints, define a provisional packet and assign validation owner and suspense.
