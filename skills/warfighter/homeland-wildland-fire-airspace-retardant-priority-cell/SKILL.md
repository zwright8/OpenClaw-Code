---
name: homeland-wildland-fire-airspace-retardant-priority-cell
description: Coordinate military airspace support, retardant allocation, and smoke-driven sortie tradeoffs. Use when wildland fire response overlaps DSCA missions, training airspace, or base protection priorities.
---

# Homeland Wildland Fire Airspace Retardant Priority Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter DSCA wildland-fire, airspace, and aviation-priority decisions.
- Confirm incident-command authorities, available aircraft, retardant or water stock, smoke impacts, and protected-site priorities before recommending action.
- Keep outputs unclassified by default and align with civil-agency lead guidance unless explicit mission tasking states otherwise.

## Workflow

1. Frame the mission problem using fire growth, populated-area risk, military airspace conflicts, aircraft availability, and retardant supply.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in life safety, base protection, sortie disruption, and logistics burn.
3. Identify branch triggers for airspace closure, retardant reallocation, smoke-driven sortie holds, and mutual-aid escalation.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and civil-agency decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: airspace priority matrix, retardant or water-drop allocation ladder, and smoke impact mission board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-wildland-fire-airspace-retardant-priority-v1` with `protocol_stack_id=ps-homeland-wildland-fire-airspace-retardant-priority-stack-v1`.
- Alternate: select a mission-adjacent civil-support, airspace, or base-defense suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: life-safety-first airspace board with manual retardant accounting and command-approved sortie holds.

## Domain Packet Defaults

- Default packet ID: `DPL-WILDLAND-FIRE-AIRSPACE-RETARDANT-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: incident-command dashboard, air tanker dispatch board, smoke and plume model, and retardant stock ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIMS/ICS`, `AIXM/FIXM`, `CAP`, `OGC`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If agency lead concurrence, airspace status, or retardant availability is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag smoke-model uncertainty, retardant shortfalls, crew duty limits, and civil-military deconfliction gaps before recommending action.
- Do not fabricate airspace approvals, resource commitments, or civil-agency directives.
