---
name: joint-loitering-munition-fratricide-envelope-assurance-cell
description: Coordinate loitering-munition fratricide envelopes, human-release gates, and airspace or ground deconfliction. Use when persistent precision effects or swarming munitions risk blue-force overlap in dense maneuver space.
---

# Joint Loitering Munition Fratricide Envelope Assurance Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter loitering-munition safety, release-governance, and blue-force deconfliction decisions.
- Confirm munition types, blue-force position quality, no-strike constraints, airspace controls, and release authorities before recommending action.
- Keep outputs unclassified by default unless target sets, munition vulnerabilities, or planned effects require protected handling.

## Workflow

1. Frame the mission problem using engagement geometry, maneuver plan, munition endurance, and position-confidence data.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in effects persistence, fratricide risk, responsiveness, and airspace burden.
3. Identify branch triggers for blue-force drift, lost comms, GPS degradation, and release-veto conditions.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and fires-lead decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: fratricide envelope board, human-release gate matrix, and airspace or maneuver deconfliction plan.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-loitering-munition-fratricide-envelope-assurance-v1` with `protocol_stack_id=ps-joint-loitering-munition-fratricide-envelope-assurance-stack-v1`.
- Alternate: select a mission-adjacent fires, airspace-control, or autonomy-governance suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: hold-fire by default with time-bounded manual release, simplified airspace blocks, and positive control confirmation.

## Domain Packet Defaults

- Default packet ID: `DPL-LM-FRATRICIDE-ENVELOPE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: engagement geometry calculator, blue-force tracker, munition state board, and airspace deconfliction cell.
- Preferred protocol profiles for coordination and machine exchange: `Link 16 J-series`, `VMF`, `CoT`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If blue-force location confidence, release authority, or deconfliction integrity is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag blue-force drift, stale no-strike data, GPS uncertainty, and airspace conflicts before recommending action.
- Do not fabricate target validation, positive control, or release approval.
