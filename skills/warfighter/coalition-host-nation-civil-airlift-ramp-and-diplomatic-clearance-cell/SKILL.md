---
name: coalition-host-nation-civil-airlift-ramp-and-diplomatic-clearance-cell
description: Synchronize coalition civil-airlift ramp capacity, diplomatic clearances, and host-nation access for military surge movements. Use when coalition airlift relies on civil aircraft, mixed crews, and contested diplomatic routing.
---

# Coalition Host Nation Civil Airlift Ramp And Diplomatic Clearance Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm coalition caveats, host-nation access rules, ramp constraints, and diplomatic-clearance timelines before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the airlift demand, coalition carrier mix, ramp throughput, and diplomatic-clearance bottlenecks.
2. Build stage, reroute, split-manifest, defer, and protected-corridor branches with explicit alliance and throughput tradeoffs.
3. Bind each recommendation to movement-control, diplomatic-clearance, and airfield-ops tools plus protocolized outputs.
4. Publish degraded-mode branches when host-nation approval, ramp access, or coalition crew-release timelines fall below threshold.

## Required Output Format

1. Situation snapshot.
2. Recommended coalition airlift branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Coalition civil-airlift packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: coalition ramp-priority matrix, diplomatic-clearance ledger, and alliance airlift-risk ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-host-nation-civil-airlift-clearance-v1` with `protocol_stack_id=ps-coalition-host-nation-civil-airlift-clearance-stack-v1`.
- Alternate: coalition movement-control board plus liaison clearance tracker.
- Degraded: manual slot-allocation board with liaison-confirmed diplomatic status.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-COALITION-CIVIL-AIRLIFT-CLEARANCE-001` for critical recommendations.
- Prioritize these protocol families for this domain: `AIXM/FIXM`, `NIEM`, `API/JSON`, `USMTF`, and ICAO diplomatic-clearance exchange.
- Include source system, refresh UTC, confidence, ramp saturation, and unresolved host-nation caveats in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run mission-assurance and protocol checks from `../_shared/references/us-joint-protocol-assurance-drill.md`.
- If diplomatic status, coalition release authority, or airfield-slot integrity is uncertain, downgrade to advisory-only and require human command review.

## Guardrails

- Do not fabricate diplomatic clearances, coalition caveat waivers, or slot assignments.
- Separate projected throughput from host-nation-confirmed access.
- Flag hazardous cargo, medical evacuation, and protected-person movement constraints early.
