---
name: joint-flightline-weapons-loading-and-armament-safety-cell
description: Coordinate flightline weapons-loading, armament configuration, and explosive-safety recommendations for U.S. warfighters. Use when sortie generation depends on trusted load data, qualified crews, and tight risk control around armed aircraft.
---

# Joint Flightline Weapons Loading And Armament Safety Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter flightline armament, explosive safety, and sortie-release decisions.
- Confirm aircraft configuration, munitions load plan, crew certification, explosive safety arcs, ramp congestion, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with weapons requirements, aircraft load compatibility, crew qualifications, explosive-safety boundaries, and sortie schedule pressure.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in safety, sortie tempo, munitions availability, and rearm speed.
3. Identify branch triggers for load-hold, reduced configuration, alternate parking, and rearm-sequence reprioritization.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and weapons-lead decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: armament release matrix, load-crew certification board, and explosive-safety risk ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-flightline-weapons-loading-armament-safety-v1` with `protocol_stack_id=ps-joint-flightline-weapons-loading-armament-safety-stack-v1`.
- Alternate: select a mission-adjacent airfield, fires, or munitions suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: paper load worksheet with voice-verified crew certification, manual safety arc enforcement, and commander-approved reduced-load posture only.

## Domain Packet Defaults

- Default packet ID: `DPL-FLIGHTLINE-WEAPONS-ARMAMENT-SAFETY-001`.
- Preferred `toolchain_id=TC-ARM-142` and `toolchain_profile_id=flightline-weapons-loading-armament-safety-v1`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: armament configuration validator, weapons-load checklist board, explosive safety arc planner, and sortie release board.
- Preferred protocol profiles for coordination and machine exchange: `AIXM/FIXM`, signed load manifests, `API/JSON`, `USMTF`, and `CoT`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If armament configuration data, crew certification, or explosive-safety authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag incompatible loads, hot-gun or fuze risk, ramp congestion, and unqualified load teams before recommending action.
- Do not fabricate aircraft compatibility, load certification, or explosive-safety clearance.
