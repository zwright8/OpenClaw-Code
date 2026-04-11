---
name: reserve-component-idt-rst-at-and-good-year-continuity-cell
description: Preserve Reserve and Guard IDT, RST, AT, and good-year legitimacy when attendance evidence, medical or school conflicts, or duty-status drift threaten lawful availability, retirement credit, or commander trust.
---

# Reserve Component IDT RST AT And Good Year Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. Reserve Component and National Guard training-credit, attendance-legitimacy, and good-year continuity decisions.
- Confirm affected members, IDT or RST or AT posture, attendance evidence, conflict type, retirement-credit exposure, and command authority before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using scheduled training events, attendance or certification status, rescheduled-training requests, annual-training orders, and good-year risk.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in readiness, retirement-credit legitimacy, duty availability, and staff burden.
3. Identify branch triggers for unsigned attendance, rejected RST, missing AT orders, school or employer conflict, medical restriction, and bad-year exposure.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and training-credit risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: training-credit integrity board, RST or AT decision ladder, and good-year preservation packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-IDTRST-374`, `tool_suite_id=ts-reserve-component-idt-rst-at-good-year-continuity-v1`, and `protocol_stack_id=ps-reserve-component-idt-rst-at-good-year-continuity-stack-v1`.
- Alternate: select a mission-adjacent drill-pay, retirement-points, or mobilization suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual training-credit roster with advisory-only sequencing until attendance evidence, order status, and human command review are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-RESERVE-IDT-RST-AT-GOODYEAR-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: attendance certification board, RST request tracker, AT orders queue, and retirement-credit or good-year ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed personnel notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If attendance evidence, order status, retirement-credit math, or RST authority is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and training-evidence clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported good-year promises, unsigned attendance, unofficial RST deals, and bad-year exposure before recommending action.
- Do not fabricate attendance certification, RST approval, AT orders, or retirement-credit outcomes.
