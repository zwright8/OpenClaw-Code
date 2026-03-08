---
name: coalition-undersea-critical-infrastructure-repair-convoy-cell
description: Support U.S. and coalition warfighter planning for undersea infrastructure repair convoy protection. Use when cable, pipeline, or seabed node restoration must be synchronized with maritime threat posture.
---

# Coalition Undersea Critical Infrastructure Repair Convoy Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Start by confirming echelon, operating environment, available authorities, time horizon, and required decision points.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem with domain indicators, commander priorities, and branch triggers.
2. Identify assumptions, decision thresholds, and invalidation signals.
3. Build primary and alternate options with explicit tradeoffs in tempo, survivability, sustainment burden, and escalation risk.
4. Integrate dependencies across C2, intelligence, fires/effects, sustainment, protection, legal constraints, and coalition interoperability.
5. Produce commander-facing outputs and a staff-action plan with owners, suspense dates, and triggers.

## Required Output Format

1. Situation snapshot.
2. Recommended option.
3. Alternative options.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.

## Domain Products

Primary products for this skill: undersea repair convoy timeline, seabed restoration prioritization matrix, escort risk board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-undersea-repair-convoy-v1` with `protocol_stack_id=ps-maritime-undersea-coordination-stack-v1`.
- Alternate: `tool_suite_id=ts-maritime-undersea-v1` with `protocol_stack_id=ps-maritime-chokepoint-closure-stack-v1`.
- Degraded: use authenticated voice/readback + UTC acknowledgment ledger + manual fallback board.

## External Tool Stack and Protocols

- Preferred tools: mission-domain planners, operational dashboards, independent cross-check analytics, and command-approved audit ledgers.
- Preferred protocol families: USMTF, API/JSON, Link 16 J-series, NATO APP-11/ADatP-3 where coalition exchange is required.
- Bind recommendations to concrete suite/stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Use protocol packets in `../_shared/references/tool-protocol-playbooks.md` and `../_shared/references/domain-tool-packet-library.md`.
- Include provenance fields: source system, refresh UTC, confidence, and key gaps.

## Domain Packet Defaults

- Default packet IDs: DPL-UNDERSEA-REPAIR-001, DPL-POLAR-CABLE-001.
- If no packet fully matches, define a provisional packet using the shared schema and assign a validation owner.

## Tool Invocation Contract

- For each critical dependency include: objective, required inputs, query/action template, expected output schema, protocol/transport, and fallback path.
- Map each tool output to a commander decision point and a staff task with suspense.
- If confidence drops below mission threshold, mark recommendations `provisional` and issue a degraded-mode branch.

## Authority and Assurance Gates

- Apply approval and escalation requirements from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run protocol conformance checks from `../_shared/references/us-joint-protocol-assurance-drill.md` before high-impact recommendations.
- If authority, legal basis, or acknowledgment integrity is uncertain, downgrade to advisory-only with explicit commander prompts.

## Domain Toolchain Override (2026-03-08, Under-Ice Attribution Expansion)

- Elevate `tool_suite_id=ts-underice-forensics-v1` with `protocol_stack_id=ps-maritime-undersea-coordination-stack-v1` when sabotage likelihood exceeds baseline anomaly thresholds.
- Use packet `DPL-UNDERICE-ATTR-001` to bind attribution confidence, restoration sequencing, and evidence custody fields.
- If independent anomaly confirmation fails, downgrade to provisional recovery guidance and require command/interagency review.

## Domain Toolchain Override (2026-03-08, Seabed Grid Sustainment Expansion)

- Elevate `tool_suite_id=ts-seabed-grid-sustainment-v1` when convoy timing is constrained by degraded seabed sensing coverage.
- Use packet `DPL-SEABED-GRID-001` to synchronize sensor redeployment, escort posture, and repair-vessel sequencing.
- If coverage-gap confidence exceeds mission threshold, restrict convoy windows and require commander acceptance before execution.
