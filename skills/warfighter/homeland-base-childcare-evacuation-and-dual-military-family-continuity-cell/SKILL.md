---
name: homeland-base-childcare-evacuation-and-dual-military-family-continuity-cell
description: Coordinate installation childcare evacuation, caregiver accountability, and dual-military family continuity during homeland defense crises. Use when base attacks, disasters, or mass alerts disrupt trusted child release and family readiness.
---

# Homeland Base Childcare Evacuation And Dual Military Family Continuity Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm installation authority, child-safeguarding rules, guardian-release policies, and continuity deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with childcare occupancy, guardian availability, release-authentication status, and evacuation-route conditions.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in child safety, family continuity, force availability, and movement tempo.
3. Identify branch or sequel triggers, release hold points, and approval gates.
4. Bind each critical recommendation to concrete external tools, protocols, and staff handoffs.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: childcare evacuation ladder, caregiver accountability board, and family continuity decision matrix.

## External Tool Stack and Protocols

- Primary toolsets: family readiness roster, childcare occupancy board, and evacuation manifest tracker.
- Alternate toolsets: manual child-accountability ledger, dual-military caregiver worksheet, and protected release-authentication board.
- Degraded mode: shelter-in-place or manual handoff only with dual-witness guardian verification and hourly command review.
- Preferred protocol profiles: `NIMS/ICS`, `NIEM`, `EDXL-DE/CAP`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/external-tools-protocols.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md` as the baseline for building a provisional packet for this domain.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, guardian verification, or child-location confidence is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag child-safeguarding, family-privacy, impersonation, and mass-notification risks before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
