---
name: coalition-denied-environment-digital-map-rights-and-provenance-cell
description: Support coalition warfighter planning for denied-environment digital map rights and provenance assurance. Use when map-layer trust, coalition release rights, or stale geospatial updates could distort movement, fires, or partner coordination.
---

# Coalition Denied-Environment Digital Map Rights And Provenance Cell

## Mission Scope

- Treat this skill as planning and decision support for coalition warfighter operations.
- Confirm coalition geospatial rights, update latency, releasability constraints, and safety-critical map layers before recommending action.
- Keep outputs unclassified unless handling guidance is provided.

## Workflow

1. Establish the current map-layer set, rights metadata, provenance evidence, and denied-update gaps.
2. Identify which stale or untrusted layers could mislead maneuver, fires, targeting, or partner coordination.
3. Build primary, alternate, and degraded update-release paths with explicit rights, confidence, and timing tradeoffs.
4. Bind recommendations to geospatial packets, coalition release acknowledgments, and revalidation deadlines.

## Required Output Format

1. Situation snapshot.
2. Recommended map-release path.
3. Alternate and degraded paths.
4. Decision points and authorities.
5. Staff tasking, release actions, and revalidation triggers.

## Domain Products

Primary products: rights adjudication matrix, provenance confidence board, update release plan.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Use packet template `DPL-MAP-PROVENANCE-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind tool and protocol choices to `ts-coalition-denied-environment-digital-map-rights-and-provenance-cell-v1` from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Prefer `OGC WMS/WFS/WMTS`, `NIEM`, `NATO APP-11/ADatP-3` aligned exchange, and `API/JSON`.

## Guardrails

- Separate confirmed rights and provenance evidence from inferred lineage and unknowns.
- Flag any layer release that affects navigation, fires safety, or coalition trust without explicit confidence caveats.
- Keep human approval explicit for coalition layer release, rollback, or rights-waiver decisions.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-denied-environment-digital-map-rights-and-provenance-cell-v1` with `protocol_stack_id=ps-coalition-denied-environment-digital-map-rights-and-provenance-cell-stack-v1`.
- Alternate: `tool_suite_id=ts-geospatial-datum-integrity-v1` with `protocol_stack_id=ps-coalition-denied-environment-digital-map-rights-and-provenance-cell-stack-v1`.
- Degraded: safety-critical map layers only with explicit provenance caveats and manual coalition readback.

## Domain Packet Defaults

- Default packet ID: `DPL-MAP-PROVENANCE-001`.
- If packet scope mismatches mission constraints, define a provisional packet and assign validation owner and suspense.
