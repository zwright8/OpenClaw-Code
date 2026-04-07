---
name: joint-arctic-under-ice-navigation-and-emergency-polynya-routing-cell
description: Support under-ice navigation and surfacing windows for submarines, uncrewed undersea systems, and recovery forces. Use when Arctic missions depend on trusted polynya routing and emergency egress.
---

# Joint Arctic Under Ice Navigation And Emergency Polynya Routing Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm platform type, under-ice endurance, surfacing constraints, rescue authorities, and allied or civil routing restrictions.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame current route, ice state, nav confidence, and emergency surfacing requirements.
2. Separate confirmed polynya data, under-ice hazards, drift uncertainty, and rescue-support assumptions.
3. Build continue, divert, slow, relay, and emergency-breakout branches with explicit tradeoffs in exposure, timing, and recovery confidence.
4. Bind each branch to ice forecasting, inertial or acoustic navigation, under-ice route planning, and recovery tools.
5. Publish command decision points, communication windows, and rescue triggers tied to drift and endurance thresholds.

## Required Output Format

1. Situation snapshot.
2. Recommended route branch and rationale.
3. Alternative branches with triggers.
4. Decision points now, next, and pre-delegated.
5. Staff task tracker with owners and suspense.
6. Under-ice routing packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: under-ice route confidence board, emergency polynya ladder, Arctic recovery trigger matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-arctic-under-ice-polynya-routing-v1` with `protocol_stack_id=ps-joint-arctic-under-ice-polynya-routing-stack-v1`.
- Alternate: `tool_suite_id=ts-polar-routing-v1` with `protocol_stack_id=ps-under-ice-submarine-risk-stack-v1`.
- Packet default: `packet_id=DPL-UNDER-ICE-POLYNYA-ROUTING-001`.
- Degraded: conservative dead-reckoning route card with pre-briefed emergency breakout windows only.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md`, `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, and `../_shared/references/domain-tool-packet-library.md`.
- Prioritize `AIS/NMEA`, `OGC`, signed navigation advisories, `API/JSON`, and `USMTF`.
- Include drift confidence, ice-thickness freshness, communication window assumptions, and rescue-asset latency in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run `../_shared/references/mission-assurance-checklist.md` before release.
- If ice, surfacing, or rescue data is stale beyond mission tolerance, downgrade to advisory-only and elevate conservative routing.

## Guardrails

- Do not fabricate polynya availability, safe surfacing depth, or recovery timelines.
- Distinguish emergency routing from deliberate tactical repositioning.
- Surface strategic-signature and sovereignty risks before recommending breakout or allied support.
