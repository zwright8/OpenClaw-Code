---
name: joint-space-weather-effects-on-precision-strike-cell
description: Assess and mitigate space-weather effects on precision-strike kill chains. Use when solar/geomagnetic disturbances may degrade timing, navigation, communication, or sensor reliability during strike operations.
---

# Joint Space Weather Effects on Precision Strike Cell

## Mission Scope

- Provide decision support for strike planners and commanders under space-weather stress.
- Confirm strike authorities, acceptable timing risk, and data confidence thresholds.
- Keep outputs unclassified unless mission handling guidance changes.

## Workflow

1. Fuse space-weather forecasts with platform dependency maps.
2. Estimate degradation impacts on timing, navigation, and comms.
3. Build recommended strike timing and mitigation branches.
4. Identify approval points for constrained or delayed execution.

## Required Output Format

1. Situation snapshot.
2. Recommended strike timing posture.
3. Alternate/degraded strike windows.
4. Decision points and authority checks.
5. Staff tasking and suspense.

## Domain Products

Primary products: strike-risk overlay, adjusted timing windows, mitigation branch matrix.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-health-and-trust-monitoring.md`.
- Use packet template `DPL-SPACE-WX-STRIKE-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind recommendations to `ts-space-weather-strike-assurance-v1` in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Include protocol mappings (for example `API/JSON`, `USMTF`, `Link 16 J-series`) and trust/freshness metadata.

## Guardrails

- Do not collapse uncertainty into deterministic strike claims.
- Require explicit confidence statements for all timing recommendations.
- Require human command approval when recommending mission delay or abort.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-space-weather-strike-assurance-v1` with `protocol_stack_id=ps-joint-tactical-link-stack-v1`.
- Alternate: `tool_suite_id=ts-space-satcom-v1` with `protocol_stack_id=ps-cop-event-sharing-stack-v1`.
- Degraded: conservative strike timing tables with manual cross-check cadence.

## Domain Packet Defaults

- Default packet ID: `DPL-SPACE-WX-STRIKE-001`.
- If timing-integrity gates fail, recommend constrained employment or no-go.
