---
name: homeland-law-enforcement-and-military-movement-deconfliction-cell
description: Deconflict military movement with state and local law-enforcement operations, road controls, and public-safety restrictions during domestic missions. Use when commanders need lawful, fast, and auditable convoy or route recommendations inside the United States.
---

# Homeland Law Enforcement And Military Movement Deconfliction Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter convoy, route-control, and movement-deconfliction decisions in domestic operations.
- Confirm supported law-enforcement jurisdictions, route restrictions, convoy composition, search and security authorities, and movement deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using movement requirements, route status, law-enforcement operations, public-safety controls, and protected-site constraints.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in legality, speed, public disruption, and force protection.
3. Identify branch triggers for checkpoint activation, route closure, curfew conflict, escort handoff, and protected-movement escalation.
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

Primary products: movement deconfliction board, route-clearance ladder, and checkpoint-authority matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-law-enforcement-military-movement-deconfliction-v1` with `protocol_stack_id=ps-homeland-law-enforcement-military-movement-deconfliction-stack-v1`.
- Alternate: select a mission-adjacent DSCA, evacuation, or force-protection suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual route-control board with no armed movement through uncontrolled chokepoints without command approval.

## Domain Packet Defaults

- Default packet ID: `DPL-LE-MIL-MOVEMENT-DECONFLICT-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: road-closure map, convoy scheduler, law-enforcement liaison board, and checkpoint-status tracker.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `NIMS/ICS`, signed route orders, `API/JSON`, `CAP`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If movement authority, law-enforcement concurrence, or search and detention boundaries are uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag Posse Comitatus boundaries, conflicting checkpoint rules, civilian traffic hazard, and unsupported escort assumptions before recommending action.
- Do not fabricate route clearance, law-enforcement concurrence, or public-safety authority.
