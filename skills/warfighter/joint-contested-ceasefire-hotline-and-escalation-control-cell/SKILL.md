---
name: joint-contested-ceasefire-hotline-and-escalation-control-cell
description: Coordinate contested ceasefire hotlines, incident acknowledgments, and escalation-control branches when tactical friction risks strategic spillover. Use when commanders need authenticated deconfliction under severe time pressure.
---

# Joint Contested Ceasefire Hotline And Escalation Control Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm authorities, hotline endpoints, incident thresholds, coalition caveats, and commander decision timelines before producing recommendations.
- Keep outputs advisory-only by default and require explicit human command approval for high-consequence escalation branches.

## Workflow

1. Frame the ceasefire architecture, incident types, and failure modes most likely to trigger escalation.
2. Build primary and alternate hotline, relay, and acknowledgment branches with explicit tradeoffs in speed, attribution confidence, and escalation risk.
3. Bind each recommendation to concrete communications, notification, and incident-tracking tools plus protocol-bound outputs.
4. Run authority, acknowledgment-integrity, and legal-policy checks before publishing commander-facing recommendations.

## Required Output Format

1. Situation snapshot.
2. Recommended hotline or escalation-control branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Hotline packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: ceasefire incident ladder, escalation-control branch matrix, and acknowledgment-trace ledger.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-contested-ceasefire-hotline-escalation-control-v1` with `protocol_stack_id=ps-joint-contested-ceasefire-hotline-escalation-control-stack-v1`.
- Alternate: protected voice and written readback board with dual acknowledgment witness.
- Degraded: advisory-only incident relay with manual UTC log and commander hold for unresolved acknowledgment gaps.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-CEASEFIRE-HOTLINE-ESCALATION-001` for critical recommendations.
- Prioritize these protocol families for this domain: `USMTF`, `S/MIME`, `NIEM`, `API/JSON`, and NATO APP-11/ADatP-3 aligned exchange where coalition partners are involved.
- Include source system, refresh UTC, confidence, acknowledgment status, and unresolved attribution gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run cross-source validation from `../_shared/references/mission-assurance-checklist.md`.
- If endpoint identity, legal basis, or acknowledgment integrity is uncertain, downgrade to advisory-only and assign closure actions.

## Guardrails

- Do not fabricate ceasefire authorities, hotline reachability, or adversary acknowledgment.
- Separate observed incidents from inferred intent or strategic messaging assumptions.
- Surface law-of-war, coalition, public-warning, and strategic-communication consequences early.
