---
name: homeland-base-school-transport-and-dependent-evacuation-cell
description: Coordinate base-school transport, dependent accountability, and protected evacuation under homeland crises. Use when commanders must move children and dependents safely without breaking force-generation or life-safety priorities.
---

# Homeland Base School Transport And Dependent Evacuation Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter dependent-evacuation and school-transport continuity decisions on or near military installations.
- Confirm school status, childcare posture, dependent rosters, safehaven options, and transport authorities before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using school operations, bus or convoy status, dependent locations, shelter options, and incident timelines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in safety, accountability, transport capacity, and force-readiness impact.
3. Identify branch triggers for lockdown, transport reroute, shelter-in-place, guardian reunification, and safehaven activation.
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

Primary products: dependent-evacuation flow board, school-transport branch matrix, and guardian-accountability tracker.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-base-school-transport-dependent-evacuation-v1` with `protocol_stack_id=ps-homeland-base-school-transport-dependent-evacuation-stack-v1`.
- Alternate: select a mission-adjacent family-readiness, school-shelter, or evacuation suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual dependent roster with command-approved movement windows, paper guardian logs, and no unsupervised transport release.

## Domain Packet Defaults

- Default packet ID: `DPL-BASE-SCHOOL-DEPENDENT-EVAC-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: school-transport board, dependent-accountability ledger, guardian reunification tracker, and safehaven capacity map.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `CAP`, `API/JSON`, `S/MIME`, `OGC`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If guardian accountability, school-release authority, or transport security is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag child-safety risk, reunification friction, mixed-custody ambiguity, and transport-security exposure before recommending action.
- Do not fabricate dependent locations, school status, or reunification approval.
