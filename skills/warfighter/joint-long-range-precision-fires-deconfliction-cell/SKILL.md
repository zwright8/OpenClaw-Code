---
name: joint-long-range-precision-fires-deconfliction-cell
description: Support U.S. warfighter planning and decision support for long-range precision fires deconfliction. Use when missions require target validation, no-strike/civilian-harm controls, cross-domain timing alignment, and command release assurance.
---

# Joint Long-Range Precision Fires Deconfliction Cell

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

Primary products for this skill: long-range fires release matrix, no-strike/collateral risk adjudication board, timing and effects synchronization packet.

## Domain Tool Stack

Use these tool categories as the default stack for this skill: targeting systems, battle damage assessment tools, collateral damage estimation engines, command-and-control mission planners.

## External Tools and Protocol Integration

- Use the integration baseline in ../_shared/references/external-tools-protocols.md and select specific systems-of-record aligned to this mission.
- Use protocol examples in ../_shared/references/tool-protocol-playbooks.md to produce operator-ready tool invocation packets.
- Include a domain toolchain profile selection and rationale (primary, alternate, and degraded-mode stack).
- Use at least one primary source and one cross-check source before final recommendations.
- Prefer these protocol families for this skill: USMTF, Link 16 J-series, VMF, CoT.
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

- Primary: tool_suite_id=ts-long-range-fires-deconfliction-v1 with protocol_stack_id=ps-long-range-fires-deconfliction-stack-v1.
- Alternate: tool_suite_id=ts-joint-targeting-standards-cde-assurance-v1 with protocol_stack_id=ps-joint-targeting-standards-cde-assurance-stack-v1.
- Degraded: use authenticated voice/readback + UTC acknowledgment ledger + manual fallback board.

## Domain Packet Defaults

- Default packet IDs: DPL-LRPF-DECONFLICTION-001, DPL-LRPF-CDE-AUTHORITY-001.
- If no packet fully matches, define a provisional packet and assign a validation owner before release.

## Domain Toolchain Override (2026-03-12, Expansion Wave XXII Addendum)

- Add tool_suite_id=ts-denied-pnt-artillery-timing-assurance-v1 + protocol_stack_id=ps-denied-pnt-artillery-timing-assurance-stack-v1 when fires deconfliction confidence depends on denied-PNT timing integrity.
- Add tool_suite_id=ts-acoustic-deception-countertargeting-v1 + protocol_stack_id=ps-acoustic-deception-countertargeting-stack-v1 when adversary acoustic deception can distort sensor-to-shooter confidence and no-strike adherence.
- Add packet_id=DPL-DENIED-PNT-ARTILLERY-TIMING-001 and packet_id=DPL-ACOUSTIC-DECEPTION-COUNTERTARGETING-001 for recommendations that alter release windows, weapon pairing, or hold-fire thresholds.
