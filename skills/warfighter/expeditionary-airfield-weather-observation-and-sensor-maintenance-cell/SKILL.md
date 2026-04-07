---
name: expeditionary-airfield-weather-observation-and-sensor-maintenance-cell
description: Coordinate expeditionary airfield weather observations, sensor maintenance, and terminal-weather release decisions for U.S. warfighters. Use when sortie launch or recovery depends on trusted airfield weather data, damaged observing equipment, or manual observation fallback.
---

# Expeditionary Airfield Weather Observation And Sensor Maintenance Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter airfield weather observation, sensor-restoration, and terminal-weather release decisions.
- Confirm supported runway set, observation authority, aircraft minima, sensor status, and diversion timeline before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with ceiling and visibility needs, wind state, sensor health, manual observer posture, and sortie timing.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in weather confidence, launch tempo, crew safety, and maintenance burden.
3. Identify branch triggers for sensor repair, manual observation reversion, divert-field activation, and no-fly thresholds.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and airfield-operations decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: terminal-weather release board, sensor maintenance branch plan, and manual observation fallback card.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-expeditionary-airfield-weather-observation-sensor-maintenance-v1` with `protocol_stack_id=ps-expeditionary-airfield-weather-observation-sensor-maintenance-stack-v1`.
- Alternate: a mission-adjacent airfield or meteorological suite from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Degraded: manual weather-observer network, protected voice updates, and conservative launch minima only.

## Domain Packet Defaults

- Default packet ID: `DPL-AIRFIELD-WEATHER-OBS-SENSOR-001`.
- Preferred `toolchain_id=TC-WXOBS-145` and `toolchain_profile_id=airfield-weather-observation-sensor-maintenance-v1`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: airfield observing board, sensor health tracker, manual observation log, and terminal-weather release board.
- Preferred protocol profiles for coordination and machine exchange: `AIXM/FIXM/iwxxm`, signed observation manifests, `API/JSON`, `OGC`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If sensor status, observer certification, or weather minima authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag stale observations, damaged sensors, and launch or recovery minima uncertainty before recommending action.
- Do not fabricate METAR-equivalent observations, runway weather release authority, or maintenance completion.
