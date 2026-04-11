---
name: joint-high-attrition-schoolhouse-selection-recycle-medhold-and-follow-on-orders-continuity-cell
description: Preserve selection status, recycle or medhold legitimacy, and follow-on orders continuity when American warfighters move through high-attrition schools and special-duty pipelines.
---

# Joint High Attrition Schoolhouse Selection Recycle Medhold And Follow On Orders Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter continuity decisions in high-attrition schools and special-duty qualification pipelines.
- Confirm schoolhouse or selection pipeline, current phase, recycle or medhold posture, follow-on orders dependency, and approval authority before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using selection status, attrition or recycle trigger, medhold or waiver posture, and follow-on orders risk.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in safety, throughput, morale, and talent retention.
3. Identify branch triggers for injury, academic failure, performance washout, medhold extension, waiver denial, and reassignment or follow-on orders slip.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and schoolhouse-continuity risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: selection-risk board, recycle or medhold ladder, and follow-on-orders continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-SCHOOLHOUSE-389`, `tool_suite_id=ts-joint-high-attrition-schoolhouse-selection-recycle-medhold-follow-on-orders-continuity-v1`, and `protocol_stack_id=ps-joint-high-attrition-schoolhouse-selection-recycle-medhold-follow-on-orders-continuity-stack-v1`.
- Alternate: select a mission-adjacent training, aeromedical, or duty-limitation suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual pipeline roster with advisory-only sequencing until selection status, medical posture, and human schoolhouse review are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-SCHOOLHOUSE-RECYCLE-MEDHOLD-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: schoolhouse pipeline board, selection or recycle tracker, medhold or waiver queue, and follow-on orders ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `HR-XML`, signed training notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If selection status, medhold legitimacy, or follow-on orders evidence is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and pipeline-status evidence clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Protect trainee safety, fair processing, medical privacy, and lawful reassignment before recommending action.
- Do not fabricate selection status, recycle decision, medhold authority, or follow-on orders.
