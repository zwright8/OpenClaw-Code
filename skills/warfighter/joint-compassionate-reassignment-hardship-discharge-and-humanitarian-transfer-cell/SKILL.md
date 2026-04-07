---
name: joint-compassionate-reassignment-hardship-discharge-and-humanitarian-transfer-cell
description: Preserve lawful compassionate reassignment, hardship discharge, and humanitarian transfer decisions for U.S. warfighters when family crisis, medical dependency, or safety breakdown threatens availability or retention.
---

# Joint Compassionate Reassignment Hardship Discharge And Humanitarian Transfer Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter personnel-action decisions where family emergency, caregiving burden, or hardship could justify reassignment, transfer, or discharge routing.
- Confirm affected servicemember, hardship facts, supporting evidence, personnel authority, and command-impact timeline before recommending action.
- Keep outputs unclassified by default and minimize sensitive family, medical, or legal detail unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using hardship indicators, dependency burden, assignment constraints, evidence posture, and unit backfill impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in family stabilization, readiness retention, administrative burden, and lawful personnel action.
3. Identify branch triggers for unverifiable hardship, emergency deterioration, backfill failure, denied personnel action, and command-directed temporary stabilization measures.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and hardship-routing risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: compassionate-action case board, hardship-routing ladder, and humanitarian-transfer continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-COMPASS-331`, `tool_suite_id=ts-joint-compassionate-reassignment-hardship-discharge-humanitarian-transfer-v1`, and `protocol_stack_id=ps-joint-compassionate-reassignment-hardship-discharge-humanitarian-transfer-stack-v1`.
- Alternate: select a mission-adjacent emergency-leave, family-readiness, or mobilization suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual hardship case roster with advisory-only sequencing until evidence posture, personnel authority, and backfill feasibility are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-COMPASSIONATE-REASSIGNMENT-HARDSHIP-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: personnel-action case board, humanitarian reassignment queue, hardship-documentation tracker, and command-impact backfill ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed personnel notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If hardship evidence, personnel authority, or family-safety posture is uncertain, downgrade to advisory-only and request human legal, personnel, or command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and personnel-action clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported reassignment promises, unverified family hardship claims, backfill blind spots, and privacy exposure before recommending action.
- Do not fabricate personnel authority, hardship approval, humanitarian transfer outcome, or discharge disposition.
