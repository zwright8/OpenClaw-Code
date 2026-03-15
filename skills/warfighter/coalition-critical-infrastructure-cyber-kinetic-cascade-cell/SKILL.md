---
name: coalition-critical-infrastructure-cyber-kinetic-cascade-cell
description: Support coalition defense by detecting cyber-kinetic cascade risks across critical infrastructure and synchronizing resilient restoration branches.
---

# Coalition Critical Infrastructure Cyber Kinetic Cascade Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. and allied warfighter missions in this domain.
- Confirm echelon, authorities, releasability limits, critical infrastructure dependencies, and commander decision points before generating recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance.

## Workflow

1. Build a mission snapshot with current infrastructure status, threat posture, restoration constraints, and priority-of-life or priority-of-mission services.
2. Develop one recommended branch and at least two alternates with explicit tradeoffs in survivability, mission continuity, civil impact, and escalation risk.
3. Bind each recommendation to a concrete toolchain, packet, and protocol path with UTC freshness, confidence, and fallback behavior.
4. Map each tool output to a commander decision point, coalition coordination requirement, and human approval gate.
5. Publish commander-facing recommendations and a staff execution matrix with owners, suspense times, and degraded-mode triggers.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternatives and trigger conditions.
4. Decision points and approval gates.
5. Staff tasking with suspense.
6. Tool and protocol execution matrix.

## Domain Products

Primary products for this skill: cascade consequence map, restoration branch matrix, coalition infrastructure priority board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-infra-cyber-kinetic-cascade-v1` with `protocol_stack_id=ps-coalition-infra-cyber-kinetic-cascade-stack-v1`.
- Alternate: `tool_suite_id=ts-joint-c2-fusion-v1` with `protocol_stack_id=ps-cop-event-sharing-stack-v1`.
- Degraded: coalition incident board with UTC acknowledgment ledger, manual utility liaison check-ins, and commander-approved life-safety prioritization only.

## External Tool Stack and Protocols

- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` to bind concrete systems and `../_shared/references/joint-operations-external-toolchain-profiles.md` to select the closest `toolchain_profile_id`.
- Prefer `toolchain_profile_id=civil-support-consequence-management-v1` when restoration and life-safety dominate; elevate `toolchain_profile_id=cyber-defensive-ops-v1` when hunt, containment, and trust restoration dominate.
- Preferred tools: ICS or OT telemetry fusion boards, grid or water restoration dashboards, coalition liaison trackers, STIX or TAXII threat exchanges, NIEM or OGC civil-impact feeds.
- Preferred protocol families: `NIMS/ICS`, `USMTF`, `STIX/TAXII`, `NIEM`, `OGC`, `API/JSON`.
- Include `tool_suite_id`, `protocol_stack_id`, `packet_id`, `tool_health_id`, `trust_score`, `refresh_sla_minutes`, `last_probe_utc`, and `fallback_path` for every critical dependency.

## Domain Packet Defaults

- Default packet ID: `DPL-COALITION-CYBER-KINETIC-CASCADE-001`.
- Cross-domain packet when utility anomalies may be fuel, energy, or water coupling rather than direct attack: `DPL-FEW-NEXUS-ANOMALY-001`.
- If packet scope is incomplete, define a provisional packet using the shared schema and assign `validation_owner` and `revalidation_utc`.

## Tool Invocation Contract

- For each critical dependency include: objective, required inputs, query or action template, expected output schema, transport protocol, timeout, retry policy, and fallback path.
- Explicitly map every machine output to a commander decision, coalition coordination action, and a restoration or isolation owner.
- If trust posture, provenance, or coalition acknowledgment integrity drops below threshold, mark recommendations `provisional` and publish a constrained branch.

## Authority and Assurance Gates

- Apply approval and escalation requirements from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before publishing high-consequence restoration recommendations.
- Separate facts, assessed judgments, assumptions, and unknowns.
- Downgrade to advisory-only when authority, data provenance, coalition releasability, or acknowledgment integrity is uncertain.
