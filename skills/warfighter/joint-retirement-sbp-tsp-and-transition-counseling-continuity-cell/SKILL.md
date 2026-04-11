---
name: joint-retirement-sbp-tsp-and-transition-counseling-continuity-cell
description: Preserve retirement eligibility, SBP elections, TSP decisions, and transition counseling continuity when separation or medical-retirement timing threatens financial security or force-management certainty. Use when retirement-process friction begins to degrade readiness, retention, or lawful transition.
---

# Joint Retirement SBP TSP And Transition Counseling Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter retirement, survivor-benefit, and transition-counseling continuity decisions.
- Confirm affected population, retirement or separation timeline, election deadlines, counseling availability, and family-impact constraints before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using retirement eligibility, counseling backlog, SBP or TSP decision windows, medical-retirement pressure, and command visibility needs.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in financial stability, transition speed, privacy protection, and staff burden.
3. Identify branch triggers for missed counseling, SBP election gap, TSP access failure, medical-retirement acceleration, and DD214 or record mismatch.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and retirement-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: retirement action board, SBP or TSP decision ladder, and transition-counseling continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-RETIRE-312`, `tool_suite_id=ts-joint-retirement-sbp-tsp-transition-counseling-continuity-v1`, and `protocol_stack_id=ps-joint-retirement-sbp-tsp-transition-counseling-continuity-stack-v1`.
- Alternate: select a mission-adjacent personnel-records, compensation, or rehabilitation-transition suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual transition-priority roster with advisory-only sequencing until election deadlines, eligibility, and counseling completion are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-RETIREMENT-SBP-TSP-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: retirement packet board, SBP election tracker, TSP counseling queue, and transition-checklist status ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed retirement notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If retirement eligibility, election authority, or counseling completion evidence is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag missed election deadlines, unsupported retirement promises, counseling shortfalls, and family-transition fragility before recommending action.
- Do not fabricate retirement eligibility, SBP election status, TSP outcomes, or counseling completion.

## Domain Toolchain Override (2026-04-11, Expansion Wave LXXXVIII Addendum)

- Add `toolchain_id=TC-RESRET-355`, `tool_suite_id=ts-reserve-component-retirement-points-sanctuary-nonregular-retirement-continuity-v1`, and `protocol_stack_id=ps-reserve-component-retirement-points-sanctuary-nonregular-retirement-continuity-stack-v1` when reserve-component retirement counseling depends on accurate points, sanctuary status, or non-regular retirement evidence.
- Add `toolchain_id=TC-TRSRES-356`, `tool_suite_id=ts-reserve-component-tricare-reserve-select-retired-reserve-dental-eligibility-bridge-v1`, and `protocol_stack_id=ps-reserve-component-tricare-reserve-select-retired-reserve-dental-eligibility-bridge-stack-v1` when retirement counseling confidence depends on preserving Reserve health-coverage continuity into retired-reserve status.
- Add `packet_id=DPL-RESERVE-RETIREMENT-SANCTUARY-001` and `packet_id=DPL-TRS-TRR-DENTAL-ELIGIBILITY-001` for branches that materially alter retirement-legitimacy, benefits continuity, or household stability.

## Domain Toolchain Override (2026-04-11, Expansion Wave XCI Addendum)

- Add `toolchain_id=TC-BRSCP-372`, `tool_suite_id=ts-joint-blended-retirement-continuation-pay-mid-career-opt-in-continuity-v1`, and `protocol_stack_id=ps-joint-blended-retirement-continuation-pay-mid-career-opt-in-continuity-stack-v1` when retirement counseling confidence depends on preserving BRS opt-in timing, continuation-pay routing, or obligated-service evidence for mid-career personnel.
- Add `toolchain_id=TC-TSPHL-373`, `tool_suite_id=ts-joint-thrift-savings-plan-loan-hardship-withdrawal-beneficiary-continuity-v1`, and `protocol_stack_id=ps-joint-thrift-savings-plan-loan-hardship-withdrawal-beneficiary-continuity-stack-v1` when TSP loan access, hardship-withdrawal timing, or beneficiary integrity materially changes retirement counseling posture, household resilience, or survivor intent.
- Add `packet_id=DPL-BRS-CONTPAY-OPTIN-001` and `packet_id=DPL-TSP-LOAN-HARDSHIP-BENEFICIARY-001` for branches that materially alter retirement-legitimacy, household liquidity, or transition-confidence.
