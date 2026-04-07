---
name: joint-launch-toxic-propellant-cloud-public-protection-cell
description: Assess toxic propellant release hazards and public-protection actions for launch, abort, pad fire, or reentry debris events. Use when U.S. launch or missile activities risk hazardous plume exposure to forces or civilians.
---

# Joint Launch Toxic Propellant Cloud Public Protection Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter launch-range toxic-plume risk, force protection, and public-warning decisions.
- Confirm propellant type, release pathway, plume model confidence, shelter or evacuation authority, and launch timeline before recommending action.
- Keep outputs unclassified by default unless range vulnerabilities, toxic-load specifics, or force-protection posture require protected handling.

## Workflow

1. Frame the mission problem with release source, meteorological state, exposed populations, shelter capacity, and mission-critical launch or recovery decisions.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in force safety, public protection, mission timing, and false-alarm burden.
3. Identify branch triggers for shelter-in-place, evacuation, launch hold, downwind corridor closure, or reentry-warning expansion.
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

Primary products: toxic plume hazard map, shelter or evacuation decision matrix, and launch or recovery branch card.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-launch-toxic-propellant-cloud-public-protection-v1` with `protocol_stack_id=ps-joint-launch-toxic-propellant-cloud-public-protection-stack-v1`.
- Alternate: select a mission-adjacent launch-recovery, DSCA crisis, or civil-defense mass-evacuation suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: assume the more conservative hazard envelope, stop public movement into downwind zones, and require human approval for any launch continuation.

## Domain Packet Defaults

- Default packet ID: `DPL-LAUNCH-TOXIC-PROPELLANT-CLOUD-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: plume-model console, range-safety board, public-warning gateway, and medical or shelter capacity tracker.
- Preferred protocol profiles for coordination and machine exchange: `CAP`, `OGC`, `CCSDS`, `NIEM`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If plume confidence, shelter capacity, or civil-warning authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Do not present precise exposure predictions as fact when meteorology, source term, or terrain effects remain uncertain.
- Flag school, hospital, barracks, and launch-workforce exposure risks before recommending continued operations.
