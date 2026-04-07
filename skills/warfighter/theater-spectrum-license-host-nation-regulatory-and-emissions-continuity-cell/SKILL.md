---
name: theater-spectrum-license-host-nation-regulatory-and-emissions-continuity-cell
description: Maintain spectrum authorities, host-nation regulatory alignment, and emergency emissions continuity when tactical networks move faster than licensing and waiver processes. Use when commanders need protocol-aware EMSO employment without regulatory drift.
---

# Theater Spectrum License Host-Nation Regulatory And Emissions Continuity Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm host-nation authorities, waiver timelines, frequency assignments, coalition caveats, and mission-emission priorities before producing recommendations.
- Keep outputs advisory-only by default and require explicit human command approval before recommending branches that change contested-spectrum posture.

## Workflow

1. Frame the emissions architecture, licensing status, host-nation constraints, and mission dependencies most exposed to regulatory drift.
2. Build primary and alternate waiver, reroute, or emissions-control branches with explicit tradeoffs in tempo, legality, interoperability, and signature risk.
3. Bind each recommendation to concrete spectrum-management, waiver-routing, and acknowledgment tools plus protocol-bound outputs.
4. Run authority, interop, and acknowledgment checks before publishing commander-facing recommendations.

## Required Output Format

1. Situation snapshot.
2. Recommended regulatory and emissions branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Regulatory packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: spectrum waiver ladder, emissions continuity matrix, and regulator coordination log.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-spectrum-license-host-nation-regulatory-emissions-continuity-v1` with `protocol_stack_id=ps-theater-spectrum-license-host-nation-regulatory-emissions-continuity-stack-v1`.
- Alternate: manual frequency-control board plus host-nation waiver tracker.
- Degraded: mission-essential emissions only with hourly legal and spectrum-manager review.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-SPECTRUM-LICENSE-REGULATORY-001` for critical recommendations.
- Prioritize these protocol families for this domain: `NIEM`, `S/MIME`, `API/JSON`, `USMTF`, and NATO APP-11/ADatP-3 aligned exchange.
- Include source system, refresh UTC, confidence, waiver status, and unresolved regulator or coalition caveats in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run cross-source validation from `../_shared/references/mission-assurance-checklist.md`.
- If licensing status, regulator acknowledgment, or coalition release basis is uncertain, downgrade to advisory-only and assign closure actions.

## Guardrails

- Do not fabricate licenses, host-nation approvals, or spectrum coordination acknowledgments.
- Separate legal authority from technical feasibility and from tactical desirability.
- Surface coalition, civil-aviation, and public-safety effects of emissions changes early.
