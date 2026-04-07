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
