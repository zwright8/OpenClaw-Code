---
name: joint-precision-fires-ammo-interoperability-cell
description: Resolve ammunition interoperability constraints across joint and coalition precision-fires platforms during high-tempo operations.
---

# Joint Precision Fires Ammo Interoperability Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm command echelon, mission phase, authorities, coalition constraints, and required commander decisions.
- Keep output unclassified by default unless handling guidance is provided.

## Workflow

1. Frame mission problem with time constraints, threat picture, force posture, and readiness state.
2. Build one recommended COA plus at least two alternatives with explicit tradeoffs.
3. Identify branch/sequel triggers, data dependencies, and command approval gates.
4. Bind each critical recommendation to external tools, protocol stack, and degraded-mode fallback.
5. Publish staff-action tasks with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes
2. Recommended COA and rationale
3. Alternative COAs with triggers
4. Decision points and escalation gates
5. Staff task tracker with owners/suspense
6. Tool invocation packets and protocol bindings

## Domain Products

Primary products for this skill: ammo compatibility matrix, fires readiness delta report, substitution decision packet.

## Domain Tooling and Protocol Baseline

- Preferred external toolsets for this domain: fire-control compatibility databases, lot traceability systems, coalition munitions ledgers, targeting/fires systems.
- Preferred protocol profiles for coordination and machine exchange: VMF, Link 16 J-series, NATO APP-11/ADatP-3, USMTF.
- Use ../_shared/references/warfighter-external-tool-and-protocol-catalog.md to select tool_suite_id and protocol_stack_id.
- Use ../_shared/references/domain-tool-packet-library.md to select packet_id and protocol_profile.

## Interoperability and Trust Validation

- Run ../_shared/references/mission-assurance-checklist.md prior to release.
- Apply authority and escalation controls from ../_shared/references/warfighter-tool-authority-gates.md.
- Include provenance, UTC freshness, confidence, and known-gap declarations for every critical recommendation.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag legal, ROE, LOAC, policy, and coalition caveat constraints before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
- If data trust or authority is below threshold, downgrade to advisory-only and request human command decision.

## Operational Hardening Override (2026-03-10)

- Default to `tool_suite_id=ts-fires-airspace-v1` plus cross-domain validation against `ts-logistics-distribution-v1` when ammo substitutions alter theater sustainment.
- Require packet pairing: `packet_id=DPL-COAL-FIRES-001` for coalition clearance and `packet_id=DPL-MUNI-QA-001` for lot quality/release confidence.
- Enforce dual authority checks before recommending immediate substitution: fires authority and munitions safety authority.
- If lot traceability, coalition caveats, or blast-fragmentation metadata are incomplete, downgrade recommendation to advisory-only and present a time-bounded closure plan.
