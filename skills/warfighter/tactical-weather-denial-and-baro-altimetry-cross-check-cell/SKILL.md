---
name: tactical-weather-denial-and-baro-altimetry-cross-check-cell
description: Cross-check denied or degraded weather sensing against barometric altimetry, terrain, and runway or drop-zone risk. Use when U.S. air or fires units lose trusted weather sensors yet still need safe release decisions.
---

# Tactical Weather Denial And Baro Altimetry Cross Check Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter weather-confidence, barometric cross-check, and release-safety decisions under sensor denial.
- Confirm available altimetry sources, runway or drop-zone geometry, terrain constraints, aircraft or fires requirements, and commander timing before recommending action.
- Keep outputs unclassified by default unless mission routing, sensor vulnerabilities, or precision thresholds require protected handling.

## Workflow

1. Frame the mission problem with denied sensors, surviving weather inputs, altimeter-setting confidence, terrain constraints, and operational minima.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in safety, mission tempo, precision, and weather uncertainty.
3. Identify branch triggers for sortie restriction, alternate field use, fires recalibration, or no-release posture.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: weather-confidence ladder, altimetry cross-check matrix, and sortie or fires restriction card.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-tactical-weather-denial-baro-altimetry-cross-check-v1` with `protocol_stack_id=ps-tactical-weather-denial-baro-altimetry-cross-check-stack-v1`.
- Alternate: select a mission-adjacent expeditionary-airfield, weather-effects, or degraded-fires-recalibration suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: assume conservative minima, use manual altimeter-setting cross-checks, and require human approval before precision-dependent release.

## Domain Packet Defaults

- Default packet ID: `DPL-WEATHER-DENIAL-BARO-CROSSCHECK-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: weather model board, barometric cross-check worksheet, runway or drop-zone status feed, and terrain-risk overlay.
- Preferred protocol profiles for coordination and machine exchange: `WMO BUFR/GRIB`, `AIXM/FIXM`, `OGC`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If altimetry confidence, terrain masking effects, or release authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Do not recommend precision approach, low-level ingress, or drop-zone release as if weather confidence were intact when it is not.
- Flag altimeter-setting drift, terrain-wave effects, and runway-visual-reference gaps before recommending sortie continuation.
