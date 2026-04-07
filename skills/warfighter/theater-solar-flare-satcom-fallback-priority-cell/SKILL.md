---
name: theater-solar-flare-satcom-fallback-priority-cell
description: Support U.S. warfighter planning and decision support for theater SATCOM fallback priority governance during solar flare and space weather degradation events.
---

# Theater Solar Flare SATCOM Fallback Priority Cell

## Mission Scope

- Treat this skill as planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm mission-critical traffic classes, fallback authorities, and timing constraints before analysis.
- Keep products unclassified by default unless handling guidance is explicitly provided.

## Workflow

1. Frame the mission problem using current space-weather posture and SATCOM degradation indicators.
2. Define traffic-priority thresholds and branch triggers for fallback routing.
3. Build one recommended option plus at least two alternatives with explicit tradeoffs in latency, survivability, and mission continuity.
4. Integrate dependencies across space, cyber, C2, and coalition traffic exchange.
5. Convert recommendations into execution-ready products with owners and deadlines.

## Required Output Format

1. Situation snapshot.
2. Recommended option and rationale.
3. Alternative options and trigger conditions.
4. Decision points now/later/pre-delegated.
5. Staff tasking with owner and deadline.

## Domain Products

Primary products for this skill: satcom fallback priority ladder, traffic shedding matrix, commander release packet.

## Domain Tool Stack

Use these tool categories as the default stack for this skill: space weather warning boards, satcom link health monitors, mission traffic arbiters, continuity workflow tools.

## External Tools and Protocol Integration

- Use ../_shared/references/external-tools-protocols.md and ../_shared/references/tool-protocol-playbooks.md for packetized tool execution.
- Use at least one primary source and one cross-check source before final recommendations.
- Prefer protocol families: CCSDS, USMTF, Link 16 J-series, CoT, API/JSON.
- Include source provenance, refresh time (UTC), assumptions, and confidence.

## Guardrails

- Flag assumptions that exceed available evidence.
- Separate facts, assessments, and unknowns.
- Do not fabricate authorities, sources, or tool outputs.
- Require explicit human command approval for posture-changing recommendations.

## Domain Toolchain Defaults

- Primary: tool_suite_id=ts-theater-solar-flare-satcom-fallback-priority-v1 with protocol_stack_id=ps-theater-solar-flare-satcom-fallback-priority-stack-v1.
- Alternate: tool_suite_id=ts-space-satcom-v1 with protocol_stack_id=ps-space-satcom-resilience-stack-v1.
- Degraded: critical-traffic-only routing with fixed update windows and explicit confidence labels.

## Domain Packet Defaults

- Default packet IDs: DPL-SOLAR-FLARE-SATCOM-FALLBACK-001, DPL-SOLAR-FLARE-SATCOM-FALLBACK-002.
