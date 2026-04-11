---
name: joint-discharge-review-board-bcmr-character-of-service-and-va-eligibility-bridge-cell
description: Preserve discharge-redress evidence, BCMR or DRB docket continuity, and VA-eligibility bridge actions when characterization or separation-record defects threaten U.S. warfighter recovery, stability, or benefits access.
---

# Joint Discharge Review Board BCMR Character Of Service And VA Eligibility Bridge Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter discharge-redress, records-correction, and VA-eligibility bridge decisions.
- Confirm discharge type, docket posture, affected personnel, evidence status, benefit timelines, and decision authority before recommending action.
- Keep outputs unclassified by default and minimize PII or protected health detail unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using characterization issues, DRB or BCMR posture, DD214 or medical-record gaps, VA eligibility risk, and household impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in evidence quality, time to relief, benefit continuity, and administrative burden.
3. Identify branch triggers for missing records, docket delay, stale medical evidence, jurisdiction mismatch, and urgent care or benefit deadlines.
4. Bind each critical recommendation to concrete external tools, protocol stacks, packet templates, and authority gates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and discharge-redress risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: discharge-redress board, records-correction ladder, and VA-eligibility bridge packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-DRBBCMR-353`, `tool_suite_id=ts-joint-discharge-review-board-bcmr-character-of-service-va-eligibility-bridge-v1`, and `protocol_stack_id=ps-joint-discharge-review-board-bcmr-character-of-service-va-eligibility-bridge-stack-v1`.
- Alternate: select a mission-adjacent personnel-records, medical-board, or veterans-benefits suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual discharge-redress roster with advisory-only sequencing until docket posture, record integrity, and benefits impact are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-DRB-BCMR-CHARACTER-VA-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: DRB or BCMR docket tracker, character-of-service evidence ledger, DD214 or medical-record reconstruction queue, and VA eligibility crosswalk board.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `HL7/FHIR`, signed records notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Use the `Administrative Justice and Redress` playbook when discharge evidence, record repair, or benefits-routing timelines determine recovery risk.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If docket jurisdiction, source records, or benefit authority is uncertain, downgrade to advisory-only and request human legal or benefits review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and benefit-bridge clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported characterization-change claims, missing source evidence, stale medical assumptions, and unverified benefit promises before recommending action.
- Do not fabricate board outcomes, VA eligibility decisions, legal advice, or characterization relief.
