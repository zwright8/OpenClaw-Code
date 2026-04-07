---
name: homeland-ferry-evacuation-and-island-resupply-priority-cell
description: Coordinate ferry evacuation, island resupply, and terminal-priority decisions during domestic emergencies. Use when U.S. warfighters need lawful maritime support options that protect isolated populations and preserve critical sustainment.
---

# Homeland Ferry Evacuation And Island Resupply Priority Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter ferry evacuation and island-resupply decisions during domestic operations.
- Confirm affected populations, terminal status, vessel availability, sea-state or weather constraints, and civil-authority requests before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using population isolation, vessel capacity, port and terminal readiness, weather risk, and priority cargo demand.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in throughput, survivability, civil legitimacy, and sustainment coverage.
3. Identify branch triggers for terminal closure, vessel attrition, weather denial, and security screening overload.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and civil-authority decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: ferry movement priority board, island resupply ladder, and terminal release packet.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-ferry-evacuation-island-resupply-priority-v1` with `protocol_stack_id=ps-homeland-ferry-evacuation-island-resupply-priority-stack-v1`.
- Alternate: select a mission-adjacent maritime-evacuation, port-operations, or mobility suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: life-safety lift only with manual passenger control and command-approved cargo rationing.

## Domain Packet Defaults

- Default packet ID: `DPL-FERRY-ISLAND-RESUPPLY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: vessel-availability tracker, terminal-status dashboard, passenger-priority board, and island resupply ledger.
- Preferred protocol profiles for coordination and machine exchange: `AIS/NMEA`, `NIEM`, `OGC`, `API/JSON`, `CAP`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If terminal access, maritime safety, or embarkation legitimacy is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported vessel availability, unsafe embarkation timing, terminal bottlenecks, and island-sustainment blind spots before recommending action.
- Do not fabricate sailings, berth availability, or civil embarkation approvals.
