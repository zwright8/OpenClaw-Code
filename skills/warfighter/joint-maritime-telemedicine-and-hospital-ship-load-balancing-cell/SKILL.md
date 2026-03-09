---
name: joint-maritime-telemedicine-and-hospital-ship-load-balancing-cell
description: Coordinate maritime telemedicine triage and hospital-ship patient load balancing during distributed littoral operations.
---

# Joint Maritime Telemedicine and Hospital Ship Load Balancing Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm command echelon, mission phase, authorities, coalition constraints, and required commander decisions.
- Keep output unclassified by default unless handling guidance is provided.

## Workflow

1. Frame mission problem with time constraints, threat picture, force posture, and readiness state.
2. Build one recommended COA plus at least two alternatives with explicit tradeoffs.
3. Identify branch/sequel triggers, data dependencies, and command approval gates.
4. Bind each critical recommendation to external tools, protocol stack, and degraded-mode fallback.
5. Publish staff-action tasks with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes
2. Recommended COA and rationale
3. Alternative COAs with triggers
4. Decision points and escalation gates
5. Staff task tracker with owners/suspense
6. Tool invocation packets and protocol bindings

## Domain Products

Primary products for this skill: patient flow balancing plan, telemedicine escalation ladder, afloat care-capacity forecast.

## Domain Tooling and Protocol Baseline

- Preferred external toolsets for this domain: telemedicine orchestration platforms, afloat bed-status boards, medevac route planners.
- Preferred protocol profiles for coordination and machine exchange: HL7/FHIR, USMTF, API/JSON.
- Use ../_shared/references/warfighter-external-tool-and-protocol-catalog.md to select tool_suite_id and protocol_stack_id.
- Use ../_shared/references/domain-tool-packet-library.md to select packet_id and protocol_profile.

## Interoperability and Trust Validation

- Run ../_shared/references/mission-assurance-checklist.md prior to release.
- Apply authority and escalation controls from ../_shared/references/warfighter-tool-authority-gates.md.
- Include provenance, UTC freshness, confidence, and known-gap declarations for every critical recommendation.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag legal, ROE, LOAC, policy, and coalition caveat constraints before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
- If data trust or authority is below threshold, downgrade to advisory-only and request human command decision.
