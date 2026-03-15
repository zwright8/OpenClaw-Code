---
name: joint-cold-injury-frostbite-and-rewarming-operations-cell
description: Coordinate cold-injury prevention, frostbite triage, and rewarming operations for U.S. warfighters. Use when exposure, wet-cold conditions, or Arctic operations threaten readiness and casualty survival.
---

# Joint Cold Injury, Frostbite, And Rewarming Operations Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter cold-weather survivability, casualty routing, and return-to-duty decisions.
- Confirm mission duration, ambient and wet-bulb conditions, warming capacity, casualty load, mobility constraints, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with exposure timelines, warming assets, casualty severity, transport availability, clothing posture, and commander decision points.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in casualty survival, maneuver continuity, warming demand, and evacuation burden.
3. Identify branch triggers for work-rest warming cycles, frostbite evacuation, rewarming-site activation, and exposed-unit relief.
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

Primary products: cold-injury risk board, rewarming and casualty-routing plan, and exposure-control work cycle matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-cold-injury-frostbite-rewarming-v1` with `protocol_stack_id=ps-joint-cold-injury-frostbite-rewarming-stack-v1`.
- Alternate: select a mission-adjacent medical, Arctic rescue, or mobility suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual exposure roster, warming-tent board, and voice-confirmed casualty handoff ledger.

## Domain Packet Defaults

- Default packet ID: `DPL-COLD-INJURY-REWARMING-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: cold-exposure tracker, warming shelter board, frostbite triage workflow, and casualty transfer queue.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, signed cold-exposure manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If casualty severity, transport capacity, or warming-site readiness is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag nonfreezing cold injury, hypothermia, rewarming delay, immersion exposure, and evacuation overpromising before recommending action.
- Do not fabricate casualty severity, warming capacity, or medical approvals.
