---
name: maritime-chokepoint-inspection-and-quarantine-control-cell
description: Manage vessel inspection priorities, quarantine enforcement, and flow continuity at critical maritime chokepoints during biological or contamination events. Use when commanders or staffs need mission-ready options with explicit tool/protocol bindings, authority gates, and degraded-mode branches.
---

# Maritime Chokepoint Inspection and Quarantine Control Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Start by confirming echelon, operating environment, available authorities, time horizon, and required decision points.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem using the latest operational context and critical dependencies.
2. Identify assumptions, decision thresholds, and indicators that invalidate the current plan.
3. Build primary and alternate options with explicit tradeoffs in tempo, survivability, sustainment burden, and escalation risk.
4. Integrate dependencies across command and control, movement/maneuver, fires/effects, intelligence, protection, sustainment, and information.
5. Produce commander-facing outputs plus a staff-action version with owners, suspense dates, and branch triggers.

## Required Output Format

Deliver results in this order:

1. Situation snapshot: current conditions and key changes since last update.
2. Recommended option: one clearly stated recommendation and rationale.
3. Alternative options: at least two alternatives with pros, cons, and trigger conditions.
4. Decision points: what must be decided now, later, or pre-delegated.
5. Staff tasking: who does what by when.

## Domain Products

Primary products for this skill: chokepoint inspection priority board, quarantine enforcement timeline, throughput continuity mitigation plan.

## External Tools and Protocol Integration

- Use the integration baseline in `../_shared/references/external-tools-protocols.md`.
- Prioritize these tools for this domain: maritime COP systems, port health surveillance platforms, vessel identity analytics, harbor operations dashboards.
- Prioritize these protocol families for this domain: AIS/NMEA, EDXL-DE/CAP, USMTF, API/JSON.
- Choose at least one primary system-of-record and one cross-check source before final recommendations.
- Include provenance metadata in outputs: source system, refresh time (UTC), assumptions, and confidence.

## Interoperability Validation Checklist

- Run the mission assurance workflow in `../_shared/references/mission-assurance-checklist.md` before final release.
- Validate each product includes source provenance, protocol/message format, UTC refresh time, confidence, and known gaps.
- If interoperability checks fail, provide a degraded-mode plan and required staff coordination actions.

## Authority and Human Approval Gates

- Apply escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md` for high-consequence recommendations.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for recommendations that can alter mission posture.
- If authority, legal basis, or data provenance is uncertain, downgrade to advisory-only and require human command review.

## Mission Tool and Protocol Catalog Binding

- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` to select concrete tool suites and protocol stacks for this domain.
- Include `tool_suite_id`, `protocol_stack_id`, `interop_standard_set`, `endpoint_security_profile`, and `degraded_exchange_method` for each critical recommendation.
- If no suite fits, define a provisional suite and assign `validation_owner` and `revalidation_utc` before release.

## Guardrails

- Flag gaps where assumptions exceed evidence.
- Separate facts, assessed judgments, and unknowns.
- Do not fabricate authorities, approvals, or source evidence.
