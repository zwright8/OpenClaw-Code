---
name: coalition-shore-power-frequency-conversion-and-berthing-cell
description: Coordinate coalition berth assignment, shore-power compatibility, and frequency-conversion capacity in constrained ports. Use when power mismatch, converter scarcity, or berth contention affects maritime readiness or sealift flow.
---

# Coalition Shore Power Frequency Conversion And Berthing Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm harbor authority, coalition caveats, ship power requirements, and port-release deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with ship classes, berth availability, converter status, and pier-load constraints.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in berth utilization, coalition interoperability, power safety, and turnaround tempo.
3. Identify branch or sequel triggers, berthing hold points, and release-approval gates.
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

Primary products: berth power allocation board, converter compatibility matrix, and coalition port-risk ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-shore-power-frequency-conversion-berthing-v1` with `protocol_stack_id=ps-coalition-shore-power-frequency-conversion-berthing-stack-v1`.
- Alternate: select a mission-adjacent maritime sustainment, port operations, or coalition interoperability suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: generator support only with prioritized military-essential berths.

## Domain Packet Defaults

- Default packet ID: `DPL-SHORE-POWER-BERTHING-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: berth power availability board, frequency-converter status tracker, and ship compatibility ledger.
- Preferred protocol profiles for coordination and machine exchange: `AIS/NMEA`, signed power-cert manifests, `API/JSON`, `USMTF`, and NATO APP-11/ADatP-3 aligned exchange.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, power compatibility, berth release, or coalition acknowledgment is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag pier-load, electrical-safety, coalition caveat, and sealift-tempo risks before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
