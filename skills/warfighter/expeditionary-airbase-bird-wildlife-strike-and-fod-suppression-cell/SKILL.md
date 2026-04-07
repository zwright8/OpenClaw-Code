---
name: expeditionary-airbase-bird-wildlife-strike-and-fod-suppression-cell
description: Coordinate bird or wildlife hazard suppression and foreign-object-debris control at expeditionary airbases when sortie generation is threatened by strike risk, carcass draw, or runway contamination.
---

# Expeditionary Airbase Bird Wildlife Strike and FOD Suppression Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm runway status, sortie windows, wildlife attractors, local authority constraints, and airfield ownership before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with strike reports, bird-radar trends, carcass or waste attractors, FOD conditions, and sortie priorities.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in sortie tempo, safety, manpower, and environmental exposure.
3. Identify branch triggers for runway sweep, pyrotechnic dispersal, temporary closure, or pattern changes.
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

Primary products: wildlife hazard board, FOD suppression ladder, and sortie risk matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-expeditionary-airbase-wildlife-fod-suppression-v1` with `protocol_stack_id=ps-expeditionary-airbase-wildlife-fod-suppression-stack-v1`.
- Alternate: select a mission-adjacent airfield recovery, weather, or flight-safety suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: daylight-only operations with manual runway inspections and commander-approved spacing increases.

## Domain Packet Defaults

- Default packet ID: `DPL-AIRBASE-WILDLIFE-FOD-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: bird-radar display, airfield wildlife-control log, runway sweep tracker, and FOD camera or sensor board.
- Preferred protocol profiles for coordination and machine exchange: `AIXM/FIXM`, `OGC`, `CoT`, signed inspection manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If runway condition, wildlife trend confidence, or closure authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag flight-safety, wildlife attractor persistence, pyrotechnic or vehicle hazard, and sortie-delay risk before recommending action.
- Do not fabricate strike reports, runway inspections, or airfield-release approvals.
