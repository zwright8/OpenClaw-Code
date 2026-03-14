---
name: strategic-bearing-gearbox-surge-assurance-cell
description: Protect bearing, gearbox, and precision-drivetrain availability for aviation, maritime, and ground systems under surge or sabotage pressure. Use when rotating-component bottlenecks threaten readiness and repair throughput.
---

# Strategic Bearing Gearbox Surge Assurance Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm platform demand, repair queues, lot pedigree, contamination risk, and decision timelines before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the drivetrain supply network, constrained bearing or gearbox families, and mission-critical demand tiers.
2. Detect shortage, counterfeit, wear, contamination, or repair-capacity indicators that can fracture readiness.
3. Build prioritize, repair, cannibalize, surge, and substitute branches with explicit platform-readiness tradeoffs.
4. Bind each recommendation to concrete condition-monitoring, pedigree, and logistics tools plus packetized outputs.

## Required Output Format

1. Situation snapshot.
2. Recommended assurance branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Bearing and gearbox packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: drivetrain bottleneck board, lot-release assurance matrix, and repair-or-substitute decision ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-bearing-gearbox-surge-assurance-v1` with `protocol_stack_id=ps-strategic-bearing-gearbox-surge-assurance-stack-v1`.
- Alternate: manual rotating-component priority board plus depot repair queue worksheet.
- Degraded: mission-essential platform components only with strict release gating.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-BEARING-GEARBOX-SURGE-001` for critical recommendations.
- Prioritize these protocol families for this domain: signed supply manifests, `API/JSON`, `USMTF`, and `NIEM`.
- Include source system, refresh UTC, confidence, affected platform families, and unresolved contamination or pedigree gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run release and provenance checks from `../_shared/references/mission-assurance-checklist.md`.
- If lot integrity, repair evidence, or substitution authority is uncertain, downgrade to advisory-only and assign remediation owners.

## Guardrails

- Do not fabricate lot pedigree, gearbox condition, contamination evidence, or readiness release confidence.
- Separate observed failure or wear data from inferred sabotage.
- Surface airworthiness, maritime safety, and depot-certification consequences early.
