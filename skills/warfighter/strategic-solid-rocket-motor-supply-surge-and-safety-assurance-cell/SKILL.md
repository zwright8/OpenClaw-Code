---
name: strategic-solid-rocket-motor-supply-surge-and-safety-assurance-cell
description: Support U.S. warfighter planning and decision support for strategic solid rocket motor supply surge and safety assurance. Use when missions require industrial surge allocation, hazardous logistics control, and authority-gated staff outputs.
---

# Strategic Solid Rocket Motor Supply Surge And Safety Assurance Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter strategic industrial mobilization and deterrence-sustainment operations in this domain.
- Confirm authority, classification and releasability, industrial safety controls, transportation limits, and commander decision points before producing recommendations.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with rocket-motor inventory, production-line availability, lot quality confidence, transportation hazards, and demand priorities.
2. Compare primary, alternate, and degraded surge branches with explicit trigger thresholds, facility bottlenecks, and safety risks.
3. Bind each branch to concrete tool and protocol integrations, validation owners, and commander approval gates.
4. Publish commander decision points, staff tasking, and revalidation windows for production surge, lot release, and transport sequencing actions.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate and degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions with owner, suspense, and verification method.

## Domain Products

Primary products: motor lot confidence board, surge allocation matrix, safety-release packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Prioritize these tool families: industrial readiness ledgers, hazardous transport trackers, lot-quality assurance boards, and strategic demand-priority planners.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite and stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-solid-rocket-motor-supply-surge-safety-assurance-v1` with `protocol_stack_id=ps-strategic-solid-rocket-motor-supply-surge-safety-assurance-stack-v1`.
- Alternate: industrial surge board with manual lot-release witness and conservative transport windows.
- Degraded: deterrence-critical allocations only with dual-quality approval and paper chain-of-custody.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Keep outputs at industrial allocation, safety, and sustainment-governance level; do not generate weapon design, manufacturing process optimization, or launch-employment instructions.
- If lot integrity, transport safety, or production-status data is stale or incomplete, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet ID: `DPL-STRATEGIC-SOLID-ROCKET-MOTOR-SURGE-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
