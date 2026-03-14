---
name: strategic-adversary-economic-coercion-logistics-early-warning-cell
description: Detect adversary economic coercion signals that could fracture military logistics before disruption is visible on the ground. Use when commanders need early warning on ports, carriers, insurers, suppliers, labor, or finance chokepoints.
---

# Strategic Adversary Economic Coercion Logistics Early Warning Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm theater dependencies, critical suppliers and routes, warning thresholds, and commander decision timelines before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the logistics network, adversary pressure vectors, and mission dependencies most exposed to coercion.
2. Detect indicators across shipping, insurance, labor, customs, finance, sanctions, political pressure, and gray-zone influence.
3. Build hedge, reroute, surge, preposition, and diplomatic-escalation branches with explicit cost, time, and readiness tradeoffs.
4. Bind each recommendation to concrete supply-chain, transport, and warning tools plus packetized outputs.

## Required Output Format

1. Situation snapshot.
2. Recommended warning posture and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Economic-coercion packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: coercion indicator watchlist, logistics fragility map, and preemptive branch recommendation board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-economic-coercion-logistics-warning-v1` with `protocol_stack_id=ps-strategic-economic-coercion-logistics-warning-stack-v1`.
- Alternate: manual critical-route watchboard plus strategic supplier risk rollup.
- Degraded: mission-essential route monitoring only with daily commander update.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-ECON-COERCION-LOGISTICS-001` for critical recommendations.
- Prioritize these protocol families for this domain: `API/JSON`, `STIX/TAXII`, `USMTF`, and signed logistics manifests.
- Include source system, refresh UTC, confidence, coercion indicators, and unresolved market or route gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run cross-source warning checks from `../_shared/references/mission-assurance-checklist.md`.
- If indicator provenance, route status, or policy authority is uncertain, downgrade to advisory-only and assign closure actions.

## Guardrails

- Do not fabricate economic indicators, route closures, or allied political intent.
- Separate observed coercion signals from inferred adversary strategy.
- Surface time sensitivity, treaty implications, and strategic-messaging consequences early.
