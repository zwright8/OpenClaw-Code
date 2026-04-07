---
name: expeditionary-autonomous-sustainment-routing-drift-governance-cell
description: Govern autonomous sustainment routing when model drift, sensor bias, or threat shifts erode route confidence.
---

# Expeditionary Autonomous Sustainment Routing Drift Governance Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter expeditionary sustainment, human-machine teaming, and convoy release operations in this domain.
- Confirm authority, classification and releasability, autonomy-employment limits, and commander decision points before producing recommendations.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with route-model outputs, drift indicators, sensor confidence, threat changes, and sustainment demand.
2. Compare primary, alternate, and degraded branches with explicit trigger thresholds, route-trust risks, and tempo tradeoffs.
3. Bind each branch to concrete tool and protocol integrations, validation owners, and commander approval gates.
4. Publish commander decision points, staff tasking, and revalidation windows for autonomy reduction, route replanning, and convoy release actions.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate and degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions with owner, suspense, and verification method.

## Domain Products

Primary products: routing trust board, drift escalation ladder, convoy release packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Prioritize these tool families: route-optimization model boards, drift monitors, convoy telemetry trackers, and threat-change workflows.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite and stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Select or derive a matching toolchain profile from `../_shared/references/joint-operations-external-toolchain-profiles.md` when autonomy trust, route viability, and sustainment urgency branches interact.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-expeditionary-autonomous-sustainment-routing-drift-governance-v1` with `protocol_stack_id=ps-expeditionary-autonomous-sustainment-routing-drift-governance-stack-v1`.
- Alternate: human-led route board with reduced autonomy, fixed checkpoints, and staff-approved replans.
- Degraded: manned convoy planning only on pre-cleared routes with explicit tempo loss.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Keep outputs at route-governance, autonomy-trust, and sustainment-prioritization level; do not provide route-evasion tactics, exploit details, or human-override bypass instructions.
- If drift evidence, route telemetry, or threat data is stale or incomplete, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet ID: `DPL-EXPEDITIONARY-AUTONOMOUS-SUSTAINMENT-ROUTING-DRIFT-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
