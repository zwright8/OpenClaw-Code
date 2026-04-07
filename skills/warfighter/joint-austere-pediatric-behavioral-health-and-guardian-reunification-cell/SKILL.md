---
name: joint-austere-pediatric-behavioral-health-and-guardian-reunification-cell
description: Coordinate pediatric behavioral health, trauma-informed stabilization, and guardian reunification during austere operations or evacuation. Use when commanders need child-safe medical and civil-support decisions under disrupted identity or custody conditions.
---

# Joint Austere Pediatric Behavioral Health And Guardian Reunification Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm child-protection authorities, identity confidence, guardian-routing constraints, medical capacity, and commander decision timelines before producing recommendations.
- Keep outputs advisory-only by default and require explicit human command approval before recommending branches that materially change protected-custody or transport posture.

## Workflow

1. Frame the pediatric casualty or displacement picture, behavioral-health risks, and custody gaps most exposed to delay or misidentification.
2. Build primary and alternate stabilization, guardian-location, safehaven, and transport branches with explicit tradeoffs in trauma burden, custody confidence, and evacuation tempo.
3. Bind each recommendation to concrete pediatric-care, identity, and reunification tools plus packetized outputs.
4. Run authority, privacy, and custody-integrity checks before publishing commander-facing recommendations.

## Required Output Format

1. Situation snapshot.
2. Recommended pediatric-support branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Pediatric packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: pediatric behavioral-health triage board, guardian-reunification matrix, and protected evacuation ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-austere-pediatric-behavioral-health-guardian-reunification-v1` with `protocol_stack_id=ps-joint-austere-pediatric-behavioral-health-guardian-reunification-stack-v1`.
- Alternate: manual protected-custody board plus behavioral triage worksheet and safehaven tracker.
- Degraded: life-safety and child-protection routing only with manual identity checks and protected voice handoff.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-PEDIATRIC-BEHAVIORAL-GUARDIAN-001` for critical recommendations.
- Prioritize these protocol families for this domain: `HL7/FHIR`, `NIEM`, signed guardian manifests, `API/JSON`, `S/MIME`, and `USMTF`.
- Include source system, refresh UTC, confidence, custody status, and unresolved identity or guardian-location gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run cross-source validation from `../_shared/references/mission-assurance-checklist.md`.
- If custody integrity, medical authority, or guardian identity is uncertain, downgrade to advisory-only and assign closure actions.

## Guardrails

- Do not fabricate guardian identity, protected-health permissions, or child-safety approvals.
- Separate observed pediatric distress indicators from inferred long-term mental-health outcomes.
- Surface privacy, trafficking, and public-affairs consequences of reunification errors early.
