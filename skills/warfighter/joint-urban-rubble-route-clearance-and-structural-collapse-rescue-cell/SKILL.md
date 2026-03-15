---
name: joint-urban-rubble-route-clearance-and-structural-collapse-rescue-cell
description: Coordinate urban route clearance and structural-collapse rescue prioritization for joint response forces. Use when debris, trapped personnel, and engineer scarcity compete for the same access corridors.
---

# Joint Urban Rubble Route Clearance And Structural Collapse Rescue Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm rescue authority, engineer release criteria, civil coordination boundaries, and life-safety deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with collapse map, trapped-person reports, blocked routes, and engineer availability.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in life safety, route throughput, secondary collapse risk, and rescue tempo.
3. Identify branch or sequel triggers, route hold points, and release-approval gates.
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

Primary products: rubble clearance matrix, structural collapse rescue ladder, and urban access priority board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-urban-rubble-route-clearance-structural-collapse-rescue-v1` with `protocol_stack_id=ps-joint-urban-rubble-route-clearance-structural-collapse-rescue-stack-v1`.
- Alternate: select a mission-adjacent engineer, civil-support, or urban rescue suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: lifesaving rescue corridors only with engineer and rescue dual approval.

## Domain Packet Defaults

- Default packet ID: `DPL-URBAN-RUBBLE-RESCUE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: collapse mapping board, engineer route-clearance planner, and rescue triage queue.
- Preferred protocol profiles for coordination and machine exchange: `NIMS/ICS`, `OGC`, `CoT`, `USMTF`, and `API/JSON`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, structural safety validation, route confirmation, or rescue approval is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag secondary-collapse, trapped-person, utility-hazard, and civil-deconfliction risks before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
