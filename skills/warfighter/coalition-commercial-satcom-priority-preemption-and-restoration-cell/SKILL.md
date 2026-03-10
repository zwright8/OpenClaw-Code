---
name: coalition-commercial-satcom-priority-preemption-and-restoration-cell
description: Support U.S. and coalition warfighter planning for commercial SATCOM priority arbitration, protected preemption, and bandwidth restoration during contested operations. Use when missions require reallocating constrained satellite capacity while preserving critical coalition mission traffic.
---

# Coalition Commercial SATCOM Priority Preemption and Restoration Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm echelon, operating environment, authority limits, timeline, and command decision points before analysis.
- Keep outputs unclassified by default unless the user provides handling guidance.

## Workflow

1. Frame the mission with these core inputs: threat posture, mission objective, friendly constraints, and decision deadline.
2. Define assumptions, confidence bounds, and invalidation triggers.
3. Build a primary and at least two alternate options with tradeoffs in tempo, survivability, sustainment, and escalation risk.
4. Bind each option to concrete external tools, transport/message protocols, and degraded-mode fallbacks.
5. Produce commander-facing recommendations and staff tasking with owners and suspense dates.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended option and rationale.
3. Alternatives with trigger conditions.
4. Decision points (now, later, pre-delegate).
5. Staff tasking and suspense dates.

## Domain Products

Primary products: SATCOM priority lane matrix, preemption authorization packet, restoration and deconfliction timeline

## External Tool and Protocol Requirements

- Prioritize tool families: commercial SATCOM orchestration tools, mission-priority traffic analyzers, coalition bandwidth arbitration boards
- Prioritize protocol/message bindings: USMTF, API/JSON, Link 16 J-series
- Select one profile from ../_shared/references/joint-operations-external-toolchain-profiles.md.
- Select one packet from ../_shared/references/domain-tool-packet-library.md.
- Bind each recommendation to a concrete suite/stack entry in ../_shared/references/warfighter-external-tool-and-protocol-catalog.md.

## Required Metadata Fields

Include these fields in every critical recommendation:

- tool_suite_id
- protocol_stack_id
- toolchain_profile_id
- packet_id
- protocol_profile
- primary_system
- cross_check_system
- refresh_sla_minutes
- degraded_trigger
- degraded_fallback
- authority_tier
- approval_role
- trust_score
- validation_owner

Minimum required IDs for this skill:

- tool_suite_id: ts-commercial-satcom-priority-restoration-v1
- toolchain_profile_id: commercial-satcom-priority-restoration-v1
- packet_id: DPL-COMSATCOM-PREEMPT-001

## Guardrails

- Separate observed facts, assessed judgments, and unknowns.
- Flag legal, policy, ROE, and coalition interoperability constraints early.
- Require explicit human command review before any recommendation that could materially change force posture or escalation risk.
- Do not fabricate authorities, classified sources, or approvals.
