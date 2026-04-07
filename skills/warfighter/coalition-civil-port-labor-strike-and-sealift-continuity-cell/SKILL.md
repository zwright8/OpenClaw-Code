---
name: coalition-civil-port-labor-strike-and-sealift-continuity-cell
description: Maintain coalition sealift throughput during civil-port labor strikes, slowdowns, or workforce walkouts while respecting legal authorities and host-nation legitimacy. Use when contested theater sustainment depends on commercial ports with labor disruption risk.
---

# Coalition Civil Port Labor Strike And Sealift Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter sealift continuity when coalition or host-nation commercial ports face labor disruption.
- Confirm affected berths, military cargo priorities, host-nation law, labor posture, coalition caveats, and commander decision deadlines before recommending action.
- Keep outputs unclassified by default unless contract data, labor negotiations, or port-security details require protected handling.

## Workflow

1. Frame the mission problem with labor action status, berth capacity, cargo priorities, onward transportation constraints, and legal limitations.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in throughput, legitimacy, political risk, and force-flow resilience.
3. Identify branch triggers for reroute, military stevedore augmentation, cargo reprioritization, or protected stand-down.
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

Primary products: berth-priority ladder, labor disruption branch matrix, and sealift continuity packet.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-civil-port-labor-strike-sealift-continuity-v1` with `protocol_stack_id=ps-coalition-civil-port-labor-strike-sealift-continuity-stack-v1`.
- Alternate: select a mission-adjacent sealift, port-opening, mobility, or coalition-interoperability suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: use a manual berth-priority board, protect essential cargo only, and require command approval before any action that changes host-nation labor posture.

## Domain Packet Defaults

- Default packet ID: `DPL-PORT-LABOR-SEALIFT-CONTINUITY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: berth scheduler, cargo manifest board, labor-action status tracker, and onward movement queue.
- Preferred protocol profiles for coordination and machine exchange: `AIS/NMEA`, `EDI X12`, `NIEM`, signed port notices, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If host-nation legal authority, contract posture, or coalition cargo-priority agreement is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Do not recommend unlawful strikebreaking, coercive labor actions, or host-nation sovereignty violations.
- Flag civil unrest, insurance exposure, and cargo-spoilage or munitions-safety risks before recommending berth moves.
