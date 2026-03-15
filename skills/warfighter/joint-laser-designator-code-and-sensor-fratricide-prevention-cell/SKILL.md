---
name: joint-laser-designator-code-and-sensor-fratricide-prevention-cell
description: Coordinate laser-code deconfliction and sensor-safe designation governance for U.S. joint fires. Use when JTACs, airborne sensors, or multiple designators risk fratricide, mistargeting, or wrong-target engagement.
---

# Joint Laser Designator Code And Sensor Fratricide Prevention Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm fires authorities, participating sensors and shooters, designator ownership, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with assigned laser codes, sensor participation, target geometry, and timing windows.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in fratricide risk, target fidelity, fires tempo, and coordination burden.
3. Identify branch or sequel triggers, designation hold points, and release-approval gates.
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

Primary products: laser-code deconfliction matrix, sensor-safe fires window board, and designation approval ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-laser-designator-sensor-fratricide-prevention-v1` with `protocol_stack_id=ps-joint-laser-designator-sensor-fratricide-prevention-stack-v1`.
- Alternate: select a mission-adjacent fires, targeting, or JTAC control suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: single-designator control with voice readback and UTC acknowledgment logging.

## Domain Packet Defaults

- Default packet ID: `DPL-LASER-DESIGNATOR-FRATRICIDE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: laser-code registry, JTAC fires coordination board, and sensor cueing conflict engine.
- Preferred protocol profiles for coordination and machine exchange: `VMF`, `Link 16 J-series`, `USMTF`, and `API/JSON`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, code integrity, target confirmation, or release confidence is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag fires deconfliction, collateral-damage, coalition, and sensor-spoofing risks before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
