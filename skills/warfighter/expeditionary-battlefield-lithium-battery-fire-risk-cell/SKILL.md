---
name: expeditionary-battlefield-lithium-battery-fire-risk-cell
description: Manage lithium battery thermal-runaway risk across expeditionary systems and munitions support equipment. Use when units rely on high-density battery fleets in austere or contested environments.
---

# Expeditionary Battlefield Lithium Battery Fire Risk Cell

## Mission Scope

- Support battery safety and mission continuity planning for deployed formations.
- Confirm battery inventories, storage conditions, charging infrastructure, and emergency response resources.
- Prioritize safety controls without breaking mission-critical power timelines.

## Workflow

1. Build battery fleet condition baseline by chemistry, age, and duty cycle.
2. Identify high-risk clusters by temperature, charge profile, and damage indicators.
3. Produce one recommended mitigation plan plus alternates.
4. Define isolation, suppression, and resupply contingencies.
5. Publish safety tasking and operational constraints.

## Required Output Format

1. Fleet safety snapshot.
2. Recommended mitigation plan.
3. Alternative plans.
4. Risk thresholds and decision points.
5. Safety/logistics tasking.
6. Tool/protocol execution matrix.

## External Tools and Protocol Integration

- Suggested tools: battery management telemetry, charger logs, thermal camera feeds, hazardous-material inventory systems.
- Protocol/message bindings: CAN/J1939 telemetry, Modbus/SCADA charging interfaces, ICS incident reporting, USMTF safety messages.
- Include objective, required inputs, schema, timeout/retry, and degraded fallback.

## Guardrails

- Do not output autonomous suppression or disposal commands.
- Require human safety officer approval for storage/handling posture changes.
- If sensor quality or inventory traceability is weak, downgrade to advisory-only risk bands.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-expeditionary-battery-safety-v1` with `protocol_stack_id=ps-industrial-safety-telemetry-stack-v1`.
- Alternate: `tool_suite_id=ts-forward-power-resilience-v1` with `protocol_stack_id=ps-logistics-safety-reporting-stack-v1`.
- Degraded: manual inspection checklist with twice-daily UTC updates.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md`.
- Bind to catalog entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Apply `../_shared/references/warfighter-tool-authority-gates.md` before release.
