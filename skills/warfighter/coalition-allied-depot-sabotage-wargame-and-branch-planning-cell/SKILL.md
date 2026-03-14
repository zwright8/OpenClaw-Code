---
name: coalition-allied-depot-sabotage-wargame-and-branch-planning-cell
description: Wargame allied depot sabotage scenarios and branch plans for coalition sustainment continuity. Use when commanders need preplanned recovery and protection options for threatened depots, arsenals, or logistics parks.
---

# Coalition Allied Depot Sabotage Wargame And Branch Planning Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm depot mission, stock classes, host-nation constraints, coalition caveats, and decision timelines before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the depot network, critical nodes, sabotage vectors, and commander risk tolerance.
2. Build branches for prevention, detection, continuity, evacuation, and reconstitution with explicit throughput and survivability tradeoffs.
3. Bind each recommendation to external sustainment, security, and engineering tools plus required protocol packets.
4. Publish branch triggers, owner tasking, and degraded-mode sustainment paths when depot trust or availability falls below threshold.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Depot sabotage wargame packet and confidence notes.

## Domain Products

Primary products for this skill: depot sabotage branch matrix, protected-stock relocation board, and reconstitution trigger ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-allied-depot-sabotage-wargame-v1` with `protocol_stack_id=ps-coalition-allied-depot-sabotage-wargame-stack-v1`.
- Alternate: coalition movement-control board plus host-nation security liaison packet.
- Degraded: manual depot priority board with voice-confirmed stock-status reporting.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-DEPOT-SABOTAGE-WARGAME-001` for critical recommendations.
- Prioritize these protocol families for this domain: `USMTF`, `NATO APP-11/ADatP-3`, `API/JSON`, and signed logistics manifests.
- Include source system, refresh UTC, confidence, host-nation caveats, and inventory gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run mission-assurance checks from `../_shared/references/mission-assurance-checklist.md`.
- If stock accountability, host-nation consent, or sabotage attribution is uncertain, downgrade to advisory-only and assign closure actions.

## Guardrails

- Do not fabricate stock levels, depot readiness, or coalition approvals.
- Separate sabotage indicators from confirmed damage.
- Flag explosive safety, force-protection, and civilian-hazard constraints early.
