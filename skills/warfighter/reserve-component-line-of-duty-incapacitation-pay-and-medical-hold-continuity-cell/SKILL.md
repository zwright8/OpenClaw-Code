---
name: reserve-component-line-of-duty-incapacitation-pay-and-medical-hold-continuity-cell
description: Preserve line-of-duty determinations, incapacitation-pay continuity, and medical-hold order legitimacy for Reserve and Guard warfighters when injury, illness, or administrative drift threatens lawful pay, treatment access, or force availability.
---

# Reserve Component Line Of Duty Incapacitation Pay And Medical Hold Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. Reserve and Guard medical-hold, incapacitation-pay, and line-of-duty continuity decisions.
- Confirm duty status, injury or illness timeline, line-of-duty evidence posture, pay interruption risk, medical-hold authority, and command decision deadlines before recommending action.
- Keep outputs unclassified by default and minimize protected medical or financial detail unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using duty status, treatment demand, LOD evidence gaps, INCAP pay exposure, medical-hold order posture, and household impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in lawful pay continuity, treatment speed, administrative burden, and activation or backfill reliability.
3. Identify branch triggers for missing injury documentation, LOD denial risk, pay stoppage, expired orders, and treatment-site transfer friction.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander, medical, and personnel decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and LOD or pay-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: line-of-duty evidence board, incapacitation-pay ladder, and medical-hold continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-LODINCAP-333`, `tool_suite_id=ts-reserve-component-line-of-duty-incapacitation-pay-medical-hold-continuity-v1`, and `protocol_stack_id=ps-reserve-component-line-of-duty-incapacitation-pay-medical-hold-continuity-stack-v1`.
- Alternate: select a mission-adjacent medical-board, compensation, or personnel-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual LOD and pay-risk roster with advisory-only sequencing until evidence, orders, and human authority are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-LOD-INCAP-MEDHOLD-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: LOD case board, incapacitation-pay ledger, medical-hold tracker, and orders or pay coordination queue.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NIEM`, signed medical-hold notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If medical-hold authority, LOD review posture, or pay-evidence legitimacy is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and pay-or-order legitimacy.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported LOD assumptions, pay promises, medical-hold order gaps, and privacy leakage before recommending action.
- Do not fabricate LOD status, INCAP entitlement, order extensions, or medical clearance.
