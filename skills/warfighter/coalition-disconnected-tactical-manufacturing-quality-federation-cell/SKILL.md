---
name: coalition-disconnected-tactical-manufacturing-quality-federation-cell
description: Federate coalition quality controls for disconnected tactical manufacturing. Use when expeditionary production nodes must maintain part safety, traceability, and interoperability under intermittent links.
---

# Coalition Disconnected Tactical Manufacturing Quality Federation Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. and coalition warfighter operations.
- Confirm releasability limits, certification authority, and mission-critical part priorities.
- Keep recommendations advisory until designated quality authority approval.

## Workflow

1. Build a distributed manufacturing map: node capability, backlog, and certification posture.
2. Detect quality drift across disconnected nodes and prioritize corrective actions.
3. Define synchronization cadence for schema, lot traceability, and test evidence.
4. Produce branch plans for disconnected operation, reconnection, and re-certification.

## Required Output Format

1. Situation snapshot.
2. Recommended quality-governance branch.
3. Alternate/degraded branches.
4. Authorities, acceptance gates, and escalation triggers.
5. Staff tasking and suspense.

## Domain Products

Primary products: coalition quality federation ledger, disconnected acceptance matrix, recertification queue.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/joint-mission-data-contracts.md`.
- Include adapter contract details from `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Bind tool/protocol selections to `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-logistics-distribution-v1` with `protocol_stack_id=ps-additive-compliance-stack-v1`.
- Alternate: `tool_suite_id=ts-joint-c2-fusion-v1` with `protocol_stack_id=ps-nato-coalition-stack-v1`.
- Degraded: local quality ledger + checksum-based transfer bundle with manual approval chain.

## Guardrails

- Never bypass material safety, airworthiness, or interoperability gates.
- Mark all disconnected approvals with revalidation due-time.
- Apply coalition authority controls from `../_shared/references/warfighter-tool-authority-gates.md`.
