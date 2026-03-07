---
name: joint-uncrewed-medevac-swarm-deconfliction-cell
description: Coordinate autonomous and crewed casualty evacuation traffic in high-threat theaters. Use when contested evacuation corridors require deconfliction, triage prioritization, and resilient routing.
---

# Joint Uncrewed MEDEVAC Swarm Deconfliction Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm echelon, environment, authorities, time horizon, and decision points before analysis.
- Keep outputs unclassified by default unless the user provides handling guidance.

## Workflow

1. Frame the mission problem with command intent, constraints, and assumptions.
2. Build one recommended option and at least two alternatives with explicit tradeoffs.
3. Bind recommendations to mission dependencies across joint functions and coalition touchpoints.
4. Tie each recommendation to observable triggers, branch conditions, and revalidation checks.
5. Publish commander-readable and staff-action products with owners and suspense.

## Required Output Format

Deliver in this order:

1. Situation snapshot.
2. Recommended option.
3. Alternative options.
4. Decision points and triggers.
5. Staff tasking with owners and suspense.

## Domain Products

Primary products for this skill: Casualty evacuation lane plan, risk-prioritized sortie table, medevac fallback matrix.

## External Tools and Protocol Integration

- Use the baseline in `../_shared/references/external-tools-protocols.md` and select a mission-fit toolchain profile.
- Include one primary system-of-record and one cross-check source for critical outputs.
- State the protocol/transport for outbound coordination (for example `USMTF`, `VMF`, `Link 16 J-series`, `CoT`, `STIX/TAXII`, `OGC`).
- Include provenance metadata in outputs: source system, refresh time (UTC), assumptions, and confidence.

## Tool Invocation Contract

For each external tool recommendation, include objective, required inputs, query/action template, expected schema, protocol/transport, and fallback path.

## Mission Tool Authority Gates

- Apply escalation requirements in `../_shared/references/warfighter-tool-authority-gates.md` for high-consequence recommendations.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for recommendations that can alter mission posture.
- If authority, legality, or data provenance is uncertain, downgrade to advisory-only and request human command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` before final release.
- Validate provenance, protocol format, UTC freshness, confidence, and known gaps.
- If checks fail, provide a degraded-mode plan with explicit risk effects.

## Guardrails

- Flag assumptions that exceed evidence.
- Separate facts, assessed judgments, and unknowns.
- Identify legal, policy, ROE, safety, and coalition constraints early.
- Do not provide weapon-employment procedures or bypasses to safeguards.

## Cross-Domain Integration Playbook

- Use `../_shared/references/cross-domain-integration-playbook.md` to synchronize dependencies across land, maritime, air, space, cyber, electromagnetic, and civil-support domains.
- Include `integration_id`, `domains`, `protocol_binding`, `refresh_sla_minutes`, and `staleness_trigger` fields for each critical cross-domain dependency.
- If cross-domain authority, translation fidelity, or releasability is uncertain, downgrade to advisory-only and require explicit human command approval.

## Mission Tool and Protocol Catalog Binding

- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` to select concrete tool suites and protocol stacks for this domain.
- Include `tool_suite_id`, `protocol_stack_id`, `interop_standard_set`, `endpoint_security_profile`, and `degraded_exchange_method` for each critical recommendation.
- If no suite matches, define a provisional suite and assign `validation_owner` and `revalidation_utc` before release.

