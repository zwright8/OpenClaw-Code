---
name: joint-littoral-hydrographic-survey-and-beach-lane-recertification-cell
description: Coordinate littoral hydrographic survey refresh and beach-lane recertification. Use when landing forces, connectors, or logistics over-the-shore operations depend on updated bathymetry, surf conditions, and obstacle confidence.
---

# Joint Littoral Hydrographic Survey and Beach Lane Recertification Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm landing-craft profile, survey freshness, tidal windows, obstacle intelligence, and lane-certification authority before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with hydrographic data age, surf forecast, beach gradient, obstacle confidence, and commander priorities.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in lane confidence, connector survivability, tempo, and collection burden.
3. Identify branch triggers for bathymetric change, surf deterioration, obstacle rediscovery, or lane-certification timeout.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and amphibious-control decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: hydrographic confidence board, beach-lane recertification packet, and connector go/no-go matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-littoral-hydrographic-survey-beach-lane-recertification-v1` with `protocol_stack_id=ps-joint-littoral-hydrographic-survey-beach-lane-recertification-stack-v1`.
- Alternate: select a mission-adjacent amphibious, beachmaster, or engineer-recon suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: previously certified lanes only with conservative draft limits, daylight movement, and command-approved recon gaps.

## Domain Packet Defaults

- Default packet ID: `DPL-HYDRO-BEACH-LANE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: hydrographic survey console, bathymetry raster board, surf and tide model, and beach-lane map service.
- Preferred protocol profiles for coordination and machine exchange: `IHO S-100/S-57`, `OGC`, `AIS/NMEA`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If survey confidence, lane certification, or landing-release authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag stale bathymetry, surf instability, obstacle drift, and lane-marking ambiguity before recommending action.
- Do not fabricate lane certification, obstacle clearance, or connector safety.
