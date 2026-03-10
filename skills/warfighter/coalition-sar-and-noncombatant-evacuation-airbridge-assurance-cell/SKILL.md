---
name: coalition-sar-and-noncombatant-evacuation-airbridge-assurance-cell
description: Plan coalition SAR and NEO airbridge assurance with deconflicted routing, manifest integrity, and civilian-risk control. Use for rapid extraction under degraded communications.
---

# Coalition SAR And Noncombatant Evacuation Airbridge Assurance Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm echelon, operational environment, authorities, time horizon, and decision points before analysis.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem with commander intent, constraints, and assumptions.
2. Build one recommended option plus at least two alternatives with explicit tradeoffs.
3. Bind recommendations to dependencies across command and control, intelligence, fires/effects, protection, sustainment, and information.
4. Define branch triggers, risk thresholds, and revalidation cadence.
5. Publish commander-readable and staff-action outputs with owners and suspense.

## Required Output Format

Deliver in this order:

1. Situation snapshot.
2. Recommended option.
3. Alternative options.
4. Decision points and triggers.
5. Staff tasking with owners and suspense.

## Domain Products

Primary products for this skill: coalition SAR/NEO airbridge synchronization board, manifest and custody assurance log, extraction risk-trigger timeline.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and select mission-fit profiles from `../_shared/references/joint-operations-external-toolchain-profiles.md`.
- Select concrete suites and stacks from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Prioritize these tool/protocol families for this domain: air mobility C2 systems, personnel accountability tools, coalition airspace deconfliction services.
- Include one primary system-of-record and one cross-check source for each critical recommendation.
- State protocol/transport for outbound coordination (`USMTF`, `VMF`, `Link 16 J-series`, `CoT`, `STIX/TAXII`, `OGC`, `AIS/NMEA`, `HL7/FHIR`, or coalition formats).
- Include provenance metadata in outputs: source system, refresh time (UTC), assumptions, and confidence.

## Tool Invocation Contract

For each critical tool recommendation, include objective, required inputs, query/action template, expected schema, protocol/transport, and fallback path.

## Mission Tool Authority Gates

- Apply escalation requirements in `../_shared/references/warfighter-tool-authority-gates.md` for high-consequence recommendations.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for recommendations that can alter mission posture.
- If authority, legality, or provenance is uncertain, downgrade to advisory-only and request human command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` before final release.
- Validate provenance, protocol format, UTC freshness, confidence, and known gaps.
- If checks fail, provide a degraded-mode plan with explicit risk effects.

## Guardrails

- Flag assumptions that exceed evidence.
- Separate facts, assessed judgments, and unknowns.
- Identify legal, policy, ROE, safety, and coalition constraints early.
- Do not provide weapon-employment procedures or bypasses to safeguards.
