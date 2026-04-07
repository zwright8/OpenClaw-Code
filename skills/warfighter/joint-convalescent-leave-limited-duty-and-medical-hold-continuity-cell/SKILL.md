---
name: joint-convalescent-leave-limited-duty-and-medical-hold-continuity-cell
description: Preserve convalescent leave, limited-duty profiles, and medical-hold continuity for wounded or ill U.S. warfighters when recovery orders, pay, or return-to-duty clarity are at risk from administrative friction.
---

# Joint Convalescent Leave Limited Duty And Medical Hold Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter recovery-order, limited-duty, and medical-hold continuity decisions.
- Confirm affected servicemembers, diagnosis or injury profile, profile or leave dates, line-of-duty or medical-hold posture, and decision deadlines before recommending action.
- Keep outputs unclassified by default and minimize PHI or PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using convalescent-leave status, limited-duty profile constraints, medical-hold orders, pay or benefit exposure, and unit mission pressure.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in recovery safety, lawful availability, family stability, and administrative burden.
3. Identify branch triggers for order expiration, profile mismatch, line-of-duty evidence gap, medhold denial, and forced return-to-duty pressure.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and recovery-order risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: recovery-orders board, limited-duty ladder, and medical-hold continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-MEDHOLD-336`, `tool_suite_id=ts-joint-convalescent-leave-limited-duty-medical-hold-continuity-v1`, and `protocol_stack_id=ps-joint-convalescent-leave-limited-duty-medical-hold-continuity-stack-v1`.
- Alternate: select a mission-adjacent rehabilitation, medical-board, or personnel-management suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual recovery-order roster with advisory-only sequencing until medical evidence, order authority, and pay-impact posture are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-CONVALESCENT-LEAVE-MEDHOLD-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: medical-hold case board, profile or orders tracker, line-of-duty and pay-impact ledger, and recovery-care coordination queue.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NIEM`, signed medical orders, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If order authority, line-of-duty evidence, or medical-hold legitimacy is uncertain, downgrade to advisory-only and request human medical or personnel review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unlawful work expectations, unsupported order assumptions, pay or benefit interruption risk, and premature return-to-duty pressure before recommending action.
- Do not fabricate orders, line-of-duty findings, profile constraints, or medhold approval status.
