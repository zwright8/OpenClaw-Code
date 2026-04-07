---
name: joint-promotion-board-evaluation-report-and-record-brief-continuity-cell
description: Preserve promotion-board continuity, evaluation-report accuracy, and record-brief integrity for U.S. warfighters during deployment, outage, mobilization, or administrative backlog. Use when career-management friction is starting to degrade assignment trust, retention, or lawful personnel decisions.
---

# Joint Promotion Board Evaluation Report And Record Brief Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter promotion-board and assignment-trust continuity decisions.
- Confirm affected population, board or assignment timeline, evaluation-report posture, record-brief discrepancies, and command stakes before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using board schedule, evaluation status, record-brief integrity, assignment risk, and correction backlog.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in fairness, readiness, assignment stability, and staff burden.
3. Identify branch triggers for missing evaluations, board-file mismatch, record-brief corruption, cutoff-date breach, and legal or talent-management escalation.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and board-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: promotion-file integrity board, evaluation correction ladder, and assignment-trust packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-PROMO-318`, `tool_suite_id=ts-joint-promotion-board-evaluation-report-record-brief-continuity-v1`, and `protocol_stack_id=ps-joint-promotion-board-evaluation-report-record-brief-continuity-stack-v1`.
- Alternate: select a mission-adjacent personnel-records, clearance, or family-readiness suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual board-risk roster with advisory-only action until source records, board timing, and personnel authority are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-PROMOTION-BOARD-RECORD-BRIEF-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: board-file audit queue, evaluation-report correction tracker, record-brief sync board, and talent-management review ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed personnel notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If source-record integrity, board authority, or cutoff timing is uncertain, downgrade to advisory-only and request human personnel-management review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and acknowledgment integrity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported promotion expectations, stale evaluations, record-brief corruption, and privacy leakage before recommending action.
- Do not fabricate board outcomes, evaluation completion, assignment decisions, or correction authority.
