---
name: joint-airbase-expeditionary-arresting-gear-and-runway-end-cable-reconstitution-cell
description: Restore arresting gear and runway-end cable capacity at expeditionary or damaged airbases. Use when sortie regeneration depends on safe runway recovery, cable-set integrity, and authority-gated aircraft release.
---

# Joint Airbase Expeditionary Arresting Gear And Runway End Cable Reconstitution Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm runway status, affected aircraft profiles, cable-set inventory, engineer capacity, and release authorities before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the airbase recovery problem with runway damage, arresting-system faults, sortie demand, and authority constraints.
2. Build restore, defer, limit-profile, cross-deck, and alternate-runway branches with explicit safety and tempo tradeoffs.
3. Bind each recommendation to concrete maintenance, engineering, and sortie-generation tools plus packetized outputs.
4. Publish degraded-mode branches when cable integrity, airworthiness evidence, or repair capacity falls below threshold.

## Required Output Format

1. Situation snapshot.
2. Recommended recovery branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Arresting-gear packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: arresting-gear restoration matrix, sortie profile release ladder, and runway-end cable tasking board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-airbase-arresting-gear-runway-cable-reconstitution-v1` with `protocol_stack_id=ps-joint-airbase-arresting-gear-runway-cable-reconstitution-stack-v1`.
- Alternate: manual cable inspection log plus airworthiness release worksheet.
- Degraded: precleared aircraft profiles only with commander-approved runway limits.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-ARRESTING-GEAR-RUNWAY-CABLE-001` for critical recommendations.
- Prioritize these protocol families for this domain: `USMTF`, `AIXM/FIXM`, signed maintenance manifests, and `API/JSON`.
- Include source system, refresh UTC, confidence, airworthiness constraints, and unresolved repair gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run flight-safety and mission-assurance checks from `../_shared/references/mission-assurance-checklist.md`.
- If cable integrity, release authority, or runway-status evidence is uncertain, downgrade to advisory-only and assign remediation owners.

## Guardrails

- Do not fabricate airworthiness evidence, cable tension status, runway release, or command approval.
- Separate observed faults from inferred sabotage or maintenance cause.
- Surface flight-safety, maintenance, and sortie-generation consequences early.
