---
name: theater-mission-ai-confidence-degradation-early-warning-cell
description: Detect degrading trust in mission AI outputs before commanders rely on them. Use when theater operations depend on AI-assisted planning, sensing, targeting, logistics, or command workflows.
---

# Theater Mission AI Confidence Degradation Early Warning Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm mission systems in scope, authority boundaries, model dependencies, and acceptable confidence floors before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the AI-enabled mission threads, critical model dependencies, and commander decision points.
2. Detect drift, poisoning, bias, stale training assumptions, or sensor-distribution change that could degrade output trust.
3. Build recommended hold, rollback, monitor, and alternate-workflow branches with explicit operational tradeoffs.
4. Bind each recommendation to tool telemetry, packetized evidence, human approval gates, and degraded manual workflows.

## Required Output Format

1. Situation snapshot.
2. Recommended confidence posture and rationale.
3. Alternative branches with degradation triggers.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Model trust packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: model trust watchlist, confidence degradation trigger table, and rollback-or-retain decision board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-mission-ai-confidence-early-warning-v1` with `protocol_stack_id=ps-theater-mission-ai-confidence-early-warning-stack-v1`.
- Alternate: commander-approved baseline-model comparison board plus manual review queue.
- Degraded: approved-baseline-only posture with human-only release decisions.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-MISSION-AI-CONFIDENCE-001` for critical recommendations.
- Prioritize these protocol families for this domain: signed model attestations, `API/JSON`, `STIX/TAXII`, and `USMTF`.
- Include source system, refresh UTC, confidence, drift indicators, and unresolved model-governance gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run assurance checks from `../_shared/references/us-joint-protocol-assurance-drill.md` and `../_shared/references/mission-assurance-checklist.md`.
- If model provenance, validation data, or override authority is uncertain, downgrade to advisory-only and require human command review.

## Guardrails

- Do not fabricate model performance, retraining status, or authority to deploy or rollback models.
- Separate detected indicators from inferred causes.
- Prefer conservative recommendations when AI outputs influence fires, life-safety, or strategic posture.
