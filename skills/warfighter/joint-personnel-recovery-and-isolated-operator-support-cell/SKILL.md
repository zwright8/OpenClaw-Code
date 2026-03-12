---
name: joint-personnel-recovery-and-isolated-operator-support-cell
description: Support U.S. warfighter planning and decision support for personnel recovery and isolated operator support. Use when missions require survivor location confidence, recovery corridor deconfliction, and integrated rescue timing decisions.
---

# Joint Personnel Recovery and Isolated Operator Support Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Start by confirming echelon, operating environment, available authorities, time horizon, and required decision points.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem using current intent, enemy/system threats, operational constraints, and known assumptions.
2. Define measurable objectives, risk thresholds, branch conditions, and indicators that would invalidate the preferred plan.
3. Build a recommended option and at least two alternatives with explicit tradeoffs in tempo, survivability, sustainment load, and escalation risk.
4. Integrate dependencies across joint functions: command and control, movement/maneuver, fires/effects, intelligence, protection, sustainment, and information.
5. Convert the decision into execution-ready products with owners, suspense dates, coordination links, and required reports.

## Required Output Format

Deliver results in this order:

1. Situation snapshot: current conditions and key changes since the last update.
2. Recommended option: one clearly stated recommendation and rationale.
3. Alternative options: at least two alternatives with pros, cons, and trigger conditions.
4. Decision points: what must be decided now, later, or pre-delegated.
5. Staff tasking: who does what by when.

## Domain Products

Primary products for this skill: isolated personnel recovery decision board, rescue corridor threat and timing matrix, recovery force synchronization packet.

## Domain Tool Stack

Use these tool categories as the default stack for this skill: survivor beacon and geolocation systems, rescue C2 tools, ISR cueing systems, mission route deconfliction planners.

## External Tools and Protocol Integration

- Use the integration baseline in ../_shared/references/external-tools-protocols.md and select specific systems-of-record aligned to this mission.
- Use protocol examples in ../_shared/references/tool-protocol-playbooks.md to produce operator-ready tool invocation packets.
- Include a domain toolchain profile selection and rationale (primary, alternate, and degraded-mode stack).
- Use at least one primary source and one cross-check source before final recommendations.
- Prefer these protocol families for this skill: PRC-112/ARS standards, USMTF, Link 16 J-series, CoT.
- Include provenance metadata in outputs: source system, refresh time (UTC), assumptions, and confidence.

## Guardrails

- Flag gaps where assumptions exceed evidence.
- Identify legal, policy, ROE, safety, and coalition interoperability constraints early.
- Separate facts, assessed judgments, and unknowns.
- Do not fabricate classified sources, authorities, or approvals.

## Mission Tool Authority Gates

- Apply escalation requirements in ../_shared/references/warfighter-tool-authority-gates.md for high-consequence recommendations.
- Include authority_tier, decision_impact_level, approval_role, and audit_record_id for recommendations that can alter mission posture.
- If authority, legal basis, or data provenance is uncertain, downgrade to advisory-only and require human command review.

## Cross-Domain Integration Playbook

- Use ../_shared/references/cross-domain-integration-playbook.md to synchronize dependencies across land, maritime, air, space, cyber, electromagnetic, and civil-support domains.
- Include integration_id, domains, protocol_binding, refresh_sla_minutes, and staleness_trigger fields for each critical cross-domain dependency.
- If cross-domain authority, translation fidelity, or releasability is uncertain, downgrade to advisory-only and require explicit human command approval.

## Mission Tool and Protocol Catalog Binding

- Use ../_shared/references/warfighter-external-tool-and-protocol-catalog.md to select concrete tool suites and protocol stacks for this domain.
- Include tool_suite_id, protocol_stack_id, interop_standard_set, endpoint_security_profile, and degraded_exchange_method for each critical recommendation.
- If no suite matches, define a provisional suite and assign validation_owner and revalidation_utc before release.

## Domain Toolchain Defaults

- Primary: tool_suite_id=ts-personnel-recovery-isolated-operator-support-v1 with protocol_stack_id=ps-personnel-recovery-isolated-operator-support-stack-v1.
- Alternate: tool_suite_id=ts-joint-personnel-recovery-corridor-assurance-v1 with protocol_stack_id=ps-joint-personnel-recovery-corridor-assurance-stack-v1.
- Degraded: use authenticated voice/readback + UTC acknowledgment ledger + manual fallback board.

## Domain Packet Defaults

- Default packet IDs: DPL-PERSONNEL-RECOVERY-001, DPL-ISOLATED-OPERATOR-SUPPORT-001.
- If no packet fully matches, define a provisional packet and assign a validation owner before release.
