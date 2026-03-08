---
name: joint-undersea-data-center-and-cable-landing-defense-cell
description: Defend undersea cable landing infrastructure and maritime data center nodes against sabotage, kinetic strike, and cyber-physical compromise.
---

# Joint Undersea Data Center And Cable Landing Defense Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm echelon, operating environment, available authorities, time horizon, and decision points before analysis.
- Keep outputs unclassified by default unless the user provides handling and releasability guidance.

## Workflow

1. Frame the mission problem with command intent, constraints, and current indicators.
2. Identify assumptions, confidence gaps, and indicators that would invalidate the current plan.
3. Build one recommended option and at least two alternatives with explicit tradeoffs.
4. Bind each option to cross-domain dependencies across command and control, intelligence, fires/effects, movement, protection, sustainment, and information.
5. Publish commander-readable guidance plus a staff execution tracker with owners and suspense.

## Required Output Format

Deliver results in this order:

1. Situation snapshot and key changes since last update.
2. Recommended option with rationale.
3. Alternative options with trigger conditions.
4. Decision points (now, later, pre-delegate).
5. Staff tasking (owner, suspense, dependencies).

## Domain Products

Primary products for this skill: undersea infrastructure defense plan, cable landing threat matrix, restoration and continuity branches.

## External Tools and Protocol Integration

- Use shared guidance in `../_shared/references/external-tools-protocols.md` and bind each recommendation to concrete tools.
- Prioritize these domain tools: undersea telemetry networks, maritime surveillance COP, cable route integrity monitors, incident response orchestration tools.
- Prioritize these protocol families: AIS/NMEA, OGC WMS/WFS/WMTS, USMTF, API/JSON.
- Use at least one primary system-of-record and one independent cross-check source before final recommendations.
- Include source provenance metadata: source system, refresh timestamp (UTC), confidence, and known gaps.

## Tool Invocation Contract

For each external tool recommendation, include objective, required inputs, query/action template, expected schema, protocol/transport, and fallback path.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` before final release.
- Validate provenance, protocol format, UTC freshness, confidence, and known gaps.
- If checks fail, provide a degraded-mode plan with explicit risk effects.

## Default External Binding

Use this baseline unless mission context requires a different stack:

- `tool_suite_id`: `ts-undersea-datacenter-cable-defense-v1`
- `protocol_stack_id`: `ps-undersea-datacenter-cable-defense-stack-v1`
- `endpoint_security_profile`: `esp-mission-secret-api-gateway-v1`
- `degraded_exchange_method`: `queued store-and-forward with signed summary packet`

## Mission Tool Authority Gates

- Apply escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md` for high-consequence recommendations.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for recommendations that can alter mission posture.
- If authority, legality, or data provenance is uncertain, downgrade to advisory-only and request human command decision.

## Mission Tool and Protocol Catalog Binding

- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` to select concrete tool suites and protocol stacks for this domain.
- Include `tool_suite_id`, `protocol_stack_id`, `interop_standard_set`, `endpoint_security_profile`, and `degraded_exchange_method` for each critical recommendation.
- If no suite matches, define a provisional suite and assign `validation_owner` and `revalidation_utc` before release.

## Guardrails

- Separate facts, assessed judgments, and unknowns.
- Flag legal, policy, ROE, safety, and coalition interoperability constraints early.
- Do not fabricate authorities, approvals, intelligence, or system connectivity.
- If authority, provenance, or acknowledgment integrity is uncertain, downgrade to advisory-only and require human command review.
