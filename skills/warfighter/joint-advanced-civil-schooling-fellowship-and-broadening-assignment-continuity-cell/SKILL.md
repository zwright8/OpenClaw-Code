---
name: joint-advanced-civil-schooling-fellowship-and-broadening-assignment-continuity-cell
description: Preserve advanced civil schooling, fellowship selection, and broadening-assignment continuity when nomination, funding, or PCS drift threatens U.S. warfighter retention, deliberate talent development, or service-obligation legitimacy.
---

# Joint Advanced Civil Schooling Fellowship And Broadening Assignment Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter advanced-schooling, fellowship, and broadening-assignment continuity decisions.
- Confirm affected population, selection or nomination posture, funding status, PCS or utilization-tour timeline, service-obligation requirements, and approval authority before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using nomination status, selection timeline, funding posture, education or fellowship start date, utilization-tour impact, and retention risk.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in talent development, assignment stability, fiscal legitimacy, and service obligation.
3. Identify branch triggers for lost funding, missed nomination windows, PCS slippage, obligation mismatch, and selection-board delay.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and talent-development risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: schooling-selection board, fellowship decision ladder, and broadening-assignment continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-BROADEN-383`, `tool_suite_id=ts-joint-advanced-civil-schooling-fellowship-broadening-assignment-continuity-v1`, and `protocol_stack_id=ps-joint-advanced-civil-schooling-fellowship-broadening-assignment-continuity-stack-v1`.
- Alternate: select a mission-adjacent promotion-board, PME, or personnel-records suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual talent-development roster with advisory-only sequencing until selection status, funding posture, and human talent-management review are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-ACS-FELLOWSHIP-BROADENING-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: education or fellowship selection board, nomination queue, funding-status ledger, and utilization-tour or assignment tracker.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `HR-XML`, `PESC XML`, signed education notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If selection authority, funding evidence, or service-obligation legitimacy is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and selection evidence clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported fellowship promises, stale funding assumptions, missed nomination windows, and obligation mismatch before recommending action.
- Do not fabricate selection results, funding approval, PCS timing, or utilization-tour outcomes.
