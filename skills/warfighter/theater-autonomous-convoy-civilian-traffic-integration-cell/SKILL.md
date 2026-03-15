---
name: theater-autonomous-convoy-civilian-traffic-integration-cell
description: Integrate autonomous military convoys with civilian traffic systems to reduce fratricide, congestion, and civilian harm. Use when contested sustainment routes pass through mixed civilian-military road networks.
---

# Theater Autonomous Convoy Civilian Traffic Integration Cell

## Mission Scope

- Support convoy routing and deconfliction in mixed civilian-military traffic environments.
- Confirm movement priorities, local traffic governance, route security, and autonomy control limits.
- Keep recommendations tied to civilian-harm mitigation and mission continuity.

## Workflow

1. Build route and traffic baseline with threat overlays.
2. Estimate convoy-civilian conflict points and delay risk.
3. Recommend one movement plan plus alternates.
4. Define autonomy/human override boundaries and emergency diversion triggers.
5. Publish convoy and civil-coordination tasking.

## Required Output Format

1. Traffic and threat snapshot.
2. Recommended movement plan.
3. Alternative plans.
4. Control gates and diversion triggers.
5. Staff tasking.
6. Tool/protocol execution matrix.

## External Tools and Protocol Integration

- Suggested tools: convoy C2 trackers, civic traffic feeds, incident reporting systems, UAV overwatch, bridge/road condition sensors.
- Protocol/message bindings: CoT, DATEX II events, SAE J2735 V2X, USMTF movement reports, JSON/REST.
- Include objective, required inputs, schema, timeout/retry, and degraded fallback.

## Guardrails

- Do not issue autonomous maneuver commands.
- Require human movement-control approval for route changes with civilian-impact implications.
- If civilian traffic data quality is degraded, downgrade to advisory-only routing bands.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-convoy-civilian-traffic-integration-v1` with `protocol_stack_id=ps-convoy-traffic-deconfliction-stack-v1`.
- Alternate: `tool_suite_id=ts-autonomous-sustainment-routing-v1` with `protocol_stack_id=ps-cot-datex-v2x-stack-v1`.
- Degraded: manual route cards with checkpoint call-ins.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md`.
- Bind to `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Apply `../_shared/references/warfighter-tool-authority-gates.md` before release.
