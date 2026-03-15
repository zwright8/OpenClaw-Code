---
name: joint-bridge-erection-boat-powertrain-and-gap-crossing-recovery-cell
description: Coordinate bridge-erection-boat readiness, powertrain recovery, and wet-gap crossing rescue decisions for U.S. warfighters. Use when boat casualties or propulsion limits threaten bridge emplacement and crossing safety.
---

# Joint Bridge Erection Boat Powertrain And Gap Crossing Recovery Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter bridge-erection-boat readiness, propulsion recovery, and wet-gap rescue decisions.
- Confirm supported bridge mission, boat inventory, rescue posture, river conditions, and required emplacement timeline before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with boat status, powertrain or propulsor faults, spare parts posture, tow or rescue capacity, and crossing timelines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in emplacement speed, crew safety, maintenance burden, and crossing survivability.
3. Identify branch triggers for boat swap, tow recovery, reduced-span posture, and crossing suspension.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and engineer decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: bridge-erection-boat readiness board, propulsion recovery ledger, and wet-gap rescue branch plan.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-bridge-erection-boat-gap-crossing-recovery-v1` with `protocol_stack_id=ps-joint-bridge-erection-boat-gap-crossing-recovery-stack-v1`.
- Alternate: a mission-adjacent engineer, riverine, or logistics suite from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Degraded: essential-crossing-only posture with manual tow and rescue control plus conservative boat loading.

## Domain Packet Defaults

- Default packet ID: `DPL-BRIDGE-ERECTION-BOAT-RECOVERY-001`.
- Preferred `toolchain_id=TC-BEB-151` and `toolchain_profile_id=bridge-erection-boat-gap-crossing-recovery-v1`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: bridge-erection-boat readiness board, powertrain diagnostic tracker, spare prop or shaft ledger, and recovery or tow planner.
- Preferred protocol profiles for coordination and machine exchange: `AIS/NMEA`, `VMF`, `OGC`, signed maintenance manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If propulsion status, tow or rescue posture, or crossing authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag uncertain propulsion health, unsafe tow plans, and crossing rescue gaps before recommending action.
- Do not fabricate boat readiness, recovery capacity, or crossing release approvals.
