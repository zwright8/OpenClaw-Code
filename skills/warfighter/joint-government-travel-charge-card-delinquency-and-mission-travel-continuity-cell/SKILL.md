---
name: joint-government-travel-charge-card-delinquency-and-mission-travel-continuity-cell
description: Preserve mission-travel legitimacy when government travel charge card delinquency, suspended accounts, or reimbursement lag begin to block training, PCS, TDY, or deployment support. Use when official travel friction starts to degrade warfighter availability or household stability.
---

# Joint Government Travel Charge Card Delinquency And Mission Travel Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter government-travel, travel-card, and reimbursement continuity decisions.
- Confirm affected travelers, orders posture, delinquency status, reimbursement age, mission deadline, and approval authority before recommending action.
- Keep outputs unclassified by default and minimize PII or financial account details unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using mission-travel demand, card delinquency or suspension status, voucher age, hardship impact, and command deadlines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in movement speed, fiscal legitimacy, fraud exposure, and staff burden.
3. Identify branch triggers for suspended cards, rejected vouchers, contested delinquency, mission slip, and emergency travel exception use.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and travel-friction trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: mission-travel continuity board, delinquency mitigation ladder, and official-travel exception packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-GTCC-320`, `tool_suite_id=ts-joint-government-travel-charge-card-mission-travel-continuity-v1`, and `protocol_stack_id=ps-joint-government-travel-charge-card-mission-travel-continuity-stack-v1`.
- Alternate: select a mission-adjacent PCS, compensation, or mobilization suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual travel-priority roster with advisory-only sequencing until orders, delinquency posture, and reimbursement evidence are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-GTCC-MISSION-TRAVEL-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: travel-card delinquency board, mission-travel authorization queue, reimbursement aging ledger, and card-reinstatement tracker.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed travel notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If orders, delinquency legitimacy, or reimbursement authority is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported reimbursement promises, fraudulent travel indicators, and mission-travel delays before recommending action.
- Do not fabricate card reinstatement, voucher approval, travel authority, or reimbursement completion.
