---
name: homeland-transit-bus-evacuation-staging-and-driver-continuity-cell
description: Coordinate transit-bus evacuation staging, driver continuity, and route-priority decisions during domestic crises. Use when U.S. warfighters need ground-transport recommendations that preserve evacuation throughput under fuel, staffing, and security stress.
---

# Homeland Transit Bus Evacuation Staging And Driver Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter transit-bus evacuation staging and driver-continuity decisions during domestic operations.
- Confirm evacuation demand, bus availability, driver status, pickup-node safety, and route constraints before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using population movement demand, bus fleet availability, driver fatigue or licensing constraints, staging-site capacity, and protected-route status.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in throughput, equity, force-protection burden, and sustainment endurance.
3. Identify branch triggers for driver shortfall, bus mechanical failure, route denial, and shelter backpressure.
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

Primary products: bus-staging matrix, driver-continuity board, and route-release evacuation packet.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-transit-bus-evacuation-staging-driver-continuity-v1` with `protocol_stack_id=ps-homeland-transit-bus-evacuation-staging-driver-continuity-stack-v1`.
- Alternate: select a mission-adjacent mobility, mass-evacuation, or shelter-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: life-safety movement only with manual manifests and command-approved driver or route prioritization.

## Domain Packet Defaults

- Default packet ID: `DPL-TRANSIT-BUS-EVAC-DRIVER-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: bus-fleet tracker, driver-availability board, staging-site dashboard, and route-release map.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `CAP`, `OGC`, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If driver credentialing, staging control, or protected-route legitimacy is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported fleet availability, unsafe pickup timing, driver-rest shortfalls, and inequitable route prioritization before recommending action.
- Do not fabricate bus counts, route-clearance status, or driver availability.
