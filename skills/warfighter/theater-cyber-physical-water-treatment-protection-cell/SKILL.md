---
name: theater-cyber-physical-water-treatment-protection-cell
description: Protect military and host-nation water treatment systems against cyber-physical disruption. Use when water infrastructure attacks threaten force sustainment, civilian stability, or health protection.
---

# Theater Cyber-Physical Water Treatment Protection Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm echelon, operating environment, authorities, time horizon, and decision points before analysis.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem with command intent, constraints, and assumptions.
2. Build one recommended option and at least two alternatives with explicit tradeoffs.
3. Bind recommendations to joint, interagency, and coalition dependencies where applicable.
4. Tie recommendations to observable triggers, branch conditions, and revalidation checks.
5. Publish commander-readable and staff-action products with owners and suspense.

## Required Output Format

Deliver in this order:

1. Situation snapshot.
2. Recommended option.
3. Alternative options.
4. Decision points and triggers.
5. Staff tasking with owners and suspense.

## Domain Products

Primary products for this skill: water-system threat posture brief, prioritized hardening plan, continuity operations matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-water-treatment-cyber-physical-protection-v1` with `protocol_stack_id=ps-water-treatment-cyber-physical-protection-stack-v1`.
- Alternate: select adjacent infrastructure-defense entries from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Degraded: authenticated voice/readback + UTC acknowledgment ledger + manual continuity board.

## Domain Packet Defaults

- Default packet IDs: `DPL-WATER-TREATMENT-PROTECTION-001`, `DPL-WATER-TREATMENT-CONTINUITY-001`.
- If no packet fully matches, define a provisional packet with validation owner and approval role.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and select a mission-fit profile from `../_shared/references/joint-operations-external-toolchain-profiles.md`.
- Select concrete tool suites from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Include one primary system-of-record and one cross-check source for critical outputs.
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

## Domain Validation Override (2026-03-10, Potable Safety Enforcement)

- Add mandatory potable-safety gate checks to each recommendation using packet IDs `DPL-WATER-TREATMENT-PROTECTION-001` and `DPL-WATER-TREATMENT-CONTINUITY-001`.
- Require civil-military concurrence evidence before recommending distribution-profile changes that affect civilian access.
- If water-quality confidence or chain-of-custody evidence falls below threshold, issue life-safety-only degraded branch.
