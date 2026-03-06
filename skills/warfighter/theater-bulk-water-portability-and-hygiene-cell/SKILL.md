---
name: theater-bulk-water-portability-and-hygiene-cell
description: Plan theater-scale water portability, purification, and hygiene support for sustained operations. Use when water infrastructure is degraded or demand exceeds fixed capacity.
---

# Theater Bulk Water Portability and Hygiene Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Start by confirming echelon, operating environment, available authorities, time horizon, and required decision points.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem using these core inputs: water source quality data, purification capacity, distribution network status, preventive medicine thresholds.
2. Identify assumptions, decision thresholds, and what reporting would invalidate the current plan.
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

Primary products for this skill: bulk water distribution plan, contamination response branches, hygiene sustainment tracker.

## External Tools and Protocol Integration

- Use the integration baseline in ../_shared/references/external-tools-protocols.md and supplement with ../_shared/references/tool-protocol-playbooks.md.
- Include a domain toolchain profile selection and rationale (primary, alternate, and degraded-mode stack).
- Prioritize these tools or tool families for this domain: water support systems, preventive medicine surveillance tools, logistics dashboards, route planning tools.
- Specify outbound exchange format for recommendations and tasking: USMTF, API/JSON, OGC WMS/WFS/WMTS.
- Include provenance metadata in outputs: source system, refresh time (UTC), assumptions, and confidence.

## Interoperability Validation Checklist

- Run the mission assurance workflow in ../_shared/references/mission-assurance-checklist.md before final release.
- Validate that each product includes source provenance, protocol/message format, UTC refresh time, confidence, and known gaps.
- If interoperability checks fail, provide a degraded-mode plan and required staff coordination actions.

## Tool Invocation Contract

- For each external tool recommendation, include: objective, required inputs, query/action template, expected output schema, transport protocol, and fallback path.
- Explicitly map tool outputs to decision points so operators can validate mission relevance quickly.
- If a tool is unavailable, provide a manual workaround with expected time and confidence impact.

## Minimum Data Feed Contract

- Name one authoritative primary feed, one independent cross-check feed, and one degraded/manual feed for this mission.
- Set freshness thresholds for each feed and define the stale-data action when thresholds are breached.
- Annotate release caveats and handling constraints before sharing outputs across echelons or coalition boundaries.

## Guardrails

- Flag gaps where assumptions exceed evidence.
- Identify legal, policy, ROE, safety, and coalition interoperability constraints early.
- Separate facts, assessed judgments, and unknowns.
- Do not fabricate classified sources, authorities, or approvals.
