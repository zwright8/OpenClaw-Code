---
name: joint-directed-energy-engagement-airspace-and-reflection-safety-cell
description: Coordinate directed-energy engagement safety across beam geometry, airspace, reflective surfaces, and blue-force exposure. Use when commanders need high-confidence release decisions for lasers or other directed-energy effects.
---

# Joint Directed Energy Engagement Airspace And Reflection Safety Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter directed-energy release, safety, and deconfliction decisions.
- Confirm weapon mode, target track, airspace posture, reflective-surface hazards, and release authority before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem using beam geometry, target behavior, blue-force positions, reflective hazards, and airspace constraints.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in lethality, safety margin, airspace access, and mission tempo.
3. Identify branch triggers for hold fire, geometry adjustment, target handoff, and degraded or observe-only operation.
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

Primary products: beam-release matrix, reflection-risk map, and engagement safety hold list.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-directed-energy-airspace-reflection-safety-v1` with `protocol_stack_id=ps-joint-directed-energy-airspace-reflection-safety-stack-v1`.
- Alternate: select a mission-adjacent directed-energy, fires, or airspace-control suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Preferred `toolchain_id=TC-DE-SAFE-110` and `toolchain_profile_id=directed-energy-airspace-reflection-safety-v1`.
- Degraded: observe-only or no-fire posture until beam path, exposure, and airspace conflicts are manually confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-DIRECTED-ENERGY-AIRSPACE-REFLECTION-SAFETY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: beam-control safety board, reflection-hazard modeler, and airspace deconfliction workbench.
- Preferred protocol profiles for coordination and machine exchange: `AIXM/FIXM`, `Link 16 J-series`, `VMF`, `CoT`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, `../_shared/references/domain-toolchain-profiles.md`, `../_shared/references/joint-operations-external-toolchain-profiles.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If beam geometry, blue-force exposure, or airspace status is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag reflective-surface hazards, airspace conflicts, atmospheric uncertainty, and blue-force exposure before recommending action.
- Do not fabricate target tracks, release authorities, or safety clearances.
