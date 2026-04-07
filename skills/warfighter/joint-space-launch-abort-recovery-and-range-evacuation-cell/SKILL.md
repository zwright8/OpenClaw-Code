---
name: joint-space-launch-abort-recovery-and-range-evacuation-cell
description: Coordinate launch-abort recovery, debris hazard prediction, and range evacuation for military space operations. Use when launch anomalies, destruct criteria, or off-nominal trajectories threaten crews, range assets, or nearby populations.
---

# Joint Space Launch Abort Recovery And Range Evacuation Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter launch, range-safety, and recovery operations.
- Confirm range authority, abort triggers, search-and-rescue coverage, debris modeling confidence, and civil-warning responsibilities before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem with launch phase, abort mode, projected debris or landing footprint, crew status, and range occupancy.
2. Build one recommended COA and at least two alternatives with tradeoffs in life safety, mission salvageability, range integrity, and warning credibility.
3. Identify branch triggers for destruct recommendation, crew rescue launch, range evacuation, hazard messaging, or recovery handoff.
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

Primary products: abort recovery decision ladder, range evacuation timeline, and debris hazard overlay.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-space-launch-abort-recovery-range-evacuation-v1` with `protocol_stack_id=ps-joint-space-launch-abort-recovery-range-evacuation-stack-v1`.
- Alternate: select a mission-adjacent space, civil-support, or airspace suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: life-safety-first evacuation and recovery only with manual hazard boards, voice readbacks, and conservative danger footprints.

## Domain Packet Defaults

- Default packet ID: `DPL-LAUNCH-ABORT-RANGE-EVAC-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: range safety board, debris footprint predictor, and search-and-rescue dispatch planner.
- Preferred protocol profiles for coordination and machine exchange: `CCSDS`, `AIXM/FIXM`, `CAP`, `OGC`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for destruct, evacuation, or recovery recommendations.
- If debris prediction quality, telemetry integrity, or range authority posture is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified telemetry, assessed projections, assumptions, and unknowns.
- Do not recommend destruct, rescue launch, or evacuation actions without explicit human approval and acknowledgment integrity.
- Flag casualty risk, debris uncertainty, and public-warning mismatch before recommending action.
- Do not fabricate telemetry, destruct criteria, or range approvals.
