---
name: austere-respiratory-protective-equipment-fit-and-filter-rotation-cell
description: Coordinate respiratory protection fit status, filter consumption, and exposure-driven resupply in austere conditions. Use when CBRN or toxic airborne threats make respirator confidence and filter burn rate operationally decisive.
---

# Austere Respiratory Protective Equipment Fit And Filter Rotation Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm CBRN authority, occupational-health thresholds, issue policy, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with exposed force list, fit status, filter inventory, and hazard indicators.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in exposure risk, mission endurance, supply burn, and operational tempo.
3. Identify branch or sequel triggers, issue hold points, and release-approval gates.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: fit and issue matrix, filter rotation ladder, and exposure-based resupply board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-austere-respiratory-protection-fit-filter-rotation-v1` with `protocol_stack_id=ps-austere-respiratory-protection-fit-filter-rotation-stack-v1`.
- Alternate: select a mission-adjacent force-health, CBRN, or medical logistics suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: mission-essential issue only with commander-approved conservation measures.

## Domain Packet Defaults

- Default packet ID: `DPL-RESPIRATORY-PROTECTION-FILTER-ROTATION-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: fit-test registry, filter burn tracker, and exposure review board.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, CBRN `USMTF`, `API/JSON`, and signed inventory manifests.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, fit verification, hazard review, or filter-stock confidence is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag exposure-dose, user-fit, stockpile, and medical-waiver risks before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
