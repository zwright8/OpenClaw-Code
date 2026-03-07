---
name: joint-multi-orbit-comms-degradation-response-cell
description: Provide U.S. warfighter decision support for Joint Multi Orbit Comms Degradation Response Cell missions, including joint planning outputs, external tool usage, and protocol-aware fallback actions.
---

# Joint Multi Orbit Comms Degradation Response Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter operations in this domain.
- Confirm echelon, authorities, operating environment, and decision timeline before producing recommendations.
- Keep outputs unclassified by default unless handling guidance is explicitly provided.

## Workflow

1. Frame the mission problem and desired effects with explicit constraints.
2. Pull and reconcile authoritative data from primary and cross-check systems.
3. Build a recommended option plus at least two branches with trigger thresholds.
4. Map dependencies, risks, and escalation paths across adjacent warfighting functions.
5. Produce commander-facing recommendations and executable staff tasking.

## Required Output Format

1. Situation snapshot and key deltas.
2. Recommended option with rationale.
3. Alternate branches with triggers.
4. Decision points (now/next/pre-delegate).
5. Staff tasks with owners and due times.

## Domain Products

Primary products for this skill: mission support package, risk-and-branch matrix, protocol-ready handoff payload.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Select and justify primary/alternate/degraded toolchain profiles.
- State outbound protocol and transport (`USMTF`, `VMF`, `Link 16 J-series`, `CoT`, `STIX/TAXII`, `OGC`, or `AIS/NMEA`).
- Record provenance metadata: source systems, refresh time (UTC), assumptions, and confidence.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` before release.
- Validate schema, message formatting, and data-quality checks.
- If any integration fails, publish degraded-mode actions and timeline impact.

## Tool Invocation Contract

- For each tool: objective, required inputs, query/action template, expected schema, transport protocol, and fallback.
- Map each dependency to a specific decision point.
- Provide manual workaround guidance when tools are denied or degraded.

## Machine-Readable Output Contract

- Include: `mission_id`, `decision_window_utc`, `recommendation_id`, `option_rank`, `trigger_conditions`, `required_actions`, `tool_dependencies`, `protocols`, `confidence`, `known_gaps`.
- Provide tasking entries as `owner`, `action`, `due_utc`, `status`, `dependency`.
- Include a `degraded_mode` block with fallback tools, delay estimate, and confidence penalty.

## Cross-Domain Escalation Hooks

- Identify at least two adjacent cells that require threshold-triggered notifications.
- Define measurable escalation triggers and required report format.
- Include a comms fallback path with expected delay.

## U.S. Warfighter Tool Auth and Access Drill

- Use `../_shared/references/us-warfighter-tool-auth-and-access-drill.md` before critical actions.
- If credentials or transport fail, publish degraded branch actions and revalidation suspense.
- Carry auth/access status into the final handoff.

## U.S. Joint Tool Adapter Contract Drill

- Use `../_shared/references/us-joint-tool-adapter-contracts.md` for adapter mapping.
- Track adapter health and last-success UTC.
- Trigger degraded mode when latency, failure rate, or schema drift exceeds threshold.

## Joint Protocol Translation and Fallback Matrix

- Use `../_shared/references/joint-protocol-translation-and-fallback-matrix.md` when relaying outputs between mixed protocol ecosystems.
- For each translated output, include source protocol, target protocol, adapter ID, validation status, fallback mode, and confidence delta.
- If translation cannot be validated, route to human review and publish a bounded degraded path.

## Guardrails

- Separate facts, assessments, and unknowns.
- Surface ROE, legal, policy, safety, and coalition constraints early.
- Do not fabricate authorities, approvals, or source data.
