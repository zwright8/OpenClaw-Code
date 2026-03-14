---
name: coalition-underway-replenishment-hose-spanwire-and-rig-compatibility-cell
description: Govern hose, spanwire, and rig compatibility for coalition underway replenishment under contested maritime tempo. Use when fleets must keep fuel and stores flowing across mixed allied equipment.
---

# Coalition Underway Replenishment Hose Spanwire And Rig Compatibility Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm replenishment ship mix, compatibility standards, sea-state limits, and coalition release authorities before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the replenishment demand, compatible and incompatible rigs, transfer priorities, and commander constraints.
2. Build swap, adapt, stage, slow-flow, and shore-backfill branches with explicit tempo and safety tradeoffs.
3. Bind each recommendation to fleet logistics, compatibility, and seamanship tools plus protocolized outputs.
4. Publish degraded-mode branches when compatible hose, spanwire, or replenishment teams fall below threshold.

## Required Output Format

1. Situation snapshot.
2. Recommended underway-replenishment branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Underway-replenishment compatibility packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: rig-compatibility board, transfer-priority ladder, and coalition replenishment risk matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-underway-replenishment-rig-compatibility-v1` with `protocol_stack_id=ps-coalition-underway-replenishment-rig-compatibility-stack-v1`.
- Alternate: fleet replenishment board plus coalition logistics liaison tracker.
- Degraded: fuel-and-life-support stores only with manual compatibility verification and slowed transfer windows.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-UNDERWAY-REPLENISHMENT-RIG-001` for critical recommendations.
- Prioritize these protocol families for this domain: `AIS/NMEA`, `NATO APP-11/ADatP-3`, signed logistics manifests, `API/JSON`, and `USMTF`.
- Include source system, refresh UTC, confidence, compatibility status, and unresolved seamanship or certification gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run protocol and mission-assurance checks from `../_shared/references/us-joint-protocol-assurance-drill.md` and `../_shared/references/mission-assurance-checklist.md`.
- If compatibility evidence, sea-state restrictions, or coalition release authority is uncertain, downgrade to advisory-only and require human command review.

## Guardrails

- Do not fabricate rig compatibility, certified transfer rates, or coalition approvals.
- Separate confirmed incompatibilities from projected throughput loss.
- Flag ammunition, JP-5, medical stores, and battle-damage repair cargo that cannot tolerate transfer delay.
