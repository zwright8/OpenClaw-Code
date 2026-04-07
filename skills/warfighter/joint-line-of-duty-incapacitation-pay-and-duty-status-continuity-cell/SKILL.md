---
name: joint-line-of-duty-incapacitation-pay-and-duty-status-continuity-cell
description: Preserve line-of-duty evidence, incapacitation pay, and lawful duty-status continuity when injury, illness, or incident friction threatens pay, treatment, or availability for U.S. warfighters.
---

# Joint Line Of Duty Incapacitation Pay And Duty Status Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter line-of-duty, incapacitation-pay, and duty-status continuity decisions.
- Confirm injury or illness context, current orders or drill status, LOD posture, pay interruption risk, and command deadlines before recommending action.
- Keep outputs unclassified by default and minimize PHI or PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using injury timeline, LOD evidence, current duty status, incapacitation-pay exposure, and medical or command impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in legal legitimacy, pay continuity, treatment access, and readiness.
3. Identify branch triggers for missing witness or medical evidence, duty-status mismatch, delayed pay action, mobilization overlap, and denial or appeal deadlines.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and duty-status risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: LOD continuity board, incapacitation-pay ladder, and duty-status legitimacy packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-LODPAY-346`, `tool_suite_id=ts-joint-line-of-duty-incapacitation-pay-duty-status-continuity-v1`, and `protocol_stack_id=ps-joint-line-of-duty-incapacitation-pay-duty-status-continuity-stack-v1`.
- Alternate: select a mission-adjacent convalescent-leave, medical-board, or finance suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual LOD or pay-risk roster with advisory-only sequencing until evidence, duty authority, and fiscal posture are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-LOD-INCAP-PAY-DUTY-STATUS-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: LOD investigation tracker, incapacitation-pay queue, duty-status ledger, and medical or personnel orders board.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NIEM`, signed LOD or pay notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If LOD evidence, duty authority, or pay legitimacy is uncertain, downgrade to advisory-only and request human medical, finance, or personnel review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and acknowledgment integrity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported pay promises, stale incident evidence, unlawful duty-status assumptions, and privacy leakage before recommending action.
- Do not fabricate LOD findings, incapacitation-pay approval, orders status, or appeal outcomes.
