---
name: homeland-dual-status-command-authority-integration-cell
description: Align dual-status command relationships, Title 10 and Title 32 force integration, and command-authority handoffs for domestic operations. Use when U.S. commanders need auditable force-employment options across federal and state chains of command.
---

# Homeland Dual Status Command Authority Integration Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter dual-status-command, Title 10 and Title 32 integration, and domestic command-relationship decisions.
- Confirm supported civil authority, dual-status-command eligibility, force status mix, immediate-response authorities, and command decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using mission assignments, requested effects, force status, command relationships, and approval dependencies.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in legality, speed, unity of command, and mission effectiveness.
3. Identify branch triggers for dual-status-command nomination, force-status transition, immediate-response expiration, and split-C2 fallback.
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

Primary products: authority alignment matrix, command-relationship decision board, and force-status transition tracker.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-dual-status-command-authority-integration-v1` with `protocol_stack_id=ps-homeland-dual-status-command-authority-integration-stack-v1`.
- Alternate: select a mission-adjacent DSCA, mobilization, or civil-authority suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual authority matrix with no force-status change or command-handshake recommendation beyond confirmed written orders.

## Domain Packet Defaults

- Default packet ID: `DPL-DUAL-STATUS-COMMAND-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: mission-assignment tracker, force-status roster, authority-decision matrix, and common-operating-picture board.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `NIMS/ICS`, signed authority memos, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If dual-status authority, force-status legality, or approval-chain integrity is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag Posse Comitatus, immediate-response limits, unsupported force-status assumptions, and broken acknowledgment chains before recommending action.
- Do not fabricate SECDEF approval, governor consent, dual-status designation, or legal review.
