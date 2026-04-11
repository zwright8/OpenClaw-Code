---
name: joint-special-pay-bah-cola-and-incentive-continuity-cell
description: Preserve special-pay, BAH, COLA, and incentive-pay legitimacy when location changes, certification lapses, or service-obligation drift begin to degrade retention, mobilization confidence, or household stability. Use when compensation friction starts to sideline otherwise ready warfighters.
---

# Joint Special Pay BAH COLA And Incentive Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter compensation-entitlement, location-pay, and incentive-continuity decisions.
- Confirm affected population, pay category, dependent-location posture, certification status, service-obligation timeline, and approval authority before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using pay discrepancy type, location evidence, certification or obligation status, retention risk, and command timeline.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in fiscal legitimacy, speed, retention confidence, and staff burden.
3. Identify branch triggers for expired certifications, wrong dependent location, suspended special pay, bonus recoupment risk, and mobilization-impact hardship.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and compensation-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: entitlements continuity board, incentive decision ladder, and compensation legitimacy packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-PAYINC-321`, `tool_suite_id=ts-joint-special-pay-bah-cola-incentive-continuity-v1`, and `protocol_stack_id=ps-joint-special-pay-bah-cola-incentive-continuity-stack-v1`.
- Alternate: select a mission-adjacent compensation, retirement, or mobilization suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual pay-risk roster with advisory-only sequencing until service status, dependent location, and incentive eligibility are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-SPECIAL-PAY-BAH-COLA-INCENTIVE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: entitlements discrepancy board, dependent-location verification ledger, special-pay certification queue, and bonus or service-obligation tracker.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed pay notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If service status, dependent-location evidence, or incentive authority is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported pay promises, recoupment risk, wrong-location evidence, and retention-impact assumptions before recommending action.
- Do not fabricate entitlements, bonus eligibility, special-pay certification, or correction approval.

## Domain Toolchain Override (2026-04-11, Expansion Wave XC Addendum)

- Add `toolchain_id=TC-MYPAY-366`, `tool_suite_id=ts-joint-mypay-les-allotment-payroll-access-continuity-v1`, and `protocol_stack_id=ps-joint-mypay-les-allotment-payroll-access-continuity-stack-v1` when compensation continuity depends on trusted payroll access, LES correctness, or allotment integrity.
- Add `toolchain_id=TC-REENLIST-367`, `tool_suite_id=ts-joint-reenlistment-selective-retention-bonus-career-field-reclassification-continuity-v1`, and `protocol_stack_id=ps-joint-reenlistment-selective-retention-bonus-career-field-reclassification-continuity-stack-v1` when bonus timing, retention incentives, or reclassification-driven obligation changes materially alter incentive legitimacy.
- Add `toolchain_id=TC-BARRDORM-368`, `tool_suite_id=ts-joint-barracks-dorm-work-order-bah-exception-emergency-relocation-continuity-v1`, and `protocol_stack_id=ps-joint-barracks-dorm-work-order-bah-exception-emergency-relocation-continuity-stack-v1` when BAH-exception routing or emergency housing changes location-pay legitimacy or household stability.
- Add `toolchain_id=TC-LEAVE-370`, `tool_suite_id=ts-joint-leave-carryover-special-leave-accrual-sell-back-continuity-v1`, and `protocol_stack_id=ps-joint-leave-carryover-special-leave-accrual-sell-back-continuity-stack-v1` when leave-balance drift, SLA exposure, or sell-back timing materially changes compensation posture or recovery confidence.
- Add `packet_id=DPL-MYPAY-LES-ALLOTMENT-001`, `packet_id=DPL-REENLISTMENT-SRB-RECLASS-001`, `packet_id=DPL-BARRACKS-DORM-BAH-RELOCATE-001`, and `packet_id=DPL-LEAVE-SLA-SELLBACK-001` for branches that materially alter compensation legitimacy, household stability, or retention confidence.

## Domain Toolchain Override (2026-04-11, Expansion Wave XCII Addendum)

- Add `toolchain_id=TC-AVPAY-378`, `tool_suite_id=ts-joint-aviation-incentive-pay-aeronautical-order-gate-month-continuity-v1`, and `protocol_stack_id=ps-joint-aviation-incentive-pay-aeronautical-order-gate-month-continuity-stack-v1` when aviation incentive pay, gate-month evidence, or aeronautical-order validity materially changes special-pay legitimacy for aircrew.
- Add `toolchain_id=TC-HAZPAY-379`, `tool_suite_id=ts-joint-hazardous-duty-jump-dive-special-duty-pay-certification-continuity-v1`, and `protocol_stack_id=ps-joint-hazardous-duty-jump-dive-special-duty-pay-certification-continuity-stack-v1` when hazardous-duty, jump or dive, or special-duty certification materially changes entitlement accuracy or recoupment exposure.
- Add `toolchain_id=TC-LANG-382`, `tool_suite_id=ts-joint-foreign-language-proficiency-bonus-dlpt-linguist-readiness-continuity-v1`, and `protocol_stack_id=ps-joint-foreign-language-proficiency-bonus-dlpt-linguist-readiness-continuity-stack-v1` when FLPB status, DLPT timing, or linguist assignment readiness materially changes incentive legitimacy.
- Add `packet_id=DPL-AVIATION-PAY-AERO-ORDER-001`, `packet_id=DPL-HAZDUTY-JUMP-DIVE-CERT-001`, and `packet_id=DPL-FLPB-DLPT-LINGUIST-001` for branches that materially alter special-pay legitimacy, compensation confidence, or retention posture.
