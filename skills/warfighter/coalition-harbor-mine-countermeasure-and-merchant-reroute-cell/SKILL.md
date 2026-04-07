---
name: coalition-harbor-mine-countermeasure-and-merchant-reroute-cell
description: Coordinate harbor mine-countermeasure sequencing, merchant-vessel rerouting, and port reopening decisions across coalition partners. Use when mine threat, unexploded ordnance, or channel uncertainty threatens sealift and humanitarian throughput.
---

# Coalition Harbor Mine Countermeasure And Merchant Reroute Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter maritime, sealift, and coalition port-reopening operations.
- Confirm maritime authorities, port status, pilotage constraints, coalition caveats, and merchant traffic priorities before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem with suspected mine areas, survey confidence, merchant vessel queue, berth constraints, and coalition MCM assets.
2. Build one recommended COA and at least two alternatives with tradeoffs in harbor safety, sealift throughput, coalition burden, and civilian-risk posture.
3. Identify branch triggers for channel closure, phased reopening, convoy reroute, pilotage restrictions, or emergency anchorage use.
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

Primary products: harbor reopening sequence, merchant reroute board, and pilotage risk matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-harbor-mcm-merchant-reroute-v1` with `protocol_stack_id=ps-coalition-harbor-mcm-merchant-reroute-stack-v1`.
- Alternate: select a mission-adjacent maritime, port, or coalition suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: channel remains closed by default with manual survey correlation, restricted anchorages, and mission-essential movement only.

## Domain Packet Defaults

- Default packet ID: `DPL-HARBOR-MCM-MERCHANT-REROUTE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: harbor MCM board, merchant traffic planner, and port status ledger.
- Preferred protocol profiles for coordination and machine exchange: `AIS/NMEA`, `OGC`, `API/JSON`, `USMTF`, and NATO APP-11/ADatP-3 aligned exchange.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for channel-release or reroute recommendations.
- If mine-clearance confidence, harbor safety, or coalition acknowledgment is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified clearance data, assessed confidence, assumptions, and unknowns.
- Do not recommend harbor reopening until survey confidence and command acknowledgment meet release thresholds.
- Flag humanitarian throughput effects, neutral shipping risk, and coalition liability before recommending action.
- Do not fabricate mine-clearance results, vessel positions, or approvals.
