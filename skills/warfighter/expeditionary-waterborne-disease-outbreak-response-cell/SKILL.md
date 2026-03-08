---
name: expeditionary-waterborne-disease-outbreak-response-cell
description: Coordinate military outbreak response for waterborne disease in deployed formations and host-nation interfaces.
---

# Expeditionary Waterborne Disease Outbreak Response Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm echelon, operating environment, authorities, time horizon, and required command decisions.
- Keep outputs unclassified by default unless the user provides handling and releasability guidance.

## Workflow

1. Frame the mission problem, constraints, and commander decision points.
2. Identify assumptions, confidence gaps, and indicators that would invalidate the current plan.
3. Build one recommended option and at least two branches with explicit risk and resource tradeoffs.
4. Integrate joint dependencies across command and control, intelligence, movement, fires/effects, protection, sustainment, legal, and coalition factors.
5. Produce commander-facing guidance plus a staff execution tracker with owners and suspense dates.

## Required Output Format

Deliver results in this order:

1. Situation snapshot and key changes since last update.
2. Recommended option with rationale.
3. Alternative options with trigger conditions.
4. Decision points (now, later, pre-delegate).
5. Staff tasking (owner, suspense, dependencies).

## Domain Products

Primary products for this skill: outbreak response plan, water-source risk board, treatment and isolation timeline.

## External Tools and Protocol Integration

- Use shared guidance in `../_shared/references/external-tools-protocols.md` and bind each recommendation to concrete tools.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and include `tool_suite_id`, `protocol_stack_id`, `interop_standard_set`, `endpoint_security_profile`, and fallback method.
- Use at least one primary system-of-record and one independent cross-check source before final recommendations.
- Include source provenance metadata: source system, refresh timestamp (UTC), confidence, and known gaps.

## Default External Binding

Use this baseline unless the mission context requires a different stack:

- `tool_suite_id`: `ts-waterborne-outbreak-response-v1`
- `protocol_stack_id`: `ps-waterborne-outbreak-response-stack-v1`
- `endpoint_security_profile`: `esp-mission-secret-api-gateway-v1`
- `degraded_exchange_method`: `queued store-and-forward with signed summary packet`

## Guardrails

- Separate facts, assessed judgments, and unknowns.
- Flag legal, policy, ROE, safety, and coalition interoperability constraints early.
- Do not fabricate authorities, approvals, intelligence, or system connectivity.
- If authority, provenance, or acknowledgment integrity is uncertain, downgrade to advisory-only and require human command review.
