---
name: joint-biothreat-forward-diagnostics-and-quarantine-cell
description: Support U.S. warfighter force-health planning for forward biothreat diagnostics and quarantine branch decisions. Use when expeditionary outbreaks, suspicious clusters, or adversary bio events threaten mission continuity.
---

# Joint Biothreat Forward Diagnostics And Quarantine Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Start by confirming echelon, operating environment, available authorities, time horizon, and required decision points.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem using these core inputs: symptom clusters, diagnostic capacity, quarantine infrastructure, and operational impact.
2. Identify assumptions, decision thresholds, and what surveillance data invalidates current containment recommendations.
3. Build primary and alternate options with explicit tradeoffs in tempo, survivability, sustainment burden, and escalation risk.
4. Integrate dependencies across medical, logistics, legal-policy, and coalition coordination channels.
5. Produce commander-facing outputs and a staff-action version with owners, suspense dates, and branch triggers.

## Required Output Format

Deliver results in this order:

1. Situation snapshot.
2. Recommended option.
3. Alternative options.
4. Decision points.
5. Staff tasking.

## Domain Products

Primary products for this skill: forward diagnostic surge plan, quarantine trigger matrix, force-health continuity branch order.

## External Tools and Protocol Integration

- Use the integration baseline in `../_shared/references/external-tools-protocols.md` and name the exact tools selected for this mission set.
- Prioritize `tool_suite_id=ts-forward-biothreat-diagnostics-quarantine-v1` and `protocol_stack_id=ps-forward-biothreat-diagnostics-quarantine-stack-v1`.
- Include `tool_suite_id`, `protocol_stack_id`, `interop_standard_set`, and `endpoint_security_profile` for each critical recommendation.
- Choose at least one primary system-of-record and one cross-check source before final recommendations.

## Guardrails

- Flag gaps where assumptions exceed evidence.
- Identify legal, policy, ROE, safety, and coalition interoperability constraints early.
- Separate facts, assessed judgments, and unknowns.
- Do not fabricate classified sources, authorities, or approvals.
