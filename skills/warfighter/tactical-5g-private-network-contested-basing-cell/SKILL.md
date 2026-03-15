---
name: tactical-5g-private-network-contested-basing-cell
description: Support U.S. warfighter planning for tactical private-5G deployment and contested-basing communications resilience. Use when units need high-throughput local networks with jamming-aware fallback paths.
---

# Tactical 5G Private Network Contested Basing Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm command echelon, mission phase, authorities, coalition constraints, and required commander decisions.
- Keep output unclassified by default unless handling guidance is provided.

## Workflow

1. Frame mission problem with time constraints, threat picture, force posture, and readiness state.
2. Build one recommended COA plus at least two alternatives with explicit tradeoffs.
3. Identify branch/sequel triggers, data dependencies, and command approval gates.
4. Bind each critical recommendation to external tools, protocol stack, and degraded-mode fallback.
5. Publish staff-action tasks with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with triggers.
4. Decision points and escalation gates.
5. Staff task tracker with owners/suspense.
6. Tool invocation packets and protocol bindings.

## Domain Products

Primary products for this skill: 5G cell deployment plan, mission traffic priority matrix, comms failover playbook.

## Domain Tooling and Protocol Baseline

- Preferred external toolsets for this domain: private 5G orchestration controllers, RF planning tools, edge QoS management dashboards.
- Preferred protocol profile for machine and staff exchange: 3GPP + USMTF + CoT.
- Default tool suite binding: `tool_suite_id=ts-tactical-5g-resilience-v1`.
- Default protocol stack binding: `protocol_stack_id=ps-5g-tactical-network-stack-v1`.
- Default packet binding: `packet_id=DPL-5G-TACTICAL-001`.
- Use ../_shared/references/warfighter-external-tool-and-protocol-catalog.md to verify tool/protocol compatibility.
- Use ../_shared/references/domain-tool-packet-library.md to verify packet schema, validation gates, and degraded-mode fallback.

## Interoperability and Trust Validation

- Run ../_shared/references/mission-assurance-checklist.md before final release.
- Apply authority and escalation controls from ../_shared/references/warfighter-tool-authority-gates.md and ../_shared/references/human-agent-command-escalation-matrix.md.
- Include provenance, UTC freshness, confidence, and known-gap declarations for every critical recommendation.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag legal, ROE, LOAC, policy, and coalition caveat constraints before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
- If data trust or authority is below threshold, downgrade to advisory-only and request human command decision.
