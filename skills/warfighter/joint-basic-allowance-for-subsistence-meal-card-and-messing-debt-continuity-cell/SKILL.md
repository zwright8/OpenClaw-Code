---
name: joint-basic-allowance-for-subsistence-meal-card-and-messing-debt-continuity-cell
description: Preserve Basic Allowance for Subsistence (BAS), meal-card status, and messing-debt correction when coding drift, dining-facility changes, or deployment transitions begin to create food insecurity or pay errors for U.S. warfighters.
---

# Joint Basic Allowance For Subsistence Meal Card And Messing Debt Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter subsistence-entitlement and dining-access continuity decisions.
- Confirm duty status, meal-card posture, BAS eligibility, dining-facility availability, debt posture, and family-support deadlines before recommending action.
- Keep outputs unclassified by default and minimize personally identifiable information unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using BAS status, meal-card coding, dining-facility access, messing debt exposure, and household food-security risk.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in lawful subsistence support, pay accuracy, speed, and administrative burden.
3. Identify branch triggers for wrong meal-card coding, galley or DFAC outage, BAS stop or restart delay, debt collection onset, and emergency food support need.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and subsistence-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: subsistence-entitlement board, meal-card correction ladder, and messing-debt mitigation packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-BASMESS-399`, `tool_suite_id=ts-joint-basic-allowance-for-subsistence-meal-card-messing-debt-continuity-v1`, and `protocol_stack_id=ps-joint-basic-allowance-for-subsistence-meal-card-messing-debt-continuity-stack-v1`.
- Alternate: select a mission-adjacent compensation, commissary-support, or family-readiness suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual food-and-pay risk roster with advisory-only sequencing until entitlement evidence, dining status, and debt posture are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-BAS-MEALCARD-MESS-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: BAS entitlement board, meal-card status tracker, messing-charge ledger, and dining-facility or emergency-food support queue.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed pay or messing notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If duty status, BAS eligibility, or debt evidence is uncertain, downgrade to advisory-only and request human finance or command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and food-access evidence clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported pay promises, food-access blind spots, duplicate-charge risk, and debt-collection acceleration before recommending action.
- Do not fabricate BAS eligibility, meal-card status, debt cancellation, or dining-facility availability.
