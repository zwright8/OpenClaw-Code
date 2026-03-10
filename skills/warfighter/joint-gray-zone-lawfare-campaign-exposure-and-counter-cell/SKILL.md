---
name: joint-gray-zone-lawfare-campaign-exposure-and-counter-cell
description: Expose and counter coordinated gray-zone lawfare campaigns targeting U.S. and allied military freedom of action. Use when adversaries exploit legal narratives to constrain operations.
---

# Joint Gray Zone Lawfare Campaign Exposure and Counter Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter missions.
- Confirm echelon, authorities, timeline, and decision owners before analysis.
- Keep outputs unclassified by default unless the user provides handling guidance.

## Workflow

1. Frame the mission problem with constraints, threats, and time-critical dependencies.
2. Identify assumptions, decision thresholds, and invalidation triggers.
3. Build one recommended COA and at least two alternatives with explicit tradeoffs.
4. Bind each recommendation to explicit tools, protocols, data freshness, and authority gates.
5. Produce a commander summary and staff action tracker with owners and suspense.

## Required Output Format

1. Situation snapshot.
2. Recommended option.
3. Alternative options.
4. Decision points and branch triggers.
5. Staff tasking with owners and suspense dates.

## Domain Products

Primary products for this skill: lawfare influence map, legal-risk-to-operational-impact matrix, counter-campaign release plan

## External Tools and Protocol Integration

- Use ../_shared/references/warfighter-external-tool-and-protocol-catalog.md and bind outputs to tool_suite_id=ts-gray-zone-lawfare-counter-v1 and protocol_stack_id=ps-gray-zone-lawfare-counter-stack-v1.
- Primary tools for this domain: legal-claim knowledge graphs, narrative attribution telemetry, coalition legal-policy coordination portals
- Required exchange protocols/formats for this domain: STIX/TAXII, NIEM, USMTF, API/JSON
- Include interop_standard_set, endpoint_security_profile, primary_exchange_path, and degraded_exchange_method for each critical recommendation.

## Tool Invocation Contract

For every external dependency include objective, required inputs, query/action template, expected output schema, protocol/transport, timeout, and fallback path.

## Mission Tool Authority Gates

- Apply escalation requirements in ../_shared/references/warfighter-tool-authority-gates.md.
- Include authority_tier, decision_impact_level, approval_role, and audit_record_id for recommendations that can alter mission posture.
- If authority, legal basis, or data provenance is uncertain, downgrade to advisory-only and require human command approval.

## Interoperability Validation Checklist

- Run ../_shared/references/mission-assurance-checklist.md before final release.
- Validate protocol format, UTC freshness, confidence, provenance, and known gaps.
- If validation fails, publish a degraded-mode branch with explicit risk impacts.

## Guardrails

- Separate facts, assessed judgments, and unknowns.
- Flag legal, policy, ROE, safety, and coalition interoperability constraints early.
- Do not provide weapon-employment procedures or safeguard bypasses.
