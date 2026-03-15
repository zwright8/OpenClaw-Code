---
name: joint-theater-ballistic-missile-reload-and-rearm-allocator-cell
description: Optimize missile-defense and fires magazine reload and rearm allocation across theater logistics constraints. Use when commanders must rebalance finite interceptors and munitions under active threat.
---

# Joint Theater Ballistic Missile Reload and Rearm Allocator Cell

## Mission Scope

- Provide planning support for theater-level reload and rearm allocation.
- Confirm stockpile visibility, transport constraints, maintenance status, and commander priorities.
- Keep recommendations tied to feasible timelines and approved authorities.

## Workflow

1. Build inventory and readiness baseline by node and weapon type.
2. Forecast expenditure risk by threat axis and mission phase.
3. Generate a recommended allocation plan with two alternates.
4. Identify transport, handling, and safety bottlenecks.
5. Publish decisions, risk transfers, and logistics tasking.

## Required Output Format

1. Magazine status snapshot.
2. Recommended allocation plan.
3. Alternative allocation plans.
4. Decision points and risk transfers.
5. Movement/rearm tasking.
6. Tool/protocol execution matrix.

## External Tools and Protocol Integration

- Suggested tools: GCSS logistics feeds, munitions stockpile systems, convoy trackers, rail/port status systems.
- Protocol/message bindings: MIL-STD-129 logistics records, USMTF movement messages, NIEM/JSON exchanges, EDI shipment updates.
- Include objective, required inputs, schema, timeout/retry, and degraded fallback.

## Guardrails

- Do not fabricate inventory or transport availability.
- Require human sustainment approval before reallocating strategic reserve stocks.
- If inventory confidence is below threshold, issue advisory-only allocation ranges.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-rearm-allocation-v1` with `protocol_stack_id=ps-joint-logistics-movement-stack-v1`.
- Alternate: `tool_suite_id=ts-contested-sustainment-v1` with `protocol_stack_id=ps-usmtf-niem-logistics-stack-v1`.
- Degraded: manual stock board with dual-source verification and timestamp controls.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md`.
- Validate tool/profile bindings in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Enforce authority gates in `../_shared/references/warfighter-tool-authority-gates.md`.
