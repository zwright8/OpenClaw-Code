---
name: joint-reenlistment-selective-retention-bonus-and-career-field-reclassification-continuity-cell
description: Preserve reenlistment timing, selective-retention-bonus legitimacy, and career-field or MOS or AFSC reclassification continuity when administrative drift threatens U.S. warfighter retention, billet fill, or lawful service obligations.
---

# Joint Reenlistment Selective Retention Bonus And Career Field Reclassification Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter reenlistment, retention-bonus, and career-reclassification continuity decisions.
- Confirm affected population, service-obligation timeline, reenlistment window, bonus posture, classification or retraining constraints, and approval authority before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using reenlistment deadline, bonus eligibility, classification or retraining posture, record drift, and billet or retention impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in force retention, legal sufficiency, speed, and household predictability.
3. Identify branch triggers for expired windows, SRB eligibility changes, failed reclassification routing, medical or security blockers, and recoupment exposure.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and retention-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: reenlistment decision board, SRB-legitimacy ladder, and career-field continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-REENLIST-367`, `tool_suite_id=ts-joint-reenlistment-selective-retention-bonus-career-field-reclassification-continuity-v1`, and `protocol_stack_id=ps-joint-reenlistment-selective-retention-bonus-career-field-reclassification-continuity-stack-v1`.
- Alternate: select a mission-adjacent compensation, clearance, or human-readiness suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual retention-risk roster with advisory-only sequencing until eligibility, obligation, and human career-counselor review are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-REENLISTMENT-SRB-RECLASS-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: reenlistment eligibility board, SRB or bonus tracker, career-field reclassification queue, and service-obligation ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed personnel notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If retention authority, bonus evidence, or classification approval is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and eligibility-evidence clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported retention promises, bonus-recoupment risk, expired windows, and classification dead ends before recommending action.
- Do not fabricate reenlistment approval, bonus eligibility, retraining seats, or service-obligation outcomes.
