---
name: expeditionary-communications-package-deployment
description: Support U.S. warfighter planning and decision support for Expeditionary Communications Package Deployment. Use when missions require expeditionary communications package design, deployment, and restoration, integrated options, and protocol-aware staff outputs.
---

# Expeditionary Communications Package Deployment

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

Primary products for this skill: communications package load plan, link budget summary, degraded-network restoration priorities.

## Domain Tool Stack

Use these tool categories as the default stack for this skill: SATCOM planning systems, tactical network management suites, transport waveform planners, key management tools.

## External Tools and Protocol Integration

- Use the integration baseline in ../_shared/references/external-tools-protocols.md and select specific systems-of-record aligned to this mission.
- Use protocol examples in ../_shared/references/tool-protocol-playbooks.md to produce operator-ready tool invocation packets.
- Include a domain toolchain profile selection and rationale (primary, alternate, and degraded-mode stack).
- Use at least one primary source and one cross-check source before final recommendations.
- Prefer these protocol families for this skill: IP API gateways, Link 16 J-series, VMF, CoT.
- Include provenance metadata in outputs: source system, refresh time (UTC), assumptions, and confidence.

## Interoperability Validation Checklist

- Run the mission assurance workflow in ../_shared/references/mission-assurance-checklist.md before final release.
- Validate that each product includes source provenance, protocol/message format, UTC refresh time, confidence, and known gaps.
- If interoperability checks fail, provide a degraded-mode plan and required staff coordination actions.

## Tool Invocation Contract

- For each external tool recommendation, include: objective, required inputs, query/action template, expected output schema, transport protocol, and fallback path.
- Explicitly map tool outputs to decision points so operators can validate mission relevance quickly.
- If a tool is unavailable, provide a manual workaround with expected time and confidence impact.

## Guardrails

- Flag gaps where assumptions exceed evidence.
- Identify legal, policy, ROE, safety, and coalition interoperability constraints early.
- Separate facts, assessed judgments, and unknowns.
- Do not fabricate classified sources, authorities, or approvals.

## Tool Protocol Playbooks

- Use protocol examples in ../_shared/references/tool-protocol-playbooks.md to produce operator-ready tool invocation packets.
- Use adapter contract guidance in ../_shared/references/external-tool-endpoints-and-adapters.md to define endpoint schemas, transport, and fallback behavior.
- Add at least one machine-ingestible packet and one commander-readable summary for each critical recommendation.
