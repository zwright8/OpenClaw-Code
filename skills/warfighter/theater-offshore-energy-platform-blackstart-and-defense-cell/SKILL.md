---
name: theater-offshore-energy-platform-blackstart-and-defense-cell
description: Coordinate defense and blackstart restoration for offshore energy platforms that support U.S. warfighter basing and logistics. Use when sabotage, strike risk, or OT failure at offshore power nodes threatens military fuel, power, or communications continuity.
---

# Theater Offshore Energy Platform Blackstart And Defense Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm authorities, civil-commercial interfaces, coalition caveats, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with platform status, threat picture, export dependencies, and blackstart readiness.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in restoration speed, survivability, and operational energy continuity.
3. Identify branch/sequel triggers, safety limits, and command approval gates.
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

Primary products: platform defense posture map, blackstart sequencing ladder, and export-continuity branch plan.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-offshore-energy-platform-blackstart-defense-v1` with `protocol_stack_id=ps-theater-offshore-energy-platform-blackstart-defense-stack-v1`.
- Alternate: select a mission-adjacent offshore energy, civil-support, or maritime-defense suite/stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: authenticated voice/readback plus manual restart board and UTC acknowledgment logging.

## Domain Packet Defaults

- Default packet ID: `DPL-OFFSHORE-ENERGY-BLACKSTART-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: offshore platform OT telemetry, maritime defense COPs, and export-path continuity boards.
- Preferred protocol profiles for coordination and machine exchange: `AIS/NMEA`, `OGC`, `OPC UA`, signed maintenance manifests, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query/action template, expected output schema, protocol/transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, OT provenance, or platform safety evidence is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag legal, environmental, maritime safety, and coalition-caveat constraints before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
