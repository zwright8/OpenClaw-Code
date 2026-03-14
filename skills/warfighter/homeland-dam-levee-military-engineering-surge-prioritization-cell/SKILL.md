---
name: homeland-dam-levee-military-engineering-surge-prioritization-cell
description: Prioritize military engineering support for threatened dams, levees, and flood-control nodes in homeland defense missions. Use when commanders must sequence scarce engineer forces against cascading civil and military risk.
---

# Homeland Dam Levee Military Engineering Surge Prioritization Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm civil authority requests, engineer force availability, flood risk, transport dependencies, and decision timelines before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the infrastructure network, flood scenarios, military dependencies, and civil life-safety priorities.
2. Build reinforce, evacuate, isolate, restore, and reallocate branches with explicit time, force, and consequence tradeoffs.
3. Bind each recommendation to concrete hydrology, engineering, and emergency-management tools plus packetized outputs.
4. Publish degraded-mode branches when engineer availability, site access, or flood-model confidence falls below threshold.

## Required Output Format

1. Situation snapshot.
2. Recommended engineer-support branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Engineer surge packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: engineer prioritization matrix, flood-consequence branch ladder, and civil-military support allocation board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-dam-levee-engineer-surge-v1` with `protocol_stack_id=ps-homeland-dam-levee-engineer-surge-stack-v1`.
- Alternate: state/federal coordination board plus manual flood-priority worksheet.
- Degraded: life-safety-first engineer allocation with hourly command sync.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-DAM-LEVEE-ENGINEER-SURGE-001` for critical recommendations.
- Prioritize these protocol families for this domain: `NIMS/ICS`, `USMTF`, `API/JSON`, and `OGC`.
- Include source system, refresh UTC, confidence, authority basis, and infrastructure gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run mission-assurance and DSCA coordination checks from `../_shared/references/mission-assurance-checklist.md`.
- If civil authority, site condition, or consequence-model integrity is uncertain, downgrade to advisory-only and assign closure actions.

## Guardrails

- Do not fabricate flood forecasts, engineer capacity, or civil authority requests.
- Surface life-safety, environmental, and transport-disruption implications early.
- Treat public-warning and evacuation timing as commander and civil-authority decisions.
