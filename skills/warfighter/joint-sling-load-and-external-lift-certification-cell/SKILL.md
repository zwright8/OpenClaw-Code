---
name: joint-sling-load-and-external-lift-certification-cell
description: Coordinate sling-load certification, external-lift risk controls, and release recommendations for U.S. warfighters. Use when rotary-wing or tiltrotor lift operations depend on trusted load data, hookup quality, and air or ground safety gates.
---

# Joint Sling Load And External Lift Certification Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter sling-load, air-assault sustainment, and external-lift release decisions.
- Confirm aircraft type, load configuration, landing zone or pickup zone conditions, hookup team certification, weather, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with load dimensions, center of gravity, aircraft limitations, pathfinder or hookup status, and route hazards.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in speed, safety, sortie efficiency, and cargo survivability.
3. Identify branch triggers for no-lift, reduced-load release, alternate aircraft assignment, and ground convoy substitution.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and air-mission decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: sling-load release matrix, hookup certification ledger, and lift-risk mitigation board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-sling-load-external-lift-certification-v1` with `protocol_stack_id=ps-joint-sling-load-external-lift-certification-stack-v1`.
- Alternate: select a mission-adjacent air-mobility or assault-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual load worksheet with voice-confirmed dimensions, paper certification log, and commander-approved reduced-risk lift profile only.

## Domain Packet Defaults

- Default packet ID: `DPL-SLING-LOAD-EXTERNAL-LIFT-001`.
- Preferred `toolchain_id=TC-SLING-138` and `toolchain_profile_id=sling-load-external-lift-certification-v1`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: load certification board, hookup inspection ledger, lift-window planner, and aircraft configuration validator.
- Preferred protocol profiles for coordination and machine exchange: `AIXM/FIXM`, `VMF`, signed load manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If load data, hookup certification, or aircraft release authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag hook-up safety issues, aircraft configuration drift, weather exceedances, and unsecured cargo risk before recommending action.
- Do not fabricate lift certification, aircraft approval, or load calculations.
