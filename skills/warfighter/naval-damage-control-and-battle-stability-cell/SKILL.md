---
name: naval-damage-control-and-battle-stability-cell
description: Coordinate shipboard damage control, flooding and fire isolation, and battle-stability decisions for U.S. warfighters. Use when commanders must preserve combat power while containing casualties, restoring systems, or deciding whether a ship can keep fighting.
---

# Naval Damage Control And Battle Stability Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter ship survivability, engineering casualty control, and restore-fight decisions.
- Confirm platform type, casualty picture, stability margins, propulsion or power status, available repair teams, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with flooding boundaries, fire zones, stability calculations, mission-essential systems, and repair-team availability.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in survivability, combat persistence, crew risk, and recovery timeline.
3. Identify branch triggers for fight-through, dewatering, isolation, abandon-ship preparation, and tug or escort support.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish command and engineering decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: damage-control action board, battle-stability ladder, and restore-fight decision matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-naval-damage-control-battle-stability-v1` with `protocol_stack_id=ps-naval-damage-control-battle-stability-stack-v1`.
- Alternate: select a mission-adjacent maritime or engineering suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual damage-control plot with protected voice readback, engineering log reconciliation, and conservative stability assumptions.

## Domain Packet Defaults

- Default packet ID: `DPL-NAVAL-DAMAGE-CONTROL-STABILITY-001`.
- Preferred `toolchain_id=TC-DC-135` and `toolchain_profile_id=naval-damage-control-battle-stability-v1`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: ship damage-control board, flooding and fire boundary tracker, stability calculator, and casualty-power restoration workflow.
- Preferred protocol profiles for coordination and machine exchange: `AIS/NMEA`, `OGC`, signed damage-control manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If stability calculations, casualty reporting, or authority for major ship-state changes is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag uncertainty in compartment status, explosive risk, propulsion survivability, and crew endurance before recommending action.
- Do not fabricate casualty reports, engineering authority, or ship survivability claims.
