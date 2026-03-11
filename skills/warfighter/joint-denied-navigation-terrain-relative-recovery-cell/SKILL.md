---
name: joint-denied-navigation-terrain-relative-recovery-cell
description: Support U.S. warfighter planning and decision support for denied-navigation terrain-relative recovery and precision maneuver continuity. Use when GNSS disruption, spoofing, or PNT uncertainty threatens maneuver, fires timing, or mission safety.
---

# Joint Denied Navigation Terrain Relative Recovery Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Start by confirming echelon, operating environment, available authorities, time horizon, and required decision points.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem using these core inputs: contested PNT conditions, platform navigation health, terrain reference availability, and mission timing constraints.
2. Identify assumptions, decision thresholds, and what telemetry would invalidate the current navigation confidence posture.
3. Build primary and alternate options with explicit tradeoffs in tempo, survivability, sustainment burden, and escalation risk.
4. Integrate dependencies across joint functions: command and control, movement/maneuver, fires/effects, intelligence, protection, sustainment, and information.
5. Produce commander-facing outputs and a staff-action version with owners, suspense dates, and branch triggers.

## Required Output Format

Deliver results in this order:

1. Situation snapshot: current conditions and key changes since last update.
2. Recommended option: one clearly stated recommendation and rationale.
3. Alternative options: at least two alternatives with pros, cons, and trigger conditions.
4. Decision points: what must be decided now, later, or pre-delegated.
5. Staff tasking: who does what by when.

## Domain Products

Primary products for this skill: denied-PNT recovery branch plan, terrain-relative navigation confidence matrix, precision-maneuver timing compensation packet.

## External Tools and Protocol Integration

- Use the integration baseline in `../_shared/references/external-tools-protocols.md` and name the exact tools selected for this mission set.
- Prioritize `tool_suite_id=ts-denied-pnt-terrain-nav-recovery-v1` and `protocol_stack_id=ps-denied-pnt-terrain-nav-recovery-stack-v1` for critical recommendations.
- Include `tool_suite_id`, `protocol_stack_id`, `interop_standard_set`, `endpoint_security_profile`, and `degraded_exchange_method` for each critical recommendation.
- Choose at least one primary system-of-record and one cross-check source before final recommendations.

## Guardrails

- Flag gaps where assumptions exceed evidence.
- Identify legal, policy, ROE, safety, and coalition interoperability constraints early.
- Separate facts, assessed judgments, and unknowns.
- Do not fabricate classified sources, authorities, or approvals.
