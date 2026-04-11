---
name: reserve-component-retirement-points-sanctuary-and-nonregular-retirement-continuity-cell
description: Preserve Reserve and Guard retirement-point credit, sanctuary calculations, 20-year-letter timing, and non-regular retirement continuity when order gaps, bad years, or record drift threaten lawful service and long-horizon household stability.
---

# Reserve Component Retirement Points Sanctuary And Non-Regular Retirement Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. Reserve and Guard retirement-credit, sanctuary, and non-regular retirement continuity decisions.
- Confirm affected personnel, retirement-year-ending dates, point-credit posture, sanctuary exposure, pending orders, and decision authority before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using retirement-point gaps, sanctuary thresholds, order-credit risk, 20-year-letter exposure, and household stability impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in lawful credit recovery, retention value, administrative burden, and timing.
3. Identify branch triggers for bad-year risk, missing order credit, sanctuary miscalculation, delayed statement generation, and records mismatch.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and personnel decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and retirement-credit risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: retirement-credit reconciliation board, sanctuary-risk ladder, and non-regular retirement continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-RESRET-355`, `tool_suite_id=ts-reserve-component-retirement-points-sanctuary-nonregular-retirement-continuity-v1`, and `protocol_stack_id=ps-reserve-component-retirement-points-sanctuary-nonregular-retirement-continuity-stack-v1`.
- Alternate: select a mission-adjacent retirement-counseling, personnel-records, or mobilization suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual retirement-credit roster with advisory-only sequencing until points, orders, and sanctuary calculations are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-RESERVE-RETIREMENT-SANCTUARY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: reserve retirement-points ledger, order-credit tracker, sanctuary-threshold board, and non-regular retirement eligibility queue.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed retirement notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If point-credit evidence, sanctuary posture, or retirement authority is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and retirement-evidence clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported point-credit assumptions, sanctuary math errors, missing order evidence, and unfounded retirement-eligibility claims before recommending action.
- Do not fabricate retirement points, sanctuary status, 20-year-letter issuance, or retired-pay outcomes.
