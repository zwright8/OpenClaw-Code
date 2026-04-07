---
name: joint-arctic-ice-pilotage-and-mariner-fatigue-cell
description: Coordinate Arctic ice routing, pilotage assignment, and mariner fatigue controls when U.S. warfighter sealift and high-latitude convoy operations depend on trusted route release and safe crew endurance.
---

# Joint Arctic Ice Pilotage And Mariner Fatigue Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm convoy authorities, ice-routing confidence, pilot availability, and crew-rest thresholds before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with vessel readiness, ice forecast, pilotage capacity, weather risk, and commander priorities.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in throughput, safety, detectability, and crew endurance.
3. Identify branch triggers for route change, speed reduction, pilot swap, watchbill redesign, or convoy hold.
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

Primary products: ice pilotage board, fatigue mitigation ladder, and convoy timing matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-arctic-ice-pilotage-mariner-fatigue-v1` with `protocol_stack_id=ps-joint-arctic-ice-pilotage-mariner-fatigue-stack-v1`.
- Alternate: select a mission-adjacent Arctic maritime, sealift, or weather-routing suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: daylight or reduced-speed movement only with conservative crew-rest windows and commander-approved route holds.

## Domain Packet Defaults

- Default packet ID: `DPL-ARCTIC-ICE-PILOTAGE-FATIGUE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: ice-route planner, pilotage scheduler, and fatigue analytics watchbill.
- Preferred protocol profiles for coordination and machine exchange: `AIS/NMEA`, `OGC`, signed crew manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If route confidence, fatigue data, or convoy-release authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag ice-compression risk, crew-fatigue exposure, pilotage shortfalls, and convoy-detection consequences before recommending action.
- Do not fabricate route confidence, pilot availability, or release authority.
