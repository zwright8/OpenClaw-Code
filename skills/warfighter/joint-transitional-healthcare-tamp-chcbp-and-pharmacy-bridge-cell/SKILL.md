---
name: joint-transitional-healthcare-tamp-chcbp-and-pharmacy-bridge-cell
description: Preserve Transitional Assistance Management Program (TAMP), Continued Health Care Benefit Program (CHCBP), and pharmacy continuity for U.S. warfighters and families when separation, demobilization, or medical transition threatens treatment access.
---

# Joint Transitional Healthcare TAMP CHCBP And Pharmacy Bridge Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter transitional-healthcare and coverage-continuity decisions.
- Confirm affected servicemembers or households, separation or demobilization timeline, current TRICARE posture, specialty-medication dependency, and decision deadlines before recommending action.
- Keep outputs unclassified by default and minimize PHI or PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using eligibility windows, enrollment posture, refill risk, specialty-care dependency, and household coverage exposure.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in treatment continuity, premium burden, privacy, and staff workload.
3. Identify branch triggers for TAMP expiration, CHCBP premium failure, prior-authorization lapse, pharmacy transfer breakdown, and eligibility mismatch.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and coverage-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: coverage-bridge board, enrollment and authorization ladder, and pharmacy continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-TAMPHC-332`, `tool_suite_id=ts-joint-transitional-healthcare-tamp-chcbp-pharmacy-bridge-v1`, and `protocol_stack_id=ps-joint-transitional-healthcare-tamp-chcbp-pharmacy-bridge-stack-v1`.
- Alternate: select a mission-adjacent medical-readiness, DEERS, or family-readiness suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual coverage-priority roster with advisory-only sequencing until eligibility, premium posture, and refill status are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-TRANSITIONAL-HEALTHCARE-TAMP-CHCBP-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: eligibility and enrollment board, pharmacy prior-authorization queue, care-transition tracker, and premium or demobilization status ledger.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NIEM`, signed coverage notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If eligibility evidence, premium posture, or pharmacy handoff legitimacy is uncertain, downgrade to advisory-only and request human medical or personnel review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported coverage promises, missed premium deadlines, refill interruptions, and privacy exposure before recommending action.
- Do not fabricate eligibility, enrollment, prior authorization, or coverage-extension outcomes.
