---
name: joint-dispersed-airbase-mobile-precision-approach-and-lighting-cell
description: Restore mobile precision-approach, landing-lighting, and low-visibility recovery capability at dispersed or damaged airbases. Use when runway availability exists but recoveries are constrained by navigation aids, lighting, or weather minima.
---

# Joint Dispersed Airbase Mobile Precision Approach And Lighting Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm runway status, aircraft recovery requirements, navigation-aid constraints, and commander decision timelines before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the runway network, weather minima, mobile-approach assets, and airfield threat picture.
2. Build one recommended recovery branch plus alternatives to relocate, restrict, sequence, or manually recover aircraft.
3. Bind each recommendation to airfield-status, mobile-lighting, and approach-certification tools with explicit protocolized outputs.
4. Publish degraded-mode branches when navigational confidence, lighting power, or crew release authority falls below threshold.

## Required Output Format

1. Situation snapshot.
2. Recommended recovery branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now, next, and pre-delegated.
5. Staff tasking by owner and suspense.
6. Mobile precision-approach packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: mobile approach certification board, lighting restoration ladder, low-visibility recovery matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-dispersed-airbase-mobile-precision-approach-lighting-v1` with `protocol_stack_id=ps-joint-dispersed-airbase-mobile-precision-approach-lighting-stack-v1`.
- Alternate: airfield recovery board plus manual lighting and obstacle survey log.
- Degraded: day-VMC or restricted-minima operations only with commander-approved runway release.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-MOBILE-PRECISION-APPROACH-001` for critical recommendations.
- Prioritize these protocol families for this domain: `AIXM/FIXM`, `USMTF`, `Link 16 J-series`, signed maintenance manifests, and `API/JSON`.
- Include source system, refresh UTC, confidence, runway lighting status, and unresolved obstacle or navigation gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run assurance checks from `../_shared/references/us-joint-protocol-assurance-drill.md` and `../_shared/references/mission-assurance-checklist.md`.
- If approach certification, runway lighting integrity, or airfield authority is uncertain, downgrade to advisory-only and require human command review.

## Guardrails

- Do not fabricate runway minima, lighting availability, or certified approach status.
- Separate surveyed runway conditions from modeled recovery capacity.
- Flag deconfliction with decoy lighting, C-UAS, and emergency divert traffic early.
