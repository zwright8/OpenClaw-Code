---
name: joint-awards-decorations-valor-device-and-board-record-protection-cell
description: Preserve awards, decorations, valor-device documentation, and board-record integrity when citation backlog, evidence loss, or record mismatch threatens recognition, promotion trust, or historical accountability for U.S. warfighters.
---

# Joint Awards Decorations Valor Device And Board Record Protection Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter awards, decorations, valor-device, and board-record protection decisions.
- Confirm affected population, award type, citation or witness posture, board or promotion timeline, and approval authority before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using award status, evidence integrity, board-file exposure, citation backlog, and assignment or morale stakes.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in recognition accuracy, speed, privacy, and record trust.
3. Identify branch triggers for missing witness statements, absent orders, valor-device validation gaps, board-cutoff risk, and record-sync failure.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and recognition-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: awards integrity board, citation evidence ladder, and board-record protection packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-AWARDS-347`, `tool_suite_id=ts-joint-awards-decorations-valor-board-record-protection-v1`, and `protocol_stack_id=ps-joint-awards-decorations-valor-board-record-protection-stack-v1`.
- Alternate: select a mission-adjacent promotion-board, personnel-records, or public-affairs suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual recognition-priority roster with advisory-only sequencing until source evidence, approval chain, and board timing are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-AWARDS-DECORATIONS-BOARD-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: awards recommendation board, citation evidence ledger, approval tracker, and board-file sync queue.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed personnel citations, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If source evidence, citation authority, or board-routing legitimacy is uncertain, downgrade to advisory-only and request human personnel review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and acknowledgment integrity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported recognition claims, witness-evidence loss, board-file mismatch, and privacy leakage before recommending action.
- Do not fabricate citations, valor evidence, approval signatures, or award outcomes.
