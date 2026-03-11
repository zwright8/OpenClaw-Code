---
name: strategic-critical-mineral-refinery-defense-and-restart-cell
description: Support U.S. warfighter and strategic support planning for critical-mineral refinery defense and restart sequencing. Use when adversary sabotage, cyber disruption, or infrastructure attack threatens defense-industrial sustainment.
---

# Strategic Critical Mineral Refinery Defense And Restart Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Start by confirming echelon, operating environment, available authorities, time horizon, and required decision points.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem using these core inputs: refinery status, feedstock availability, industrial dependencies, and defense-priority demand.
2. Identify assumptions, decision thresholds, and what signals invalidate restart feasibility.
3. Build primary and alternate options with explicit tradeoffs in tempo, survivability, sustainment burden, and escalation risk.
4. Integrate dependencies across cyber defense, infrastructure protection, logistics, and industrial mobilization cells.
5. Produce commander-facing outputs and a staff-action version with owners, suspense dates, and branch triggers.

## Required Output Format

Deliver results in this order:

1. Situation snapshot.
2. Recommended option.
3. Alternative options.
4. Decision points.
5. Staff tasking.

## Domain Products

Primary products for this skill: refinery defense posture scorecard, restart sequencing plan, critical-mineral allocation risk board.

## External Tools and Protocol Integration

- Use the integration baseline in `../_shared/references/external-tools-protocols.md` and name the exact tools selected for this mission set.
- Prioritize `tool_suite_id=ts-critical-mineral-refinery-defense-restart-v1` and `protocol_stack_id=ps-critical-mineral-refinery-defense-restart-stack-v1`.
- Include `tool_suite_id`, `protocol_stack_id`, `validation_owner`, and `degraded_exchange_method` for each critical recommendation.
- Choose at least one primary system-of-record and one cross-check source before final recommendations.

## Guardrails

- Flag gaps where assumptions exceed evidence.
- Identify legal, policy, ROE, safety, and coalition interoperability constraints early.
- Separate facts, assessed judgments, and unknowns.
- Do not fabricate classified sources, authorities, or approvals.
