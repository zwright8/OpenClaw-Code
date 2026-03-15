---
name: expeditionary-flightline-ground-support-equipment-readiness-cell
description: Coordinate flightline ground support equipment readiness, cart dispatch, and cross-servicing decisions for U.S. warfighters. Use when power carts, air carts, hydraulic rigs, or tow assets gate sortie generation and dispersed-airfield tempo.
---

# Expeditionary Flightline Ground Support Equipment Readiness Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter ground-support-equipment readiness, dispatch, and cross-servicing decisions.
- Confirm supported aircraft sets, sortie-generation priorities, AGE inventory, maintenance posture, and airfield authority before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with aircraft demand, cart or tow asset status, power and air-servicing needs, parts posture, and ramp timing.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in sortie tempo, maintenance burden, crew exposure, and equipment wear.
3. Identify branch triggers for cart reallocation, cross-servicing, launch delay, and manual servicing fallback.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and maintenance decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: AGE dispatch matrix, sortie-support equipment ladder, and cart cross-service plan.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-expeditionary-flightline-ground-support-equipment-readiness-v1` with `protocol_stack_id=ps-expeditionary-flightline-ground-support-equipment-readiness-stack-v1`.
- Alternate: a mission-adjacent airbase or maintenance suite from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Degraded: mission-essential sorties only with manual cart control, line badge readback, and fixed service windows.

## Domain Packet Defaults

- Default packet ID: `DPL-FLIGHTLINE-GSE-READINESS-001`.
- Preferred `toolchain_id=TC-GSE-152` and `toolchain_profile_id=flightline-ground-support-equipment-readiness-v1`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: AGE dispatch board, power and air cart availability ledger, tow asset tracker, and sortie support scheduler.
- Preferred protocol profiles for coordination and machine exchange: `AIXM/FIXM`, signed maintenance manifests, `API/JSON`, `OGC`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If AGE status, cross-servicing authority, or sortie-priority data is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unavailable carts, unsafe dispatch assumptions, and cross-servicing shortfalls before recommending action.
- Do not fabricate equipment readiness, dispatch completion, or maintenance release status.
