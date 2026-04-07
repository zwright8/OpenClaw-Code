---
name: reserve-component-single-parent-childcare-eldercare-mobilization-bridge-cell
description: Close dependent-care failures that block reserve-component mobilization. Use when single-parent, childcare, or eldercare gaps threaten Guard or Reserve activation, lawful deployment, or sustained availability.
---

# Reserve Component Single Parent Childcare Eldercare Mobilization Bridge Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter dependent-care and mobilization-continuity decisions in Guard and Reserve populations.
- Confirm affected force packages, dependent-care-plan status, caregiver availability, activation timeline, and legal or command constraints before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using activation demand, dependent-care-plan gaps, childcare and eldercare capacity, travel constraints, and mission-critical shortages.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in mobilization speed, family stability, legal sufficiency, and readiness impact.
3. Identify branch triggers for care-plan failure, single-point caregiver loss, eldercare medical escalation, and activation deferral decisions.
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

Primary products: dependent-care readiness board, mobilization bridge ladder, and caregiver-support packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-DEPENDENTCARE-288`, `tool_suite_id=ts-reserve-component-single-parent-childcare-eldercare-mobilization-bridge-v1`, and `protocol_stack_id=ps-reserve-component-single-parent-childcare-eldercare-mobilization-bridge-stack-v1`.
- Alternate: select a mission-adjacent family-readiness, mobilization, or school-transport/dependent-evacuation suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual dependent-care roster with advisory-only mobilization impacts until caregiver confirmation and command review are complete.

## Domain Packet Defaults

- Default packet ID: `DPL-SINGLE-PARENT-ELDERCARE-MOB-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: dependent-care-plan ledger, childcare capacity board, eldercare support tracker, and mobilization exception queue.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed care-plan notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If caregiver legitimacy, dependent-care-plan validity, or activation authority is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported caregiver commitments, privacy exposure, activation coercion risk, and family-safety shortfalls before recommending action.
- Do not fabricate care plans, mobilization authorities, childcare capacity, or eldercare commitments.
