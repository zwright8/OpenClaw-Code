---
name: homeland-lock-dam-barge-priority-and-manual-override-cell
description: Coordinate lock or dam manual overrides, tow and barge priority, and protected waterway throughput when cyber disruption, sabotage, or power loss blocks strategic inland movement.
---

# Homeland Lock Dam Barge Priority and Manual Override Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm lock authority, waterway condition, cargo priorities, manual-control readiness, and civil-military coordination rules before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with affected locks or dams, tow queues, cargo classes, control-system outages, and commander priorities.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in throughput, flooding risk, safety, and strategic movement impact.
3. Identify branch triggers for manual override, water-level hold, convoy reprioritization, or alternate-mode rerouting.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and civil-authority decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: lock-state board, barge-priority ladder, and manual-override decision matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-lock-dam-barge-priority-manual-override-v1` with `protocol_stack_id=ps-homeland-lock-dam-barge-priority-manual-override-stack-v1`.
- Alternate: select a mission-adjacent DSCA, inland-waterways, or strategic mobility suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: daylight or convoy-batch movement only with manual lock boards and command-approved cargo rationing.

## Domain Packet Defaults

- Default packet ID: `DPL-LOCK-DAM-BARGE-OVERRIDE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: lock-control status board, tow and barge queue tracker, water-level telemetry, and civil-emergency movement board.
- Preferred protocol profiles for coordination and machine exchange: `AIS/NMEA`, `OGC`, `NIEM`, `CAP`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If water-control state, cargo priority, or manual-override authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag flood-control risk, civil-impact spillover, tow collision exposure, and cargo-priority conflicts before recommending action.
- Do not fabricate waterway status, manual-control readiness, or movement approvals.
