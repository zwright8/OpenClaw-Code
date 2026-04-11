---
name: joint-unfavorable-information-file-gomor-and-board-record-rebuttal-continuity-cell
description: Preserve rebuttal timing, adverse-record integrity, and board-file protection when UIF, GOMOR, or derogatory paperwork threatens U.S. warfighter promotion trust, assignment legitimacy, or career continuity.
---

# Joint Unfavorable Information File GOMOR And Board Record Rebuttal Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter adverse-record, rebuttal, and board-file continuity decisions.
- Confirm record type, rebuttal posture, board timeline, affected personnel, evidence status, and decision authority before recommending action.
- Keep outputs unclassified by default and minimize PII or sensitive personnel content unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using derogatory-record type, filing timeline, rebuttal posture, board exposure, and assignment or clearance impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in record accuracy, privacy protection, career risk, and command burden.
3. Identify branch triggers for stale or duplicate records, missed rebuttal suspense, board cutoffs, retaliatory filing patterns, and missing source evidence.
4. Bind each critical recommendation to concrete external tools, protocol stacks, packet templates, and authority gates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and adverse-record risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: adverse-record integrity board, rebuttal evidence ladder, and board-file protection packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-UIFGOMOR-351`, `tool_suite_id=ts-joint-unfavorable-information-file-gomor-board-record-rebuttal-continuity-v1`, and `protocol_stack_id=ps-joint-unfavorable-information-file-gomor-board-record-rebuttal-continuity-stack-v1`.
- Alternate: select a mission-adjacent promotion-board, personnel-records, or legal-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual adverse-record roster with advisory-only sequencing until rebuttal posture, evidence integrity, and board impact are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-UIF-GOMOR-BOARD-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: adverse-info file tracker, GOMOR or UIF rebuttal ledger, board-file sync queue, and evidence-retention worksheet.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed personnel notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Use the `Administrative Justice and Redress` playbook when rebuttal evidence, record cleanup, or board timing determines readiness or promotion risk.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If source records, filing authority, or rebuttal timelines are uncertain, downgrade to advisory-only and request human personnel or legal review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and board-impact clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag stale records, unsupported filing-removal claims, privacy leakage, and retaliatory paperwork patterns before recommending action.
- Do not fabricate rebuttal success, board outcomes, record removals, or assignment decisions.
