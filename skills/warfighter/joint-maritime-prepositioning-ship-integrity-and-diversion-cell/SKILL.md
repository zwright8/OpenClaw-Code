---
name: joint-maritime-prepositioning-ship-integrity-and-diversion-cell
description: Manage structural, cyber, and cargo-integrity risk for maritime prepositioning ships while coordinating diversion options.
---

# Joint Maritime Prepositioning Ship Integrity And Diversion Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Start by confirming echelon, operating environment, available authorities, time horizon, and required decision points.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem using these core inputs: hull and machinery status, cargo readiness reports, route threats, and port acceptance constraints.
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

Primary products for this skill: ship integrity status board, diversion and reroute matrix, cargo readiness recovery plan.

## External Tools and Protocol Integration

- Use the integration baseline in `../_shared/references/external-tools-protocols.md`.
- Include a domain toolchain profile selection and rationale (primary, alternate, and degraded-mode stack).
- Prioritize mission-fit tool families and define exact outbound message format (`USMTF`, `VMF`, `Link 16 J-series`, `CoT`, `STIX/TAXII`, `OGC`, or `API/JSON`) per recommendation.
- Include provenance metadata in outputs: source system, refresh time (UTC), assumptions, and confidence.

## Interoperability Validation Checklist

- Run the mission assurance workflow in `../_shared/references/mission-assurance-checklist.md` before final release.
- Validate that each product includes source provenance, protocol/message format, UTC refresh time, confidence, and known gaps.
- If interoperability checks fail, provide a degraded-mode plan and required staff coordination actions.

## Tool Invocation Contract

- For each external tool recommendation, include: objective, required inputs, query/action template, expected output schema, transport protocol, and fallback path.
- Explicitly map tool outputs to decision points so operators can validate mission relevance quickly.
- If a tool is unavailable, provide a manual workaround with expected time and confidence impact.

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

## Domain Toolchain Override (2026-03-09, Maritime Prepositioning Integrity and Diversion)

- Prioritize `tool_suite_id=ts-maritime-prepositioning-integrity-diversion-v1` with `protocol_stack_id=ps-maritime-prepositioning-integrity-diversion-stack-v1` for this mission set when indicators exceed baseline risk thresholds.
- Use packet `DPL-MARITIME-PREPOSITIONING-INTEGRITY-DIVERSION-001` to bind machine-ingestible tasking fields, commander decision prompts, and degraded-mode controls.
- If data freshness, acknowledgment integrity, or authority validation fails, downgrade to advisory-only and require explicit command approval.
