---
name: joint-religious-dietary-accommodation-and-mass-feeding-cell
description: Integrate religious dietary accommodation into military mass-feeding continuity. Use when ration substitution, fasting windows, cultural constraints, or allergen risks affect legitimacy, health, or unit cohesion.
---

# Joint Religious Dietary Accommodation And Mass Feeding Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter mass-feeding, accommodation, and chaplain-informed sustainment decisions.
- Confirm feeding-site capacity, ration source, dietary restrictions, fasting windows, allergen risk, and chaplain or medical availability before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using unit composition, feeding demand, accommodation requirements, ration substitutes, and command decision deadlines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in nutrition, accommodation fidelity, operational simplicity, and supply burden.
3. Identify branch triggers for ration shortages, fasting-period adjustments, allergen exposure, local procurement risk, and protected-meal prioritization.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and feeding-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: dietary accommodation matrix, protected meal-production ladder, and chaplain or medical exception board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-religious-dietary-mass-feeding-v1` with `protocol_stack_id=ps-joint-religious-dietary-mass-feeding-stack-v1`.
- Alternate: select a mission-adjacent field-feeding, food-protection, or religious-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: essential feeding only with manual dietary roster, conservative allergen controls, and explicit command acknowledgment of accommodation gaps.

## Domain Packet Defaults

- Default packet ID: `DPL-RELIGIOUS-DIETARY-MASS-FEEDING-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: ration menu planner, dietary accommodation ledger, chaplain coordination board, and allergen or food-safety review queue.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NIEM`, signed feeding manifests, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If accommodation authority, ration provenance, or allergen confidence is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and approval integrity for accommodation exceptions.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported dietary promises, allergen risk, insensitive ration substitution, and unvetted local food sourcing before recommending action.
- Do not fabricate chaplain concurrence, medical approval, or accommodation capability.
