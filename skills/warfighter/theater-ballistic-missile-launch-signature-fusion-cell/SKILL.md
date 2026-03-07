---
name: theater-ballistic-missile-launch-signature-fusion-cell
description: Support U.S. warfighter planning and operational decision support for Theater Ballistic Missile Launch Signature Fusion Cell scenarios across joint and coalition mission environments. Use when planning, synchronizing, or adapting operations that require cross-domain coordination under uncertainty.
---

# Theater Ballistic Missile Launch Signature Fusion Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Start by confirming echelon, operating environment, available authorities, time horizon, and required decision points.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem using these core inputs: sensor cueing data, threat library, defended asset list, timeline constraints.
2. Define measurable objectives, risk thresholds, branch conditions, and indicators that invalidate the preferred plan.
3. Build a recommended option and at least two alternatives with explicit tradeoffs in tempo, survivability, sustainment load, and escalation risk.
4. Integrate dependencies across command and control, maneuver, fires/effects, intelligence, protection, sustainment, and information.
5. Convert decisions into execution-ready products with owners, suspense dates, coordination links, and required reports.

## Required Output Format

Deliver results in this order:

1. Situation snapshot: current conditions and key changes since the last update.
2. Recommended option: one clearly stated recommendation and rationale.
3. Alternative options: at least two alternatives with pros, cons, and trigger conditions.
4. Decision points: what must be decided now, later, or pre-delegated.
5. Staff tasking: who does what by when.

## Domain Products

Primary products for this skill: launch signature fusion brief, warning confidence ladder, intercept cueing handoff matrix.

## Domain Tool Stack

Use these tool categories as the default stack for this skill: missile warning feeds, infrared sensor fusion tools, IAMD command systems, battle management dashboards.

## External Tools and Protocol Integration

- Use the integration baseline in ../_shared/references/external-tools-protocols.md and select specific systems-of-record aligned to this mission.
- Use protocol examples in ../_shared/references/tool-protocol-playbooks.md to produce operator-ready tool invocation packets.
- Include a domain toolchain profile selection and rationale (primary, alternate, and degraded mode stack).
- Use at least one primary source and one cross-check source before final recommendations.
- Prefer these protocol families for this skill: Link 16 J-series, USMTF, API/JSON.
- Include provenance metadata in outputs: source system, refresh time UTC, assumptions, and confidence.

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

## Tool Protocol Playbooks

- Use protocol examples in ../_shared/references/tool-protocol-playbooks.md to produce operator-ready tool invocation packets.
- Use adapter contract guidance in ../_shared/references/us-joint-tool-adapter-contracts.md to define endpoint schemas, transport, and fallback behavior.
- Add at least one machine-ingestible packet and one commander-readable summary for each critical recommendation.

## U.S. Warfighter Tool Auth and Access Drill

- Use ../_shared/references/us-warfighter-tool-auth-and-access-drill.md to verify account state, role binding, and transport availability before critical actions.
- If any critical integration lacks valid credentials, publish a degraded-mode branch and request revalidation suspense.
- Record auth/access status in the output handoff so downstream cells can execute without re-triage.

## U.S. Joint Tool Adapter Contract Drill

- Use ../_shared/references/us-joint-tool-adapter-contracts.md to define adapter_id, protocol, auth mode, and fallback per critical dependency.
- Include adapter health status and last-success UTC for each mission-critical integration.
- Trigger degraded-mode and escalation actions when adapter latency, failures, or schema drift exceed mission thresholds.

## Multi-Source Validation Thresholds

- Use ../_shared/references/multi-source-validation-thresholds.md to select validation tier, source-independence checks, contradiction handling, and release gates.
- Include validation_tier, primary_source, cross_check_source, source_independence_rationale, and contradiction_status for each critical recommendation.
- If validation tier requirements are not met inside decision time, downgrade to advisory-only and request human command approval.
