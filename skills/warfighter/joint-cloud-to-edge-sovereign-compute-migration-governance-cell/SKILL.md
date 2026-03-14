---
name: joint-cloud-to-edge-sovereign-compute-migration-governance-cell
description: Govern migration of joint mission workloads from cloud to sovereign or edge compute under contested conditions. Use when commanders need continuity without losing trust, authority control, or releasability.
---

# Joint Cloud To Edge Sovereign Compute Migration Governance Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm workloads, sovereignty constraints, latency requirements, credential scope, and rollback authority before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission workloads, data dependencies, and sovereignty or survivability drivers for migration.
2. Build primary and alternate migration branches with explicit tradeoffs in latency, trust, resiliency, coalition exchange, and operator burden.
3. Bind each recommendation to concrete migration tooling, protocol transports, and packetized cutover controls.
4. Publish rollback triggers, degraded-mode paths, and human approval points for any branch that changes mission continuity posture.

## Required Output Format

1. Situation snapshot.
2. Recommended migration branch and rationale.
3. Alternative branches with cutover or rollback triggers.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Cutover packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: sovereign compute cutover matrix, mission-data dependency ledger, and rollback trigger ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-sovereign-edge-cloud-migration-v1` with `protocol_stack_id=ps-joint-sovereign-edge-cloud-migration-stack-v1`.
- Alternate: trusted read-only snapshot posture plus staged workload migration board.
- Degraded: mission-essential edge services only with manual replication and delayed reconciliation.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-SOVEREIGN-EDGE-CLOUD-001` for critical recommendations.
- Prioritize these protocol families for this domain: `API/JSON`, signed continuity manifests, `STIX/TAXII`, and `USMTF`.
- Include source system, refresh UTC, confidence, credential scope, and unresolved data-sovereignty gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run interoperability and cutover-assurance checks from `../_shared/references/mission-assurance-checklist.md`.
- If authority, rollback safety, or data-provenance integrity is uncertain, downgrade to advisory-only and assign remediation owners.

## Guardrails

- Do not fabricate workload readiness, cross-domain approvals, or migration success confidence.
- Surface coalition caveats, sovereignty restrictions, and timing dependencies early.
- Treat any branch that can sever mission data or command applications as high-consequence.
