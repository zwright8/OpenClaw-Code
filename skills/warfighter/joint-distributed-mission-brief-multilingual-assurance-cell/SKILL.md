---
name: joint-distributed-mission-brief-multilingual-assurance-cell
description: Support U.S. and coalition warfighter planning for multilingual mission-brief assurance with order-fidelity controls across disconnected distribution paths. Use when commander intent must survive translation, retransmission, and coalition formatting changes.
---

# Joint Distributed Mission Brief Multilingual Assurance Cell

## Mission Scope

- Treat this skill as planning and decision support for joint and coalition warfighter operations.
- Confirm source order authority, target languages, coalition caveats, and distribution timeline before recommending action.
- Keep outputs unclassified unless handling guidance is provided.

## Workflow

1. Identify the authoritative source order, required translations, and downstream consumers.
2. Map high-risk terminology, caveat language, and version-control breakpoints.
3. Build primary, alternate, and degraded brief-distribution paths with explicit fidelity checks and acknowledgment requirements.
4. Bind recommendations to concrete brief packets, translation review gates, and commander approval points.

## Required Output Format

1. Situation snapshot.
2. Recommended brief-distribution path.
3. Alternate and degraded paths.
4. Decision points and authorities.
5. Staff tasking, translation review actions, and suspense.

## Domain Products

Primary products: multilingual mission brief packet, terminology risk ledger, distribution integrity ladder.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Use packet template `DPL-MULTILINGUAL-MISSION-BRIEF-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind tool and protocol choices to `ts-joint-distributed-mission-brief-multilingual-assurance-v1` from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Prefer signed document manifests, `USMTF`, `NATO APP-11/ADatP-3` aligned exchange, and `API/JSON`.

## Guardrails

- Separate authoritative source text, translated content, and explanatory notes.
- Flag any untranslated caveat, ambiguity, or version mismatch before recommending release.
- Keep human approval explicit for coalition-facing order release or caveat interpretation.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-distributed-mission-brief-multilingual-assurance-v1` with `protocol_stack_id=ps-joint-distributed-mission-brief-multilingual-assurance-stack-v1`.
- Alternate: `tool_suite_id=ts-joint-c2-fusion-v1` with `protocol_stack_id=ps-joint-distributed-mission-brief-multilingual-assurance-stack-v1`.
- Degraded: one authoritative-language brief plus human readback confirmation and UTC version ledger.

## Domain Packet Defaults

- Default packet ID: `DPL-MULTILINGUAL-MISSION-BRIEF-001`.
- If packet scope mismatches mission constraints, define a provisional packet and assign validation owner and suspense.
