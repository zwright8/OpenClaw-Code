---
name: theater-drone-port-battery-thermal-runaway-and-ordnance-standoff-cell
description: Coordinate drone-port battery thermal-runaway response and ordnance standoff control. Use when high-tempo uncrewed launch or recovery sites face battery fire risk, sympathetic detonation concerns, or pad-density tradeoffs.
---

# Theater Drone Port Battery Thermal Runaway and Ordnance Standoff Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm battery chemistry, armed-load status, fire-suppression posture, pad separation, and sortie demand before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with battery health telemetry, armed-aircraft posture, pad occupancy, thermal-runaway indicators, and commander priorities.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in sortie tempo, fire risk, standoff margins, and recovery delay.
3. Identify branch triggers for thermal spike, suppressant depletion, ordnance migration, or evacuation of adjacent pads.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and air-node decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: pad-risk board, battery thermal-runaway action ladder, and ordnance standoff matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-drone-port-battery-thermal-runaway-ordnance-standoff-v1` with `protocol_stack_id=ps-theater-drone-port-battery-thermal-runaway-ordnance-standoff-stack-v1`.
- Alternate: select a mission-adjacent drone-port, airfield-safety, or explosive-safety suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: launch-essential-only posture with manual battery inspection, widened standoff, and command-approved arming restrictions.

## Domain Packet Defaults

- Default packet ID: `DPL-DRONEPORT-THERMAL-STANDOFF-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: battery health telemetry board, drone-port pad scheduler, fire-suppression status board, and ordnance clear-radius calculator.
- Preferred protocol profiles for coordination and machine exchange: `CoT`, `AIXM/FIXM`, signed maintenance manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If battery-state confidence, explosive-safety standoff, or launch authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag thermal telemetry gaps, armed-pad adjacency, suppressant depletion, and evacuation-route conflict before recommending action.
- Do not fabricate battery health, safe standoff, or launch-release approval.
