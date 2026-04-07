---
name: theater-forward-fuel-bladder-contamination-and-airbase-sortie-recovery-cell
description: Support U.S. warfighter planning and decision support for forward fuel bladder contamination response and airbase sortie recovery. Use when missions require fuel-quality isolation, sortie generation triage, and authority-gated staff outputs.
---

# Theater Forward Fuel Bladder Contamination And Airbase Sortie Recovery Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter airbase sustainment and sortie-recovery operations in this domain.
- Confirm authority, classification and releasability, fuel-quality evidence, base-safety limits, and commander decision points before producing recommendations.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with fuel source status, contamination indicators, storage and transfer topology, sortie demand, and airbase safety constraints.
2. Compare primary, alternate, and degraded recovery branches with explicit trigger thresholds, contamination boundaries, and mission-tempo tradeoffs.
3. Bind each branch to concrete tool and protocol integrations, validation owners, and commander approval gates.
4. Publish commander decision points, staff tasking, and revalidation windows for fuel isolation, purification, redistribution, and sortie recovery actions.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate and degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions with owner, suspense, and verification method.

## Domain Products

Primary products: fuel-contamination isolation board, sortie recovery ladder, airbase fuel assurance packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Prioritize these tool families: fuel-quality telemetry boards, base-distribution maps, sortie scheduling boards, and hazardous-material control workflows.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite and stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-forward-fuel-bladder-contamination-airbase-sortie-recovery-v1` with `protocol_stack_id=ps-theater-forward-fuel-bladder-contamination-airbase-sortie-recovery-stack-v1`.
- Alternate: manual fuel quarantine board with independent laboratory confirmation and priority-sortie reconciliation.
- Degraded: mission-essential sortie schedule only with paper fuel-release certificates and conservative burn assumptions.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Keep outputs at fuel assurance, sortie-recovery, and airbase-safety governance level; do not produce sabotage instructions, aircraft procedures, or weapon-employment details.
- If contamination evidence, lab confidence, or sortie-priority guidance is stale or incomplete, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet ID: `DPL-THEATER-FORWARD-FUEL-BLADDER-CONTAMINATION-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
