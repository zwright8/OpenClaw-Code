---
name: strategic-harbor-tug-pilotage-sealift-priority-cell
description: Prioritize scarce harbor tugs, pilots, and berth-movement windows to keep military sealift on schedule under disruption. Use when port throughput is constrained by tug attrition, pilot shortages, channel restrictions, or contested operations.
---

# Strategic Harbor Tug Pilotage Sealift Priority Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm port status, vessel queues, hazardous cargo restrictions, pilotage rules, and commander decision timelines before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame berth demand, tug availability, pilot rosters, channel constraints, and military sealift priorities.
2. Detect shortages, weather delays, labor gaps, escort constraints, or harbor-control failures that can degrade force flow.
3. Build prioritize, defer, reroute, surge, and convoy-protect branches with explicit throughput and safety tradeoffs.
4. Bind each recommendation to concrete harbor-movement, tug-allocation, and packetized sealift outputs.

## Required Output Format

1. Situation snapshot.
2. Recommended harbor-priority branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Harbor tug and pilotage packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: berth-movement priority board, tug and pilotage assignment matrix, and sealift slip-risk ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-harbor-tug-pilotage-sealift-priority-v1` with `protocol_stack_id=ps-strategic-harbor-tug-pilotage-sealift-priority-stack-v1`.
- Alternate: manual berth board plus harbor-master adjudication worksheet.
- Degraded: military-essential sailings only with fixed tug and pilot release windows.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-HARBOR-TUG-PILOTAGE-SEALIFT-001` for critical recommendations.
- Prioritize these protocol families for this domain: `AIS/NMEA`, `OGC`, signed port manifests, `API/JSON`, and `USMTF`.
- Include source system, refresh UTC, confidence, constrained harbor resources, and unresolved movement-safety gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run movement-safety and release checks from `../_shared/references/mission-assurance-checklist.md`.
- If harbor authority, pilotage status, or tug readiness is uncertain, downgrade to advisory-only and assign remediation owners.

## Guardrails

- Do not fabricate berth windows, pilot availability, tug readiness, or port-clearance authority.
- Separate observed movement bottlenecks from inferred hostile cause.
- Surface hazardous-cargo, crew-rest, and harbor-safety implications early.
