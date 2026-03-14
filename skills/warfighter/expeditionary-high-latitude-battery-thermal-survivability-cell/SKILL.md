---
name: expeditionary-high-latitude-battery-thermal-survivability-cell
description: Preserve battery survivability and charging reliability in extreme cold, low-sun, and high-wind expeditionary operations. Use when unmanned systems, sensors, vehicles, or cold-weather power packs risk thermal collapse.
---

# Expeditionary High Latitude Battery Thermal Survivability Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm mission climate bands, battery chemistries, charging constraints, and commander decision timelines before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the battery demand, climate exposure, recharge capacity, and thermal-risk indicators across supported platforms.
2. Build one recommended survivability branch plus alternatives to pre-heat, insulate, rotate, or shed loads.
3. Bind each recommendation to battery-health, cold-weather forecast, and energy-distribution tools with explicit protocolized outputs.
4. Publish degraded-mode branches when charging confidence, thermal telemetry, or energy transport falls below threshold.

## Required Output Format

1. Situation snapshot.
2. Recommended survivability branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now, next, and pre-delegated.
5. Staff tasking by owner and suspense.
6. High-latitude battery packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: battery thermal-risk board, charging rotation ladder, cold-weather power preservation matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-expeditionary-high-latitude-battery-thermal-survivability-v1` with `protocol_stack_id=ps-expeditionary-high-latitude-battery-thermal-survivability-stack-v1`.
- Alternate: cold-weather energy board plus manual battery-swap tracker.
- Degraded: mission-essential battery loads only with manual thermal checks and commander-approved charging windows.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-HIGH-LATITUDE-BATTERY-THERMAL-001` for critical recommendations.
- Prioritize these protocol families for this domain: signed battery-health manifests, `CoT`, `API/JSON`, and `USMTF`.
- Include source system, refresh UTC, confidence, battery chemistry, and unresolved cold-soak or charging gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run assurance checks from `../_shared/references/us-joint-protocol-assurance-drill.md` and `../_shared/references/mission-assurance-checklist.md`.
- If thermal telemetry, load-shed authority, or replacement-stock confidence is uncertain, downgrade to advisory-only and require human command review.

## Guardrails

- Do not fabricate temperature exposure, battery state-of-health, or charging availability.
- Separate forecasted thermal risk from observed battery damage or runaway.
- Flag aviation, medical, and autonomous-system priority conflicts early.
