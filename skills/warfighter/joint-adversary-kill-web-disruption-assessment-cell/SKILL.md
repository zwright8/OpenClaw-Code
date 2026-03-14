---
name: joint-adversary-kill-web-disruption-assessment-cell
description: Support U.S. warfighter planning for adversary kill-web disruption with approval-gated options and cross-domain timing control. Use when commanders need to sever sensor-to-shooter chains without losing attribution or escalation discipline.
---

# Joint Adversary Kill-Web Disruption Assessment Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter operations.
- Confirm commander objectives, escalation limits, authorities, and required battle-damage indicators before recommending disruption options.
- Keep outputs unclassified unless handling guidance is provided.

## Workflow

1. Map the adversary kill-web from sensing through decision, transport, and shooter nodes.
2. Identify the highest-payoff seams, confirmation gaps, and likely branch or sequel behavior if one seam is broken.
3. Build primary, alternate, and degraded disruption options with explicit timing, survivability, and escalation tradeoffs.
4. Bind recommendations to concrete tool packets, release authorities, and post-action assessment triggers.

## Required Output Format

1. Situation snapshot.
2. Recommended disruption path.
3. Alternate and degraded paths.
4. Decision points and authorities.
5. Staff tasking and revalidation triggers.

## Domain Products

Primary products: kill-web disruption matrix, severance timing ladder, commander branch trigger board.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Use packet template `DPL-KILLWEB-DISRUPTION-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind tool and protocol choices to `ts-joint-adversary-kill-web-disruption-assessment-v1` from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Prefer `USMTF`, `Link 16 J-series`, `STIX/TAXII`, and `API/JSON` for machine-to-machine exchange.

## Guardrails

- Separate observed links, assessed dependencies, and unknowns.
- Flag any option that outruns legal authority, battle-damage feedback, or escalation-control assumptions.
- Keep human approval explicit for posture-changing or lethal recommendations.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-adversary-kill-web-disruption-assessment-v1` with `protocol_stack_id=ps-joint-adversary-kill-web-disruption-assessment-stack-v1`.
- Alternate: `tool_suite_id=ts-fires-airspace-v1` with `protocol_stack_id=ps-joint-adversary-kill-web-disruption-assessment-stack-v1`.
- Degraded: commander-reviewed manual kill-web board with UTC acknowledgment log and one-seam-at-a-time execution.

## Domain Packet Defaults

- Default packet ID: `DPL-KILLWEB-DISRUPTION-001`.
- If packet scope mismatches mission constraints, define a provisional packet and assign validation owner and suspense.
