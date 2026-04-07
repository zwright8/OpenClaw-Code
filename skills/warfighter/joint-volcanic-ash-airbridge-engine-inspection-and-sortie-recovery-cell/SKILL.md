---
name: joint-volcanic-ash-airbridge-engine-inspection-and-sortie-recovery-cell
description: Maintain airbridge throughput when volcanic ash threatens engines, routes, and inspection capacity.
---

# Joint Volcanic Ash Airbridge Engine Inspection And Sortie Recovery Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter joint air mobility, aircraft engine assurance, and airbridge recovery operations in this domain.
- Confirm authority, classification and releasability, aviation safety limits, and commander decision points before producing recommendations.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with ash forecasts, route status, engine inspection backlog, cargo priorities, and diversion options.
2. Compare primary, alternate, and degraded branches with explicit trigger thresholds, engine-health risks, and airbridge tradeoffs.
3. Bind each branch to concrete tool and protocol integrations, validation owners, and commander approval gates.
4. Publish commander decision points, staff tasking, and revalidation windows for route closure, engine inspection surge, and sortie recovery actions.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate and degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions with owner, suspense, and verification method.

## Domain Products

Primary products: ash exposure board, engine inspection ladder, sortie recovery packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Prioritize these tool families: ash-cloud forecast boards, engine-health trackers, inspection scheduling workflows, and airbridge priority planners.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite and stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Select or derive a matching toolchain profile from `../_shared/references/joint-operations-external-toolchain-profiles.md` when ash avoidance, engine inspection capacity, and airbridge priority branches interact.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-volcanic-ash-airbridge-engine-sortie-recovery-v1` with `protocol_stack_id=ps-joint-volcanic-ash-airbridge-engine-sortie-recovery-stack-v1`.
- Alternate: manual ash-avoidance board with fixed inspection intervals, reduced payloads, and limited routes.
- Degraded: life-saving or strategic airlift only with conservative ash avoidance and post-flight inspections on every leg.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Keep outputs at aviation-safety, inspection-governance, and route-release level; do not provide unsafe exposure thresholds, engine-limit bypass instructions, or hazardous flight recommendations.
- If ash forecasts, engine data, or inspection capacity evidence is stale or incomplete, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet ID: `DPL-JOINT-VOLCANIC-ASH-AIRBRIDGE-ENGINE-RECOVERY-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
