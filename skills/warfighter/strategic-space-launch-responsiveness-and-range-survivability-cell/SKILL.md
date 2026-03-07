---
name: strategic-space-launch-responsiveness-and-range-survivability-cell
description: Plan and coordinate Strategic Space Launch Responsiveness And Range Survivability Cell operations for U.S. warfighters. Use when staff needs mission-ready recommendations, tool/protocol-integrated workflows, and escalation triggers in this domain.
---

# Strategic Space Launch Responsiveness And Range Survivability Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Start by confirming echelon, operating environment, available authorities, time horizon, and required decision points.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem with commander intent, constraints, and available force/capability options.
2. Identify assumptions, decision thresholds, and indicators that would require branch plan activation.
3. Build a primary recommendation and at least two alternatives with clear operational tradeoffs.
4. Integrate dependencies across joint functions and coalition/interagency touchpoints as needed.
5. Produce commander-facing outputs and a staff action tracker with owners, suspense dates, and branch triggers.

## Required Output Format

Deliver results in this order:

1. Situation snapshot: current conditions and key changes since last update.
2. Recommended option: one clearly stated recommendation and rationale.
3. Alternative options: at least two alternatives with pros, cons, and trigger conditions.
4. Decision points: what must be decided now, later, or pre-delegated.
5. Staff tasking: who does what by when.

## Domain Products

Primary products for this skill: mission estimate, synchronization matrix, risk controls, and decision support brief.

## External Tools and Protocol Integration

- Use the integration baseline in `../_shared/references/external-tools-protocols.md` and the action templates in `../_shared/references/tool-protocol-playbooks.md`.
- Select primary, alternate, and degraded domain toolchain profiles from `../_shared/references/domain-toolchain-profiles.md`.
- Bind each critical dependency to adapter contracts from `../_shared/references/us-joint-tool-adapter-contracts.md`.
- Include protocol/message format for outbound coordination (for example `USMTF`, `VMF`, `Link 16 J-series`, `CoT`, `STIX/TAXII`, `OGC`, or `NATO APP-11/ADatP-3`).
- Include source provenance metadata: source system, UTC refresh time, assumptions, and confidence.

## Interoperability Validation Checklist

- Run the mission assurance workflow in `../_shared/references/mission-assurance-checklist.md` before final release.
- Validate each product includes source provenance, protocol/message format, UTC refresh time, confidence, and known gaps.
- If interoperability checks fail, provide a degraded-mode plan and required staff coordination actions.

## Tool Invocation Contract

- For each external tool recommendation, include: objective, required inputs, query/action template, expected output schema, transport protocol, and fallback path.
- Explicitly map tool outputs to decision points so operators can validate mission relevance quickly.
- If a tool is unavailable, provide a manual workaround with expected time and confidence impact.

## Machine-Readable Output Contract

- Provide a compact handoff block with fields: `mission_id`, `decision_window_utc`, `recommendation_id`, `option_rank`, `trigger_conditions`, `required_actions`, `tool_dependencies`, `protocols`, `confidence`, and `known_gaps`.
- Structure tasking entries as `owner`, `action`, `due_utc`, `status`, and `dependency` to enable direct ingestion by workflow systems.
- Include a `degraded_mode` object listing fallback tools, expected delay, and confidence penalty when integrations fail.

## Cross-Domain Escalation Hooks

- Identify at least two adjacent cells or staff functions that must be notified when risk crosses thresholds.
- Include escalation triggers in measurable terms and map each trigger to an owner and required report format.
- Provide a no-fail communication fallback for each escalation path (alternate network, voice relay, or courier).

## U.S. Warfighter Tool Auth and Access Drill

- Use `../_shared/references/us-warfighter-tool-auth-and-access-drill.md` to verify account state, role binding, and transport availability before critical actions.
- If any critical integration lacks valid credentials, publish a degraded-mode branch and request revalidation suspense.
- Record auth/access status in the output handoff so downstream cells can execute without re-triage.

## U.S. Joint Tool Adapter Contract Drill

- Use `../_shared/references/us-joint-tool-adapter-contracts.md` to define adapter_id, protocol, auth mode, and fallback per critical dependency.
- Include adapter health status and last-success UTC for each mission-critical integration.
- Trigger degraded-mode and escalation actions when adapter latency, failures, or schema drift exceed mission thresholds.

## Guardrails

- Flag gaps where assumptions exceed evidence.
- Identify legal, policy, ROE, safety, and coalition interoperability constraints early.
- Separate facts, assessed judgments, and unknowns.
- Do not fabricate classified sources, authorities, or approvals.
## Tool Output Retention and Replay Integrity

- Use `../_shared/references/tool-output-retention-and-replay-policy.md` to define retention, replay, and drift controls for critical external tool outputs.
- Include `retention_packet_id`, `packet_hash`, `replay_status`, `drift_assessment`, and `replay_owner` for each critical dependency.
- If replay evidence is missing or conflicting, mark recommendations as advisory-only and require explicit human command approval.

