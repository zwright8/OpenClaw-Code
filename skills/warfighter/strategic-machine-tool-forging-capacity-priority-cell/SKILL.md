---
name: strategic-machine-tool-forging-capacity-priority-cell
description: Prioritize scarce machine-tool, die, and forging capacity across defense production and depot repair under mobilization pressure. Use when aircraft, ship, vehicle, missile, or depot throughput depends on constrained heavy-manufacturing bottlenecks.
---

# Strategic Machine Tool Forging Capacity Priority Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm production lines in scope, repair demand, tooling constraints, power or workforce limits, and commander decision timelines before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the manufacturing network, constrained machine tools, forging presses, heat-treatment queues, and mission demand tiers.
2. Detect the bottlenecks most likely to fracture sortie generation, depot throughput, ship repair, or munition production.
3. Build reallocation, surge-shift, outsourcing, repair, and substitution branches with explicit readiness, quality, and schedule tradeoffs.
4. Bind each recommendation to concrete industrial tooling, production telemetry, and packetized command outputs.

## Required Output Format

1. Situation snapshot.
2. Recommended priority branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Machine-tool and forging packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: machine-tool priority matrix, forging bottleneck watchlist, and surge-capacity reallocation board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-machine-tool-forging-capacity-priority-v1` with `protocol_stack_id=ps-strategic-machine-tool-forging-capacity-priority-stack-v1`.
- Alternate: manual industrial bottleneck board plus depot-demand adjudication worksheet.
- Degraded: mission-essential orders only with daily commander-approved capacity release.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-MACHINE-TOOL-FORGING-001` for critical recommendations.
- Prioritize these protocol families for this domain: signed production manifests, `API/JSON`, `USMTF`, and `OPC UA`.
- Include source system, refresh UTC, confidence, constrained machines or dies, and unresolved quality gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run production-readiness checks from `../_shared/references/mission-assurance-checklist.md`.
- If tool health, quality evidence, or release authority is uncertain, downgrade to advisory-only and assign remediation owners.

## Guardrails

- Do not fabricate spindle availability, forging capacity, die life, or quality-release confidence.
- Separate observed bottlenecks from inferred sabotage or workforce causes.
- Surface safety, metallurgy, export-control, and schedule-slip consequences early.
