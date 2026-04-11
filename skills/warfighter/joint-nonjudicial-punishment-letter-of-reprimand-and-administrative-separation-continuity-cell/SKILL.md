---
name: joint-nonjudicial-punishment-letter-of-reprimand-and-administrative-separation-continuity-cell
description: Preserve due-process timing, rebuttal sequencing, counsel routing, and administrative-separation continuity when NJP, letters of reprimand, or adverse paperwork threaten U.S. warfighter readiness, deployability, or retention.
---

# Joint Nonjudicial Punishment Letter Of Reprimand And Administrative Separation Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter adverse-action, rebuttal, and administrative-separation continuity decisions.
- Confirm action type, suspense dates, affected personnel, counsel posture, command timeline, and decision authority before recommending action.
- Keep outputs unclassified by default and minimize PII or privileged legal detail unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using action type, notice date, rebuttal windows, evidence posture, and mission or family impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in due-process protection, deployability, career risk, and command burden.
3. Identify branch triggers for missed suspense, unavailable counsel, new exculpatory evidence, board escalation, and retaliatory command climate.
4. Bind each critical recommendation to concrete external tools, protocol stacks, packet templates, and authority gates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and adverse-action risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: adverse-action continuity board, rebuttal deadline ladder, and administrative-separation support packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-NJPSEP-349`, `tool_suite_id=ts-joint-nonjudicial-punishment-letter-of-reprimand-administrative-separation-continuity-v1`, and `protocol_stack_id=ps-joint-nonjudicial-punishment-letter-of-reprimand-administrative-separation-continuity-stack-v1`.
- Alternate: select a mission-adjacent personnel-records, promotion-board, or legal-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual adverse-action roster with advisory-only sequencing until notice legitimacy, suspense dates, and counsel routing are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-NJP-LOR-ADMINSEP-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: adverse-action case board, rebuttal deadline tracker, counsel coordination queue, and separation-board impact ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed personnel or legal notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Use the `Administrative Justice and Redress` playbook when rebuttal deadlines, counsel access, board timing, or evidence preservation determine readiness impact.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If notice validity, legal authority, or evidence provenance is uncertain, downgrade to advisory-only and request human legal review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and suspense clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag missed deadlines, coerced waivers, unsupported rebuttal claims, and retaliatory command behaviors before recommending action.
- Do not fabricate legal advice, punishment outcomes, rebuttal success, or separation results.
