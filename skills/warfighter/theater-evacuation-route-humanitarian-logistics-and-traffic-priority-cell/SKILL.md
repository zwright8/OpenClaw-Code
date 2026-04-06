---
name: theater-evacuation-route-humanitarian-logistics-and-traffic-priority-cell
description: Deconflict evacuation flows, humanitarian logistics, and military traffic priority across contested roads, rail, air, and water routes. Use when commanders need life-safety and mission-throughput decisions tied to explicit tool and protocol bindings.
---

# Theater Evacuation Route Humanitarian Logistics And Traffic Priority Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter evacuation, route-priority, and humanitarian-logistics decisions.
- Confirm affected populations, force-flow requirements, corridor authorities, route hazards, and protected movement windows before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using route status, convoy demand, shelter backpressure, casualty flow, and humanitarian movement requirements.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in survivability, tempo, legitimacy, and life-safety outcomes.
3. Identify branch triggers for route closure, one-way flow conversion, checkpoint redesign, and protected-priority movement.
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

Primary products: evacuation traffic-priority matrix, humanitarian corridor branch card, and route-control synchronization board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-evacuation-route-humanitarian-logistics-traffic-priority-v1` with `protocol_stack_id=ps-theater-evacuation-route-humanitarian-logistics-traffic-priority-stack-v1`.
- Alternate: select a mission-adjacent evacuation, mobility, or civil-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual corridor board with command-approved priority order, paper checkpoint control measures, and scheduled route-status confirmation.

## Domain Packet Defaults

- Default packet ID: `DPL-EVAC-HUMLOG-TRAFFIC-001`.
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
- If corridor authority, civil-priority rules, or route-hazard confidence is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag casualty interference, civilian bottlenecks, bridge or tunnel choke risks, and humanitarian-access legitimacy issues before recommending action.
- Do not fabricate route clearance, shelter capacity, or protected-movement approvals.
