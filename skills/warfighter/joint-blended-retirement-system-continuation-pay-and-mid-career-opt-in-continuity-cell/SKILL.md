---
name: joint-blended-retirement-system-continuation-pay-and-mid-career-opt-in-continuity-cell
description: Preserve Blended Retirement System opt-in timing, continuation-pay elections, obligated-service evidence, and mid-career compensation legitimacy when deadline drift or record gaps threaten U.S. warfighter retention and household planning.
---

# Joint Blended Retirement System Continuation Pay And Mid-Career Opt-In Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter mid-career retirement-choice and continuation-pay continuity decisions.
- Confirm affected population, DIEMS or retirement-system posture, years-of-service window, continuation-pay timing, service-obligation requirements, and approval authority before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using retirement-system status, continuation-pay or opt-in deadline, obligated-service evidence, command timeline, and household-planning impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in retention value, fiscal legitimacy, service commitment, and administrative burden.
3. Identify branch triggers for missed opt-in window, continuation-pay delay, incorrect multiplier or service-obligation mismatch, and record-correction dependency.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and BRS-continuity risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: BRS eligibility board, continuation-pay decision ladder, and mid-career retirement continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-BRSCP-372`, `tool_suite_id=ts-joint-blended-retirement-continuation-pay-mid-career-opt-in-continuity-v1`, and `protocol_stack_id=ps-joint-blended-retirement-continuation-pay-mid-career-opt-in-continuity-stack-v1`.
- Alternate: select a mission-adjacent retirement, compensation, or personnel-records suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual BRS-deadline roster with advisory-only sequencing until retirement-system status, obligation evidence, and human finance review are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-BRS-CONTPAY-OPTIN-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: retirement-system eligibility board, continuation-pay election queue, obligated-service evidence ledger, and mid-career counseling tracker.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed retirement notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If retirement-system status, obligated-service evidence, or continuation-pay authority is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and BRS-evidence clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported continuation-pay promises, missed opt-in deadlines, bad obligation math, and household financial shock before recommending action.
- Do not fabricate BRS elections, continuation-pay approval, service-obligation completion, or retirement-system status.
