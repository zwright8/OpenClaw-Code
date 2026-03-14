---
name: coalition-noncombatant-evacuation-identity-fraud-suppression-cell
description: Suppress document fraud and synthetic-identity risk during coalition noncombatant evacuation without stalling legitimate movement. Use when mass screening, family reunification, and security vetting must stay synchronized.
---

# Coalition Noncombatant Evacuation Identity Fraud Suppression Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm screening authorities, coalition caveats, family-reunification rules, host-nation constraints, and commander decision timelines before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the evacuation flow, screening checkpoints, document pathways, and priority movement categories.
2. Detect fraud indicators, synthetic identities, duplicate records, family-link anomalies, or watchlist mismatches that can disrupt safe movement.
3. Build screen, separate, expedite, re-verify, and protected-hold branches with explicit life-safety and civil-trust tradeoffs.
4. Bind each recommendation to concrete identity, watchlist, and family-link tools plus packetized movement-control outputs.

## Required Output Format

1. Situation snapshot.
2. Recommended screening branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. NEO identity-fraud packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: evacuation screening exception board, fraud-indicator ladder, and safe-to-move decision matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-neo-identity-fraud-suppression-v1` with `protocol_stack_id=ps-coalition-neo-identity-fraud-suppression-stack-v1`.
- Alternate: manual document-fraud board plus coalition liaison adjudication worksheet.
- Degraded: life-safety-first screening with protected hold-and-review lanes.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-NEO-IDENTITY-FRAUD-001` for critical recommendations.
- Prioritize these protocol families for this domain: `NIEM`, `CJIS`, `API/JSON`, `USMTF`, and ICAO Doc 9303 aligned document exchanges.
- Include source system, refresh UTC, confidence, coalition caveats, and unresolved identity or family-link gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run screening and legal-custody checks from `../_shared/references/mission-assurance-checklist.md`.
- If screening authority, identity evidence, or family-link confidence is uncertain, downgrade to advisory-only and assign remediation owners.

## Guardrails

- Do not provide instructions to evade identity screening, document checks, or watchlist controls.
- Separate observed fraud indicators from inferred intent or guilt.
- Surface humanitarian, privacy, and coalition legal constraints early.
