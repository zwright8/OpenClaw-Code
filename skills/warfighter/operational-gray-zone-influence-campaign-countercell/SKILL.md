---
name: operational-gray-zone-influence-campaign-countercell
description: Counter persistent gray-zone influence campaigns aimed at operational access and alliance cohesion. Use when adversary activities remain below traditional armed conflict thresholds.
---

# Operational Gray Zone Influence Campaign Countercell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Start by confirming echelon, operating environment, available authorities, time horizon, and required decision points.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem using these core inputs: gray-zone indicators, influence channel mapping, partner-nation risk posture, and escalation constraints.
2. Identify assumptions, decision thresholds, and what intelligence or reporting would invalidate the current plan.
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

Primary products for this skill: gray-zone campaign counterplan, narrative vulnerability heatmap, partner action synchronization matrix.

## Domain Tool Stack

Use these tool categories as the default stack for this skill: influence network graph analytics, sanctions and illicit finance trackers, coalition messaging coordination boards.

## Protocol Profile

Preferred protocol families for this skill: STIX/TAXII, API/JSON, NATO APP-11/ADatP-3 aligned, USMTF.

## Domain Toolchain Defaults

- Primary:   `tool_suite_id=ts-gray-zone-influence-countercampaign-v1` with `protocol_stack_id=ps-gray-zone-influence-countercampaign-stack-v1`.
- Alternate:   `tool_suite_id=ts-strategic-competition-gray-zone-response-v1` with `protocol_stack_id=ps-strategic-competition-gray-zone-response-stack-v1`.
- Degraded: command-approved manual decision ledger with authenticated voice confirmation and UTC acknowledgment logging.

## External Tools and Protocol Integration

- Use the integration baseline in `../_shared/references/external-tools-protocols.md` and name the exact tools selected for this mission set.
- Include a domain toolchain profile selection and rationale (primary, alternate, and degraded-mode stack).
- Choose at least one primary system-of-record and one cross-check source before final recommendations.
- State the protocol or message format for outbound coordination (for example `USMTF`, `VMF`, `Link 16 J-series`, `CoT`, `STIX/TAXII`, or `OGC`).
- Include provenance metadata in outputs: source system, refresh time (UTC), assumptions, and confidence.

## Interoperability Validation Checklist

- Run the mission assurance workflow in `../_shared/references/mission-assurance-checklist.md` before final release.
- Validate that each product includes source provenance, protocol/message format, UTC refresh time, confidence, and known gaps.
- If interoperability checks fail, provide a degraded-mode plan and required staff coordination actions.

## Guardrails

- Flag gaps where assumptions exceed evidence.
- Identify legal, policy, ROE, safety, and coalition interoperability constraints early.
- Separate facts, assessed judgments, and unknowns.
- Do not fabricate classified sources, authorities, or approvals.

## Mission Tool Authority Gates

- Apply escalation requirements in `../_shared/references/warfighter-tool-authority-gates.md` for high-consequence recommendations.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for recommendations that can alter mission posture.
- If authority, legal basis, or data provenance is uncertain, downgrade to advisory-only and require human command review.

## Mission Tool and Protocol Catalog Binding

- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` to select concrete tool suites and protocol stacks for this domain.
- Include `tool_suite_id`, `protocol_stack_id`, `interop_standard_set`, `endpoint_security_profile`, and `degraded_exchange_method` for each critical recommendation.
- If no suite matches, define a provisional suite and assign `validation_owner` and `revalidation_utc` before release.

## Domain Packet Defaults

- Default packet IDs: DPL-GRAY-ZONE-INFLUENCE-COUNTERCAMPAIGN-001, DPL-STRATEGIC-COMPETITION-GRAY-ZONE-RESPONSE-001.
- If no packet fully matches, define a provisional packet and assign a validation owner before release.
