---
name: tactical-small-unit-power-and-spectrum-discipline-cell
description: Optimize small-unit survivability by synchronizing battery usage, emissions control, and low-probability-detection communication windows.
---

# Tactical Small Unit Power And Spectrum Discipline Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Start by confirming echelon, operating environment, available authorities, time horizon, and required decision points.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem using commander intent, force disposition, constraints, and critical intelligence gaps.
2. Identify assumptions, decision thresholds, and indicators that invalidate the current plan.
3. Build primary and alternate options with tradeoffs in tempo, survivability, sustainment burden, and escalation risk.
4. Integrate dependencies across C2, maneuver, fires/effects, intelligence, protection, sustainment, information, and coalition coordination when relevant.
5. Produce commander-facing recommendations and a staff-action version with owners, suspense dates, branch/sequel triggers, and authority checks.

## Required Output Format

Deliver results in this order:

1. Situation snapshot.
2. Recommended option and rationale.
3. Alternative options with trigger conditions.
4. Decision points and required approvals.
5. Staff tasking with timeline.

## Domain Products

Primary products for this skill: power-emissions synchronization card, signature-risk heatmap, comms window execution matrix.

## Domain Tool Stack

Use these tool categories as the default stack for this skill: squad energy telemetry, tactical waveform management tools, electromagnetic signature monitors.

## Protocol Profile

Preferred protocol families for this skill: USMTF, Link 16 J-series, CoT.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-small-unit-power-spectrum-v1`.
- Alternate: `tool_suite_id=ts-spectrum-governance-v1`.
- Degraded: command-approved manual workflow with authenticated voice confirmation and UTC acknowledgment logging.

## External Tools and Protocol Integration

- Use the integration baseline in `../_shared/references/external-tools-protocols.md` and name exact tools selected for this mission.
- Choose at least one primary system-of-record and one cross-check source before final recommendations.
- State outbound protocol or message formats (for example `USMTF`, `VMF`, `Link 16 J-series`, `CoT`, `STIX/TAXII`, `OGC`, or `NATO APP-11/ADatP-3`).
- Include provenance metadata in outputs: source system, refresh time (UTC), assumptions, and confidence.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` before final release.
- Validate source provenance, protocol/message format, UTC refresh time, confidence, and known gaps for each product.
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

## Mission Tool Authority Gates

- Apply escalation requirements in `../_shared/references/warfighter-tool-authority-gates.md` for high-consequence recommendations.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for recommendations that can alter mission posture.
- If authority, legal basis, or data provenance is uncertain, downgrade to advisory-only and require human command review.

## Domain Toolchain Override (2026-03-10)

- Prefer `tool_suite_id=ts-small-unit-power-spectrum-v1` for primary decision support and bind to mission packet `DPL-SMALLUNIT-POWER-EMSIG-001`.
- Use `tool_suite_id=ts-spectrum-governance-v1` as required cross-check for divergence or trust-score decay.
- Include `packet_id=DPL-SMALLUNIT-POWER-EMSIG-001`, `protocol_profile`, `ack_chain_status`, and `trust_score` in all commander-facing outputs.
