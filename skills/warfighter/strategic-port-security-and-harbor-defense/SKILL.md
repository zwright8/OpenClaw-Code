---
name: strategic-port-security-and-harbor-defense
description: Support U.S. warfighter planning and decision support for Strategic Port Security And Harbor Defense. Use when missions require strategic port security and harbor defense under contested conditions, integrated options, and protocol-aware staff outputs.
---

# Strategic Port Security And Harbor Defense

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

Primary products for this skill: port vulnerability map, vessel screening priority list, harbor defense response plan.

## Domain Tool Stack

Use these tool categories as the default stack for this skill: AIS maritime feeds, port security sensor systems, harbor operations centers, geospatial surveillance services.

## External Tools and Protocol Integration

- Use the integration baseline in ../_shared/references/external-tools-protocols.md and select specific systems-of-record aligned to this mission.
- Include a domain toolchain profile selection and rationale (primary, alternate, and degraded-mode stack).
- Use at least one primary source and one cross-check source before final recommendations.
- Prefer these protocol families for this skill: AIS/NMEA exchange, CoT, OGC WMS/WFS/WMTS, USMTF.
- Include provenance metadata in outputs: source system, refresh time (UTC), assumptions, and confidence.

## Interoperability Validation Checklist

- Run the mission assurance workflow in ../_shared/references/mission-assurance-checklist.md before final release.
- Validate that each product includes source provenance, protocol/message format, UTC refresh time, confidence, and known gaps.
- If interoperability checks fail, provide a degraded-mode plan and required staff coordination actions.

## Tool Invocation Contract

- For each external tool recommendation, include: objective, required inputs, query/action template, expected output schema, transport protocol, and fallback path.
- Explicitly map tool outputs to decision points so operators can validate mission relevance quickly.
- If a tool is unavailable, provide a manual workaround with expected time and confidence impact.

## Machine-Readable Output Contract

- Provide a compact handoff block with fields: `mission_id`, `decision_window_utc`, `recommendation_id`, `option_rank`, `trigger_conditions`, `required_actions`, `tool_dependencies`, `protocols`, `confidence`, and `known_gaps`.
- Structure tasking entries as `owner`, `action`, `due_utc`, `status`, and `dependency` to enable direct ingestion by workflow systems.
- Include an explicit `degraded_mode` object listing fallback tools, expected delay, and confidence penalty when integrations fail.

## Cross-Domain Escalation Hooks

- Identify at least two adjacent cells or staff functions that must be notified when risk crosses thresholds (for example fires, intel, cyber, logistics, legal, coalition liaison).
- Include escalation triggers in measurable terms and map each trigger to an owner and required report format.
- Provide a no-fail communication fallback for each escalation path (alternate network, voice relay, or courier) with expected delay.

## Guardrails

- Flag gaps where assumptions exceed evidence.
- Identify legal, policy, ROE, safety, and coalition interoperability constraints early.
- Separate facts, assessed judgments, and unknowns.
- Do not fabricate classified sources, authorities, or approvals.

## U.S. Warfighter Tool Auth and Access Drill

- Use `../_shared/references/us-warfighter-tool-auth-and-access-drill.md` to verify account state, role binding, and transport availability before critical actions.
- If any critical integration lacks valid credentials, publish a degraded-mode branch and request revalidation suspense.
- Record auth/access status in the output handoff so downstream cells can execute without re-triage.
