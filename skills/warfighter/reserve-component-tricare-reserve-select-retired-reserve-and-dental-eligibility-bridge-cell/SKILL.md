---
name: reserve-component-tricare-reserve-select-retired-reserve-and-dental-eligibility-bridge-cell
description: Preserve TRICARE Reserve Select, TRICARE Retired Reserve, and Reserve dental eligibility continuity when drill status, activation, demobilization, or gray-area retirement changes threaten care access for Reserve and Guard households.
---

# Reserve Component TRICARE Reserve Select Retired Reserve And Dental Eligibility Bridge Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. Reserve and Guard health-coverage continuity decisions.
- Confirm affected personnel or dependents, current coverage posture, activation or demobilization timeline, premium status, and decision authority before recommending action.
- Keep outputs unclassified by default and minimize protected health or dependent detail unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using coverage windows, premium-payment posture, family-member eligibility, pharmacy or dental dependency, and household readiness impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in care continuity, cost, administrative burden, and timing.
3. Identify branch triggers for enrollment lapse, premium delinquency, dependent mismatch, pharmacy interruption, and demobilization-status drift.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander, medical, and personnel decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and coverage-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: reserve health-coverage continuity board, premium-risk ladder, and family-eligibility bridge packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-TRSRES-356`, `tool_suite_id=ts-reserve-component-tricare-reserve-select-retired-reserve-dental-eligibility-bridge-v1`, and `protocol_stack_id=ps-reserve-component-tricare-reserve-select-retired-reserve-dental-eligibility-bridge-stack-v1`.
- Alternate: select a mission-adjacent family-readiness, transitional-healthcare, or personnel-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual coverage-priority roster with advisory-only sequencing until eligibility, premium posture, and human benefit authority are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-TRS-TRR-DENTAL-ELIGIBILITY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: reserve health-plan enrollment tracker, premium-payment ledger, family-coverage crosswalk, and dental or pharmacy eligibility queue.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NIEM`, signed coverage notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If eligibility evidence, premium status, or coverage authority is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and coverage-bridge clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported enrollment claims, dependent mismatches, premium assumptions, and unfounded care-access promises before recommending action.
- Do not fabricate TRS, TRR, dental eligibility, premium resolution, or prior-authorization outcomes.
