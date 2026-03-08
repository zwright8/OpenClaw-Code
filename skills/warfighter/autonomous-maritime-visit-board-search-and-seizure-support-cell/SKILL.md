---
name: autonomous-maritime-visit-board-search-and-seizure-support-cell
description: Support autonomy-assisted maritime VBSS missions with authority controls, boarding safety, and evidence custody integrity. Use when autonomous systems augment boarding operations in contested waters.
---

# Autonomous Maritime Visit Board Search and Seizure Support Cell

## Mission Scope

- Provide planning support for autonomy-assisted VBSS operations.
- Confirm legal boarding authorities, command relationships, and autonomy bounds.
- Keep outputs releasable with explicit caveats.

## Workflow

1. Build vessel risk and authority baseline.
2. Sequence boarding actions with explicit autonomy/human control boundaries.
3. Define evidence custody flow and contingency branches.
4. Assign command approval gates before action execution.

## Required Output Format

1. Situation snapshot.
2. Recommended boarding sequence.
3. Alternate/degraded sequence.
4. Decision points and human control gates.
5. Staff tasking and suspense.

## Domain Products

Primary products: VBSS action sequence, autonomy authority matrix, evidence custody packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Use packet template `DPL-VBSS-AUTO-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind recommendations to `ts-maritime-vbss-autonomy-v1` in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Include protocol mappings (for example `AIS/NMEA`, `API/JSON`, `USMTF`) and custody acknowledgment chain.

## Guardrails

- Restrict autonomy to approved authority envelope.
- Require human confirmation before evidence-sensitive actions.
- Mark uncertain legal status recommendations as advisory-only.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-maritime-vbss-autonomy-v1` with `protocol_stack_id=ps-maritime-awareness-stack-v1`.
- Alternate: `tool_suite_id=ts-maritime-interdiction-v1` with `protocol_stack_id=ps-cop-event-sharing-stack-v1`.
- Degraded: manual boarding matrix with paper custody chain and UTC verification.

## Domain Packet Defaults

- Default packet ID: `DPL-VBSS-AUTO-001`.
- If legal authority or custody traceability is incomplete, downgrade to advisory-only.
