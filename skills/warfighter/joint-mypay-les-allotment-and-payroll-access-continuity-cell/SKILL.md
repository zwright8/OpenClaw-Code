---
name: joint-mypay-les-allotment-and-payroll-access-continuity-cell
description: Preserve MyPay access, LES accuracy, allotment continuity, and payroll self-service legitimacy when account lockouts, direct-deposit drift, or pay-record errors start to degrade U.S. warfighter readiness and household stability.
---

# Joint MyPay LES Allotment And Payroll Access Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter payroll-access, LES-legitimacy, and allotment-continuity decisions.
- Confirm affected population, pay-cycle timeline, account-access posture, LES discrepancy type, allotment dependencies, and approval authority before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using access failure, LES discrepancy, direct-deposit or allotment posture, upcoming pay-cycle deadlines, and readiness or hardship impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in fiscal legitimacy, correction speed, privacy burden, and household risk.
3. Identify branch triggers for account lockout, missing or wrong LES entries, broken allotments, direct-deposit drift, and emergency cash-gap exposure.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and payroll-access risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: payroll-access recovery board, LES-correction ladder, and allotment-continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-MYPAY-366`, `tool_suite_id=ts-joint-mypay-les-allotment-payroll-access-continuity-v1`, and `protocol_stack_id=ps-joint-mypay-les-allotment-payroll-access-continuity-stack-v1`.
- Alternate: select a mission-adjacent compensation, finance, or human-readiness suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual pay-risk roster with advisory-only sequencing until account legitimacy, pay status, and human finance review are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-MYPAY-LES-ALLOTMENT-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: payroll self-service access board, LES discrepancy tracker, direct-deposit or allotment ledger, and pay-cycle deadline queue.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed pay notices, `API/JSON`, `S/MIME`, `OIDC/SAML`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If pay authority, account ownership, or correction evidence is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and payroll-evidence clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported pay promises, exposed credentials, wrong-recipient allotment risk, and hardship escalation before recommending action.
- Do not fabricate account recovery, LES corrections, allotment execution, or payroll completion.
