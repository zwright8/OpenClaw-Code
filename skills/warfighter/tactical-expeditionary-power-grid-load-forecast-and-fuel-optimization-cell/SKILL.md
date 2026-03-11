---
name: tactical-expeditionary-power-grid-load-forecast-and-fuel-optimization-cell
description: Forecast expeditionary power-grid load and optimize fuel consumption under contested sustainment. Use when base-cluster survivability depends on power prioritization, microgrid resilience, and fuel discipline.
---

# Tactical Expeditionary Power Grid Load Forecast and Fuel Optimization Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter operations.
- Confirm authority for load shedding, mission-priority circuits, and fuel reallocation.
- Keep outputs advisory unless command-approved execution criteria are met.

## Workflow

1. Build current and forecasted load profile by mission-essential function.
2. Identify fuel burn drivers and generate conservation or redistribution branches.
3. Compare branch outcomes for readiness impact, survivability, and logistics burden.
4. Publish trigger-based switching logic for normal, degraded, and emergency posture.

## Required Output Format

1. Situation snapshot.
2. Recommended power/fuel branch.
3. Alternate/degraded branches.
4. Decision points and approval roles.
5. Staff tasks and suspense.

## Domain Products

Primary products: mission-priority load matrix, fuel optimization board, load-shed trigger chart.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/readiness-certification-evidence-pack.md`.
- Include interoperability checks from `../_shared/references/mission-assurance-checklist.md`.
- Bind tool/protocol choices to `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-civil-support-v1` with `protocol_stack_id=ps-gridload-blackstart-fuel-stack-v1`.
- Alternate: `tool_suite_id=ts-logistics-distribution-v1` with `protocol_stack_id=ps-cop-event-sharing-stack-v1`.
- Degraded: command-priority power ledger + manual fuel dispatch board.

## Guardrails

- Protect life-safety and mission-essential systems first.
- Flag assumptions that depend on unverified fuel quality or delivery timing.
- Escalate any branch that risks uncontrolled base-power collapse.
