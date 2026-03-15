---
name: coalition-civil-telecom-priority-service-restoration-cell
description: Coordinate restoration of civil telecom priority services that support military command continuity, emergency response, and civilian stability.
---

# Coalition Civil Telecom Priority Service Restoration Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. and coalition warfighter missions in this domain.
- Confirm mission threads, authorities, provider constraints, releasability rules, and decision points before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the telecom-restoration problem with outage scope, mission dependencies, public-safety impacts, and branch triggers.
2. Build a recommended branch and at least two alternates with explicit tradeoffs in command continuity, civilian impact, coalition release risk, and restoration tempo.
3. Bind each branch to concrete tool suites, protocol stacks, packets, and degraded-mode paths with UTC freshness and acknowledgment requirements.
4. Map every tool output to commander decisions, telecom or carrier coordination actions, and named staff owners.
5. Publish commander-facing recommendations and a machine-ingestible execution matrix for restoration sequencing.

## Required Output Format

1. Situation snapshot.
2. Recommended restoration branch.
3. Alternative branches and trigger conditions.
4. Decision points and approval gates.
5. Staff tasking with suspense.
6. Tool and protocol execution matrix.

## Domain Products

Primary products for this skill: restoration priority queue, telecom incident adjudication board, civil-military comm continuity map.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-civil-telecom-priority-restoration-v1` with `protocol_stack_id=ps-civil-telecom-priority-restoration-stack-v1`.
- Alternate: `tool_suite_id=ts-joint-c2-fusion-v1` with `protocol_stack_id=ps-cop-event-sharing-stack-v1`.
- Degraded: authenticated voice readback, UTC acknowledgment ledger, and manual carrier or liaison adjudication cycle.

## External Tool Stack and Protocols

- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and `../_shared/references/joint-operations-external-toolchain-profiles.md`.
- Prefer `toolchain_profile_id=theater-fiber-backbone-traffic-triage-v1` when theater backhaul is the main constraint; use `toolchain_profile_id=homeland-civil-telecom-priority-cyber-reserve-activation-v1` when emergency telecom priority-service activation dominates.
- Preferred tools: telecom outage dashboards, route restoration planners, emergency-routing or PSAP continuity boards, coalition releasability ledgers, trust-health monitors.
- Preferred protocol families: `NIMS/ICS`, `EDXL-DE/CAP`, `USMTF`, `NIEM`, `API/JSON`, `NATO APP-11/ADatP-3 aligned exchange`.
- Include `tool_suite_id`, `protocol_stack_id`, `packet_id`, `trust_score`, `refresh_sla_minutes`, `ack_chain_status`, and `fallback_path` for all critical dependencies.

## Domain Packet Defaults

- Default packet IDs: `DPL-COALITION-FIBER-BACKHAUL-RESTORE-001`, `DPL-HOMELAND-CIVIL-TELECOM-PRIORITY-CYBER-RESERVE-001`.
- If no packet fully matches the jurisdiction or provider-control model, define a provisional packet and assign `validation_owner` and `revalidation_utc`.

## Tool Invocation Contract

- For each critical dependency include: objective, required inputs, query or action template, expected output schema, transport protocol, timeout, retry, and fallback path.
- Map each tool output to a commander decision, provider action, and coalition coordination requirement.
- If trust posture, route integrity, or releasability confidence falls below threshold, mark the recommendation `provisional` and shift to a degraded branch.

## Authority and Assurance Gates

- Apply approval and escalation requirements from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before publishing recommendations that alter mission-critical comm paths.
- Separate facts, assessed judgments, assumptions, and unknowns.
- If authority, legal basis, or acknowledgment integrity is uncertain, downgrade to advisory-only with explicit commander prompts.
