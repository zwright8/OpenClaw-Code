---
name: coalition-detainee-transfer-assurance-and-legal-observability-cell
description: Support U.S. and coalition warfighter planning for detainee transfer assurance and legal observability. Use when custody transitions require synchronized legal checks, identity assurance, and partner-force accountability.
---

# Coalition Detainee Transfer Assurance And Legal Observability Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Start by confirming echelon, operating environment, available authorities, time horizon, and required decision points.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem using these core inputs: detainee roster status, transfer authorities, partner-force custody posture, and legal-observability requirements.
2. Identify assumptions, decision thresholds, and what audit signals invalidate transfer readiness.
3. Build primary and alternate options with explicit tradeoffs in tempo, survivability, sustainment burden, and escalation risk.
4. Integrate dependencies across legal, intelligence, force protection, and coalition coordination channels.
5. Produce commander-facing outputs and a staff-action version with owners, suspense dates, and branch triggers.

## Required Output Format

Deliver results in this order:

1. Situation snapshot.
2. Recommended option.
3. Alternative options.
4. Decision points.
5. Staff tasking.

## Domain Products

Primary products for this skill: detainee transfer legal-compliance matrix, custody observability audit packet, coalition transfer risk decision brief.

## External Tools and Protocol Integration

- Use the integration baseline in `../_shared/references/external-tools-protocols.md` and name the exact tools selected for this mission set.
- Prioritize `tool_suite_id=ts-coalition-detainee-transfer-legal-observability-v1` and `protocol_stack_id=ps-coalition-detainee-transfer-legal-observability-stack-v1`.
- Include `tool_suite_id`, `protocol_stack_id`, `validation_owner`, and `degraded_exchange_method` for each critical recommendation.
- Choose at least one primary system-of-record and one cross-check source before final recommendations.

## Guardrails

- Flag gaps where assumptions exceed evidence.
- Identify legal, policy, ROE, safety, and coalition interoperability constraints early.
- Separate facts, assessed judgments, and unknowns.
- Do not fabricate classified sources, authorities, or approvals.
