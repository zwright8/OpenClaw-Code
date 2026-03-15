---
name: joint-ground-robotics-teleoperation-spectrum-safety-cell
description: Coordinate safe teleoperation of joint ground robots under contested spectrum and latency stress. Use when engineer, EOD, or recovery robots risk losing control authority or autonomy fallback discipline.
---

# Joint Ground Robotics Teleoperation Spectrum Safety Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm robot authorities, control-link ownership, spectrum governance boundaries, and mission deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with robot classes, link health, spectrum assignments, and lost-link behavior.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in safety, mission tempo, control fidelity, and EW exposure.
3. Identify branch or sequel triggers, teleoperation hold points, and release-approval gates.
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

Primary products: teleop-control matrix, spectrum-safe task windows, and lost-link fallback ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-ground-robotics-teleoperation-spectrum-safety-v1` with `protocol_stack_id=ps-joint-ground-robotics-teleoperation-spectrum-safety-stack-v1`.
- Alternate: select a mission-adjacent robotics, EMSO, or engineer-control suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: line-of-sight teleoperation only with human spotter chain.

## Domain Packet Defaults

- Default packet ID: `DPL-GROUND-ROBOTICS-TELEOP-SPECTRUM-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: robotic mission controller, teleop link monitor, and spectrum conflict adjudication board.
- Preferred protocol profiles for coordination and machine exchange: `CoT`, `VMF`, `DDS/ROS 2`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, control-link integrity, spectrum clearance, or lost-link drill readiness is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag fratricide, spectrum conflict, autonomy fallback, and manned-unmanned coordination risks before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
