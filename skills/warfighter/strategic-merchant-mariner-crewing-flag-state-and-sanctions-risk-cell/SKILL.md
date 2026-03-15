---
name: strategic-merchant-mariner-crewing-flag-state-and-sanctions-risk-cell
description: Detect merchant mariner, flag-state, and sanctions exposure that can strand sealift or charter capacity before cargo moves. Use when commanders need crew, registry, and compliance early warning for strategic mobility decisions.
---

# Strategic Merchant Mariner Crewing Flag-State And Sanctions Risk Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm vessel demand, charter dependencies, labor pools, flag-state constraints, sanctions screens, and commander decision timelines before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the maritime lift network, crew dependencies, registry constraints, and political or sanctions pressure points.
2. Detect indicators across crewing, labor actions, visa friction, registry risk, insurers, and sanctions-exposed owners or operators.
3. Build hedge, reflag, reroute, crew-surge, and cargo-reallocation branches with explicit time, compliance, and throughput tradeoffs.
4. Bind each recommendation to concrete sealift, registry, and compliance tools plus packetized outputs.

## Required Output Format

1. Situation snapshot.
2. Recommended sealift-risk branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Sealift-risk packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: crew and flag risk watchlist, charter fragility map, and reroute or reflag branch board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-merchant-mariner-crewing-flag-sanctions-risk-v1` with `protocol_stack_id=ps-strategic-merchant-mariner-crewing-flag-sanctions-risk-stack-v1`.
- Alternate: manual vessel-priority watchboard plus sanctions and registry review log.
- Degraded: mission-essential hulls only with daily labor, registry, and cargo review.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-MERCHANT-MARINER-FLAG-SANCTIONS-001` for critical recommendations.
- Prioritize these protocol families for this domain: `AIS/NMEA`, `EDI`, signed crewing manifests, `API/JSON`, and `USMTF`.
- Include source system, refresh UTC, confidence, compliance status, and unresolved crew or registry gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run cross-source warning checks from `../_shared/references/mission-assurance-checklist.md`.
- If sanctions exposure, registry validity, or crewing status is uncertain, downgrade to advisory-only and assign closure actions.

## Guardrails

- Do not fabricate sanctions determinations, labor intent, or flag-state approvals.
- Separate observed crewing or registry facts from inferred political coercion.
- Surface treaty, labor, and diplomatic consequences of reflagging or charter substitution early.
