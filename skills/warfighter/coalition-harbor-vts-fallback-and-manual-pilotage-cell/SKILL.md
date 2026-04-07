---
name: coalition-harbor-vts-fallback-and-manual-pilotage-cell
description: Coordinate coalition harbor vessel-traffic-service fallback, manual pilotage, and channel-release decisions. Use when cyber outages, GNSS distrust, or congestion threaten sealift throughput, port safety, or combined maritime control.
---

# Coalition Harbor VTS Fallback And Manual Pilotage Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm harbor authority, coalition caveats, channel restrictions, and commander decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with VTS outage indicators, pilot and tug availability, traffic density, GNSS trust, and berth demand.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in safety, throughput, coalition trust, and delay.
3. Identify branch or sequel triggers, channel-closure thresholds, and command approval gates.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff task tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: harbor traffic fallback ladder, manual pilotage release matrix, and coalition channel-risk brief.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-harbor-vts-fallback-manual-pilotage-v1` with `protocol_stack_id=ps-coalition-harbor-vts-fallback-manual-pilotage-stack-v1`.
- Alternate: `tool_suite_id=ts-maritime-undersea-v1` with `protocol_stack_id=ps-cop-event-sharing-stack-v1`.
- Degraded: daylight and essential-vessel-only pilotage with voice nets, paper movement boards, and readback-confirmed channel release.

## Domain Packet Defaults

- Default packet ID: `DPL-HARBOR-VTS-MANUAL-PILOTAGE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: harbor traffic board, pilot allocation tracker, and channel-risk estimator.
- Preferred protocol profiles for coordination and machine exchange: `AIS/NMEA`, `OGC`, `USMTF`, `API/JSON`, and `NATO APP-11/ADatP-3` aligned exchange.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, track fidelity, or coalition acknowledgment integrity is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag collision risk, channel-depth, coalition caveat, and legal-liability constraints before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
