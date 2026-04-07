---
name: coalition-ration-dietary-compliance-and-allergen-assurance-cell
description: Coordinate coalition ration dietary compliance and allergen assurance. Use when multinational feeding plans must preserve readiness across medical diets, religious restrictions, and ingredient-traceability constraints under contested logistics.
---

# Coalition Ration Dietary Compliance and Allergen Assurance Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm ration inventory, partner caveats, allergy or intolerance burden, religious dietary rules, and distribution constraints before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with inventory posture, ingredient manifests, dietary demand, coalition caveats, and commander priorities.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in nutrition sufficiency, distribution speed, compliance confidence, and partner burden.
3. Identify branch triggers for allergen uncertainty, mislabeled stock, cultural noncompliance, or ration shortfall.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and coalition-sustainment decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: dietary compliance board, allergen risk ladder, and coalition ration-release matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-ration-dietary-compliance-allergen-assurance-v1` with `protocol_stack_id=ps-coalition-ration-dietary-compliance-allergen-assurance-stack-v1`.
- Alternate: select a mission-adjacent ration-distribution, force-health, or coalition sustainment suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: mission-essential feeding only with manual ingredient review, partner liaison concurrence, and conservative allergen exclusion.

## Domain Packet Defaults

- Default packet ID: `DPL-RATION-ALLERGEN-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: ration inventory board, ingredient and allergen manifest ledger, meal-demand tracker, and coalition caveat board.
- Preferred protocol profiles for coordination and machine exchange: `GS1 EPCIS`, `NIEM`, signed ration manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If ingredient traceability, dietary compliance, or ration-release authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag label ambiguity, cross-contamination risk, cultural noncompliance, and ration substitution drift before recommending action.
- Do not fabricate ingredient traceability, allergen safety, or release approval.
