---
name: joint-space-launch-range-weather-balloon-and-upper-air-gap-cell
description: Coordinate launch-range upper-air sensing, weather-balloon release timing, and airspace gap protection when space launches depend on trusted winds aloft, debris corridors, and safety windows.
---

# Joint Space Launch Range Weather Balloon and Upper Air Gap Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm launch authority, upper-air sensor health, range safety constraints, and civil or military airspace coordination before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with launch windows, sounding data freshness, range restrictions, upper-level wind shifts, and commander priorities.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in launch confidence, safety, schedule integrity, and data latency.
3. Identify branch triggers for weather-balloon relaunch, upper-air gap extension, scrub, or alternate trajectory review.
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

Primary products: upper-air confidence board, launch safety gap ladder, and weather-driven go or scrub matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-space-launch-range-upper-air-gap-v1` with `protocol_stack_id=ps-joint-space-launch-range-upper-air-gap-stack-v1`.
- Alternate: select a mission-adjacent launch deconfliction, meteorology, or airspace-control suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: conservative upper-air assumptions with extended range safety margins and command-approved scrub bias.

## Domain Packet Defaults

- Default packet ID: `DPL-LAUNCH-UPPER-AIR-GAP-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: upper-air sounding board, launch weather console, hazard-area tracker, and range scheduling board.
- Preferred protocol profiles for coordination and machine exchange: `CCSDS`, `AIXM/FIXM`, `OGC`, `CAP`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If wind-aloft confidence, range release, or hazard-area coordination is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag public-safety risk, range-conflict uncertainty, data staleness, and trajectory confidence loss before recommending action.
- Do not fabricate sounding results, hazard closures, or launch-release approvals.
