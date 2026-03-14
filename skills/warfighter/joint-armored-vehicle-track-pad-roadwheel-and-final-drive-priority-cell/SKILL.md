---
name: joint-armored-vehicle-track-pad-roadwheel-and-final-drive-priority-cell
description: Prioritize track pads, roadwheels, final drives, and running gear repair for armored fleets under high wear and limited spares. Use when maneuver readiness is constrained by ground mobility consumables.
---

# Joint Armored Vehicle Track Pad Roadwheel And Final Drive Priority Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm affected fleets, mission priorities, terrain wear factors, maintenance capacity, and release authority before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the readiness shortfall, running-gear failures, repair queues, and maneuver priorities.
2. Build allocate, repair, cannibalize, reroute, and training-curtail branches with explicit mobility and survivability tradeoffs.
3. Bind each recommendation to maintenance, fleet-health, and supply tools plus protocolized outputs.
4. Publish degraded-mode branches when spare pedigree, repair throughput, or convoy delivery timelines fall below threshold.

## Required Output Format

1. Situation snapshot.
2. Recommended running-gear branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Armored running-gear packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: running-gear priority matrix, repair-versus-cannibalization board, and maneuver-readiness risk ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-armored-vehicle-running-gear-priority-v1` with `protocol_stack_id=ps-joint-armored-vehicle-running-gear-priority-stack-v1`.
- Alternate: brigade maintenance board plus depot-spares witness.
- Degraded: mission-essential tracked fleets only with commander-approved training reductions.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-ARMORED-RUNNING-GEAR-001` for critical recommendations.
- Prioritize these protocol families for this domain: signed supply manifests, `API/JSON`, `USMTF`, and `NIEM`.
- Include source system, refresh UTC, confidence, failure rates, and unresolved spare-delivery gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run mission-assurance and readiness checks from `../_shared/references/readiness-certification-evidence-pack.md`.
- If spare pedigree, maintenance release, or readiness certification is uncertain, downgrade to advisory-only and require human command review.

## Guardrails

- Do not fabricate parts availability, final-drive condition, or repair completion.
- Separate wear-driven failures from sabotage or quality-control indicators.
- Flag breach, counterattack, and air-defense escort formations whose mobility risk is unusually time-sensitive.
