---
name: joint-forward-hypothermia-blood-warmer-and-cold-shock-resuscitation-cell
description: Support U.S. warfighter planning for hypothermia control, blood-warming capacity, and cold-shock resuscitation when casualties must survive prolonged evacuation in wet-cold, alpine, arctic, or maritime combat conditions.
---

# Joint Forward Hypothermia Blood Warmer And Cold-Shock Resuscitation Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Start by confirming command authority, medical oversight, time horizon, and required decision points.
- Keep products unclassified by default unless the user provides explicit handling guidance and controlled data.

## Workflow

1. Frame the mission problem using these core inputs: casualty temperatures, warming-device status, blood availability, evacuation delay, and environmental exposure.
2. Identify assumptions, decision thresholds, and what indicators would invalidate the current warming or transfusion plan.
3. Build primary and alternate options with explicit tradeoffs in survivability, device burden, blood use, and transport exposure.
4. Integrate dependencies across medical care, logistics, evacuation, force protection, and environmental intelligence.
5. Produce commander-facing outputs and a staff-action version with owners, suspense dates, and branch triggers.

## Required Output Format

Deliver results in this order:

1. Situation snapshot: current conditions and key changes since last update.
2. Recommended option: one clearly stated recommendation and rationale.
3. Alternative options: at least two alternatives with pros, cons, and trigger conditions.
4. Decision points: what must be decided now, later, or pre-delegated.
5. Staff tasking: who does what by when.

## Domain Products

Primary products for this skill: casualty warming ladder, blood-warmer allocation board, cold-shock triage matrix.

## Domain Tool Stack

Use these tool categories as the default stack for this skill: patient-temperature tracker, warmer device status board, warmed-blood queue, evacuation thermal-protection board.

## External Tools and Protocol Integration

- Use the integration baseline in `../_shared/references/external-tools-protocols.md` and select specific systems-of-record aligned to this mission.
- Use protocol examples in `../_shared/references/tool-protocol-playbooks.md` to produce operator-ready tool invocation packets.
- Include a domain toolchain profile selection and rationale for primary, alternate, and degraded mode stacks.
- Use at least one primary source and one cross-check source before final recommendations.
- Prefer these protocol families for this skill: `HL7/FHIR`, `USMTF`, signed cold-chain manifests, `API/JSON`, and `NATO APP-11/ADatP-3 aligned exchange`.
- Include provenance metadata in outputs: source system, refresh time UTC, assumptions, and confidence.

## Interoperability Validation Checklist

- Run mission assurance checks in `../_shared/references/mission-assurance-checklist.md` before final release.
- Validate that each product includes source provenance, protocol or message format, UTC refresh time, confidence, and known gaps.
- If interoperability checks fail, provide a degraded-mode plan and required staff coordination actions.

## Tool Invocation Contract

- For each external tool recommendation, include objective, required inputs, query or action template, expected output schema, transport protocol, and fallback path.
- Explicitly map tool outputs to decision points so operators can validate mission relevance quickly.
- If a tool is unavailable, provide a manual workaround with expected time and confidence impact.

## Guardrails

- Flag gaps where assumptions exceed evidence.
- Identify legal, policy, medical, and coalition interoperability constraints early.
- Separate facts, assessed judgments, and unknowns.
- Do not fabricate classified sources, authorities, or approvals.

## Mission Tool Authority Gates

- Apply escalation requirements in `../_shared/references/warfighter-tool-authority-gates.md` for high-consequence recommendations.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for recommendations that can alter mission posture.
- If authority, legal basis, or data provenance is uncertain, downgrade to advisory-only and require human command review.

## Cross-Domain Integration Playbook

- Use `../_shared/references/cross-domain-integration-playbook.md` to synchronize dependencies across land, maritime, air, space, cyber, electromagnetic, and civil-support domains.
- Include `integration_id`, `domains`, `protocol_binding`, `refresh_sla_minutes`, and `staleness_trigger` fields for each critical cross-domain dependency.
- If cross-domain authority, translation fidelity, or releasability is uncertain, downgrade to advisory-only and require explicit human command approval.

## Mission Tool and Protocol Catalog Binding

- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` to select concrete tool suites and protocol stacks for this domain.
- Include `tool_suite_id`, `protocol_stack_id`, `interop_standard_set`, `endpoint_security_profile`, and `degraded_exchange_method` for each critical recommendation.
- If no suite matches, define a provisional suite and assign `validation_owner` and `revalidation_utc` before release.

## Domain Toolchain Override (2026-03-14, Expansion Wave LI Addendum)

- Primary: `tool_suite_id=ts-joint-forward-hypothermia-blood-warmer-cold-shock-resuscitation-v1` with `protocol_stack_id=ps-joint-forward-hypothermia-blood-warmer-cold-shock-resuscitation-stack-v1`.
- Alternate: `tool_suite_id=ts-medical-force-health-v1` with `protocol_stack_id=ps-cop-event-sharing-stack-v1`.
- Add `packet_id=DPL-HYPOTHERMIA-BLOOD-WARMER-001` for branches that materially alter casualty warming, transfusion timing, or evacuation-survival posture.
