---
name: joint-portable-shower-laundry-and-textile-biosecurity-cell
description: Coordinate portable shower, laundry, and textile biosecurity operations for deployed forces. Use when hygiene failure, infestation, or contaminated textiles threaten force health in austere or high-density environments.
---

# Joint Portable Shower Laundry And Textile Biosecurity Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm preventive-medicine authority, sanitation standards, water constraints, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with shower throughput, laundry status, textile contamination indicators, and vector or outbreak risk.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in hygiene, water burn, disease prevention, and unit disruption.
3. Identify branch or sequel triggers, sanitation hold points, and approval gates.
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

Primary products: hygiene continuity matrix, textile decon ladder, and vector-control exception board.

## External Tool Stack and Protocols

- Primary toolsets: sanitation throughput planner, textile contamination tracker, and vector-risk dashboard.
- Alternate toolsets: manual hygiene roster, field laundry worksheet, and infestation review board.
- Degraded mode: mission-essential shower and linen exchange only with daily contamination sampling and water-discipline enforcement.
- Preferred protocol profiles: `HL7/FHIR`, `API/JSON`, `USMTF`, and signed sanitation manifests.
- Use `../_shared/references/external-tools-protocols.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md` as the baseline for building a provisional packet for this domain.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, contamination sampling, or water-allocation confidence is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag infestation, mold, textile cross-contamination, and force-hygiene degradation risks before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
