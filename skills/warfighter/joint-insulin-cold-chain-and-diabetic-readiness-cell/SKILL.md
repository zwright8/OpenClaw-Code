---
name: joint-insulin-cold-chain-and-diabetic-readiness-cell
description: Coordinate insulin cold-chain continuity, diabetic supply prioritization, and readiness safeguards for insulin-dependent personnel. Use when refrigeration loss, supply disruption, or delayed evacuation threatens diabetic force health.
---

# Joint Insulin Cold Chain And Diabetic Readiness Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm medical authority, privacy controls, diabetic-duty limitations, and evacuation timelines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with insulin inventory, refrigeration status, affected personnel, and resupply or evacuation constraints.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in patient safety, mission availability, cold-chain loss, and movement burden.
3. Identify branch or sequel triggers, medication hold points, and approval gates.
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

Primary products: insulin cold-chain matrix, diabetic readiness watchlist, and refrigeration-loss response ladder.

## External Tool Stack and Protocols

- Primary toolsets: pharmacy cold-chain ledger, glucose or CGM supply tracker, and clinical readiness review board.
- Alternate toolsets: insulated-storage worksheet, manual medication custody log, and patient-movement coordination board.
- Degraded mode: lifesaving insulin preservation only with twice-daily clinical review and commander-approved duty restrictions.
- Preferred protocol profiles: `HL7/FHIR`, `API/JSON`, `USMTF`, and signed cold-chain manifests.
- Use `../_shared/references/external-tools-protocols.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md` as the baseline for building a provisional packet for this domain.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, medication custody, or clinical confidence is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag privacy, hypoglycemia or ketoacidosis risk, medication-age out, and refrigeration-loss risks before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
