---
name: autonomous-precision-resupply-airdrop-cell
description: Support U.S. warfighter planning and decision support for Autonomous Precision Resupply Airdrop Cell. Use when missions require Autonomous Precision Resupply Airdrop Cell planning, integrated options, and protocol-aware staff outputs.
---

# Autonomous Precision Resupply Airdrop Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Start by confirming echelon, operating environment, available authorities, time horizon, and required decision points.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem using these core inputs: commander objectives, force disposition, operating constraints, and key intelligence gaps.
2. Identify assumptions, decision thresholds, and what reporting or indicators would invalidate the current plan.
3. Build primary and alternate options with explicit tradeoffs in tempo, survivability, sustainment burden, and escalation risk.
4. Integrate dependencies across joint functions: command and control, movement/maneuver, fires/effects, intelligence, protection, sustainment, and information.
5. Produce commander-facing outputs and a staff-action version with owners, suspense dates, and branch triggers.

## Required Output Format

Deliver results in this order:

1. Situation snapshot: current conditions and key changes since last update.
2. Recommended option: one clearly stated recommendation and rationale.
3. Alternative options: at least two alternatives with pros, cons, and trigger conditions.
4. Decision points: what must be decided now, later, or pre-delegated.
5. Staff tasking: who does what by when.

## Domain Products

Primary products for this skill: mission estimate, decision support matrix, branch-sequel trigger set.

## External Tools and Protocol Integration

- Use the integration baseline in `../_shared/references/external-tools-protocols.md` and name the exact tools selected for this mission set.
- Use playbook packet patterns in `../_shared/references/tool-protocol-playbooks.md` for each critical tool dependency.
- Include at least one primary system-of-record and one cross-check source before final recommendations.
- State the protocol or message format for outbound coordination (for example USMTF, VMF, Link 16 J-series, CoT, STIX/TAXII, OGC, or HL7/FHIR).
- Include provenance metadata: source system, refresh time (UTC), assumptions, and confidence.

## Interoperability Validation Checklist

- Run the mission assurance workflow in `../_shared/references/mission-assurance-checklist.md` before final release.
- Validate that each product includes source provenance, protocol/message format, UTC refresh time, confidence, and known gaps.
- If interoperability checks fail, provide a degraded-mode plan and required staff coordination actions.

## Tool Invocation Contract

- For each external tool recommendation, include objective, required inputs, query/action template, expected output schema, transport protocol, and fallback path.
- Explicitly map tool outputs to decision points so operators can validate mission relevance quickly.
- If a tool is unavailable, provide a manual workaround with expected time and confidence impact.

## Machine-Readable Output Contract

- Provide a compact handoff block with fields: `mission_id`, `decision_window_utc`, `recommendation_id`, `option_rank`, `trigger_conditions`, `required_actions`, `tool_dependencies`, `protocols`, `confidence`, and `known_gaps`.
- Structure tasking entries as `owner`, `action`, `due_utc`, `status`, and `dependency` to enable direct ingestion by workflow systems.
- Include an explicit `degraded_mode` object listing fallback tools, expected delay, and confidence penalty when integrations fail.

## U.S. Warfighter Integration Baseline

- Apply baseline guidance in `../_shared/references/us-warfighter-integration-baseline.md` for mission context, authority chain, and data path constraints.
- Include a `uibl_profile` field in machine-readable outputs with selected network path, protocol binding, and fallback PACE plan.
- Confirm every recommendation includes U.S. standards alignment (USMTF or justified alternate), decision authority, and degraded-mode branch triggers.

## Cross-Domain Escalation Hooks

- Identify at least two adjacent cells or staff functions that must be notified when risk crosses thresholds.
- Include escalation triggers in measurable terms and map each trigger to an owner and required report format.
- Provide a no-fail communication fallback for each escalation path with expected delay.

## Guardrails

- Flag gaps where assumptions exceed evidence.
- Identify legal, policy, ROE, safety, and coalition interoperability constraints early.
- Separate facts, assessed judgments, and unknowns.
- Do not fabricate classified sources, authorities, or approvals.
