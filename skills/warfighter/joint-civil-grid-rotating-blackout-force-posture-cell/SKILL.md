---
name: joint-civil-grid-rotating-blackout-force-posture-cell
description: Support force posture and mission continuity decisions during rotating civil grid blackouts. Use when military operations must adapt to unstable commercial power availability.
---

# Joint Civil Grid Rotating Blackout Force Posture Cell

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

Primary products for this skill: blackout-to-force-posture impact board, mission-priority load shed matrix, backup power activation ladder

## External Tools and Protocol Integration

- Use ../_shared/references/warfighter-external-tool-and-protocol-catalog.md and bind outputs to tool_suite_id=ts-joint-civil-grid-rotating-blackout-force-posture-v1 and protocol_stack_id=ps-joint-civil-grid-rotating-blackout-force-posture-stack-v1.
- Primary tools for this domain: grid outage forecast services, base load telemetry monitors, mission-priority power orchestration workflows
- Required exchange protocols/formats for this domain: NIMS/ICS, USMTF, OGC WMS/WFS/WMTS, API/JSON
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
