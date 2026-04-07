---
name: joint-emergency-leave-american-red-cross-message-and-command-approval-cell
description: Preserve emergency leave decisions by validating American Red Cross messages, compassionate-travel triggers, and command approvals during crisis or disconnected operations. Use when family emergencies affect warfighter readiness and time-sensitive leave authority.
---

# Joint Emergency Leave American Red Cross Message And Command Approval Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter emergency-leave actions where family emergencies, message provenance, and command approval timing affect force readiness and household stability.
- Confirm affected servicemember, emergency category, American Red Cross or equivalent verification posture, leave authority, and travel timeline before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using verified emergency facts, message provenance, leave-approval posture, travel availability, and replacement or watchbill impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in family support, mission continuity, fraud risk, and timeline.
3. Identify branch triggers for unverifiable messages, denied or delayed leave authority, travel disruption, and command-directed compassionate reassignment.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and emergency-leave risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: emergency-leave validation board, compassionate-travel approval ladder, and message-provenance packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-ARCMSG-295`, `tool_suite_id=ts-joint-emergency-leave-american-red-cross-message-command-approval-v1`, and `protocol_stack_id=ps-joint-emergency-leave-american-red-cross-message-command-approval-stack-v1`.
- Alternate: select a mission-adjacent family-readiness, casualty-assistance, or personnel-record suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual leave case board with advisory-only routing until emergency facts, command authority, and travel feasibility are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-EMERGENCY-LEAVE-ARC-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: emergency leave case board, American Red Cross message validation queue, command approval tracker, and travel-booking or voucher ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed leave notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If message provenance, emergency facts, or leave authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag forged-message risk, family distress, backfill gaps, and unequal leave treatment before recommending action.
- Do not fabricate emergency verification, leave approval, travel availability, or compassionate reassignment authority.
