---
name: theater-evacuation-route-humanitarian-logistics-and-traffic-priority-cell
description: Prioritize evacuation corridors, humanitarian movement, and protected traffic flow when military and civilian movements compete in crisis conditions.
---

# Theater Evacuation Route Humanitarian Logistics And Traffic Priority Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter evacuation-route and humanitarian traffic-priority decisions.
- Confirm supported population, route authorities, convoy status, shelter intake, and commander decision timeline before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using corridor status, threat picture, humanitarian movement demand, shelter capacity, and route-control constraints.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in life safety, throughput, force protection, and legitimacy.
3. Identify branch triggers for route closure, one-way control, convoy reprioritization, shelter diversion, and corridor reopening.
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

Primary products: corridor-priority matrix, humanitarian movement ledger, route-closure and reopening ladder, and shelter-diversion decision log.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-EVAC-242`, `tool_suite_id=ts-theater-evacuation-route-humanitarian-logistics-and-traffic-priority-v1`, and `protocol_stack_id=ps-theater-evacuation-route-humanitarian-logistics-and-traffic-priority-stack-v1`.
- Alternate: select a mission-adjacent mobility, civil-defense, or humanitarian-corridor suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: essential movements only with command-approved priority order and manual route updates.

## Domain Packet Defaults

- Default packet IDs: `DPL-EVAC-TRAFFIC-PRIORITY-001` and `DPL-HUMANITARIAN-CORRIDOR-THROUGHPUT-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: corridor-status dashboard, convoy scheduler, shelter-intake tracker, and humanitarian movement ledger.
- Preferred protocol profiles for coordination and machine exchange: `OGC`, `NIEM`, `CAP`, `API/JSON`, `AIS/NMEA`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If route authority, traffic data freshness, or humanitarian accountability is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported throughput claims, route-control conflicts, humanitarian legitimacy risk, and shelter overload before recommending action.
- Do not fabricate corridor status, humanitarian demand, route approvals, or convoy integrity.
