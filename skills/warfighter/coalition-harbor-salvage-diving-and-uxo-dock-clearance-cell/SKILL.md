---
name: coalition-harbor-salvage-diving-and-uxo-dock-clearance-cell
description: Coordinate coalition harbor salvage diving, unexploded-ordnance dock clearance, and berth re-opening when battle damage, sabotage, or sunken hazards block sealift and port operations.
---

# Coalition Harbor Salvage Diving and UXO Dock Clearance Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm harbor authority, coalition caveats, diver safety constraints, UXO risk, and berth priorities before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with blocked berths, underwater hazard reports, diver readiness, port throughput demands, and commander priorities.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in safety, reopening speed, coalition access, and salvage complexity.
3. Identify branch triggers for sonar resurvey, diver hold, UXO render-safe, or alternate-berth rerouting.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and coalition decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: harbor clearance board, diver or UXO risk ladder, and berth reopening matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-harbor-salvage-diving-uxo-dock-clearance-v1` with `protocol_stack_id=ps-coalition-harbor-salvage-diving-uxo-dock-clearance-stack-v1`.
- Alternate: select a mission-adjacent sealift, EOD, or port-opening suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual harbor exclusion zones with dive-only daylight windows and commander-approved berth rationing.

## Domain Packet Defaults

- Default packet ID: `DPL-HARBOR-SALVAGE-UXO-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: dive-plan ledger, side-scan sonar or ROV board, berth status tracker, and UXO site exploitation log.
- Preferred protocol profiles for coordination and machine exchange: `AIS/NMEA`, `OGC`, `NIEM`, signed dive manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If diver risk, UXO confidence, coalition caveats, or berth authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag diver life-support risk, unexploded-ordnance uncertainty, coalition harbor-liability concerns, and secondary-damage risk before recommending action.
- Do not fabricate berth status, dive certification, or render-safe approvals.
