---
name: coalition-autonomous-decoy-swarm-spectrum-deception-cell
description: Support U.S. warfighter planning and decision support for Coalition Autonomous Decoy Swarm Spectrum Deception Cell. Use when missions require autonomous decoy swarm governance, coalition emitter deconfliction, and deception effect measurement, integrated options, and protocol-aware staff outputs.
---

# Coalition Autonomous Decoy Swarm Spectrum Deception Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Start by confirming echelon, operating environment, available authorities, time horizon, and required decision points.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem using commander objectives, force disposition, operating constraints, and key intelligence gaps.
2. Identify assumptions, decision thresholds, and what reporting or indicators would invalidate the current plan.
3. Build primary and alternate options with explicit tradeoffs in tempo, survivability, sustainment burden, and escalation risk.
4. Integrate dependencies across command and control, maneuver, fires/effects, intelligence, protection, sustainment, and information.
5. Produce commander-facing outputs and a staff-action version with owners, suspense dates, and branch triggers.

## Required Output Format

Deliver results in this order:

1. Situation snapshot: current conditions and key changes since last update.
2. Recommended option: one clearly stated recommendation and rationale.
3. Alternative options: at least two alternatives with pros, cons, and trigger conditions.
4. Decision points: what must be decided now, later, or pre-delegated.
5. Staff tasking: who does what by when.

## Domain Products

Primary products for this skill: decoy swarm employment matrix, coalition spectrum deconfliction board, deception effectiveness scorecard.

## Domain Tool Stack

Use these tool categories as the default stack for this skill: spectrum assignment tools, autonomous mission planners, RF monitoring meshes, coalition COP services.

## Protocol Profile

Preferred protocol families for this skill: VMF, STANAG APP-11C/ADatP-3, API/JSON.

## External Tools and Protocol Integration

- Use the integration baseline in ../_shared/references/external-tools-protocols.md and name the exact tools selected for this mission set.
- Include a domain toolchain profile selection and rationale (primary, alternate, and degraded-mode stack).
- Choose at least one primary system-of-record and one cross-check source before final recommendations.
- Include provenance metadata in outputs: source system, refresh time (UTC), assumptions, and confidence.

## Interoperability Validation Checklist

- Run mission assurance checks in ../_shared/references/mission-assurance-checklist.md before final release.
- Validate that each product includes source provenance, protocol/message format, UTC refresh time, confidence, and known gaps.
- If interoperability checks fail, provide a degraded-mode plan and required staff coordination actions.

## Tool Invocation Contract

- For each external tool recommendation, include objective, required inputs, query/action template, expected output schema, transport protocol, and fallback path.
- Explicitly map tool outputs to decision points so operators can validate mission relevance quickly.
- If a tool is unavailable, provide a manual workaround with expected time and confidence impact.

## Guardrails

- Flag gaps where assumptions exceed evidence.
- Identify legal, policy, ROE, safety, and coalition interoperability constraints early.
- Separate facts, assessed judgments, and unknowns.
- Do not fabricate classified sources, authorities, or approvals.

## Mission Tool and Protocol Catalog Binding

- Use ../_shared/references/warfighter-external-tool-and-protocol-catalog.md to select concrete tool suites and protocol stacks for this domain.
- Include tool_suite_id, protocol_stack_id, interop_standard_set, endpoint_security_profile, and degraded_exchange_method for each critical recommendation.
- Start with tool_suite_id=ts-decoy-swarm-spectrum-deception-v1 and protocol_stack_id=ps-decoy-swarm-spectrum-deception-stack-v1, then branch only when mission constraints require it.

## Mission Tool Authority Gates

- Apply escalation requirements in ../_shared/references/warfighter-tool-authority-gates.md for high-consequence recommendations.
- Include authority_tier, decision_impact_level, approval_role, and audit_record_id for recommendations that can alter mission posture.
- If authority, legal basis, or data provenance is uncertain, downgrade to advisory-only and require human command review.

## Cross-Domain Integration Playbook

- Use ../_shared/references/cross-domain-integration-playbook.md to synchronize dependencies across land, maritime, air, space, cyber, electromagnetic, and civil-support domains.
- Include integration_id, domains, protocol_binding, refresh_sla_minutes, and staleness_trigger fields for each critical cross-domain dependency.
- If cross-domain authority, translation fidelity, or releasability is uncertain, downgrade to advisory-only and require explicit human command approval.
