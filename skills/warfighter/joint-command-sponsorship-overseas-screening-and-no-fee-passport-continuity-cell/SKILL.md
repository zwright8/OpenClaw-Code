---
name: joint-command-sponsorship-overseas-screening-and-no-fee-passport-continuity-cell
description: Preserve command sponsorship, overseas screening, no-fee passports, and dependent movement eligibility when PCS, assignment, or emergency relocation friction could strand U.S. warfighters or families and degrade mission readiness.
---

# Joint Command Sponsorship Overseas Screening And No Fee Passport Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter command-sponsorship, overseas-screening, and family-movement continuity decisions.
- Confirm assignment or PCS posture, sponsor status, overseas medical or EFMP screening requirements, passport or visa deadlines, and decision authority before recommending action.
- Keep outputs unclassified by default and minimize PII or medical detail unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using orders posture, command-sponsorship status, overseas screening backlog, travel-document risk, and movement deadline.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in family movement speed, medical legitimacy, assignment stability, and administrative burden.
3. Identify branch triggers for missing screening evidence, no-fee passport delay, dependent travel ineligibility, EFMP mismatch, and host-nation or safehaven document friction.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and family-movement risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: command-sponsorship recovery board, overseas-screening ladder, and no-fee passport movement packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-CMDSP-323`, `tool_suite_id=ts-joint-command-sponsorship-overseas-screening-no-fee-passport-continuity-v1`, and `protocol_stack_id=ps-joint-command-sponsorship-overseas-screening-no-fee-passport-continuity-stack-v1`.
- Alternate: select a mission-adjacent passport, consular, DEERS, or family-readiness suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual family-movement risk roster with advisory-only sequencing until sponsor status, screening evidence, and travel-document posture are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-CMD-SPONSOR-OVERSEAS-SCREEN-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: command-sponsorship case board, overseas screening tracker, no-fee passport or visa queue, and dependent movement ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `ICAO Doc 9303`, signed sponsor notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If command sponsorship, screening evidence, or document authority is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and movement-eligibility clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported family-movement promises, medical-screening shortcuts, no-fee passport assumptions, and host-nation acceptance risk before recommending action.
- Do not fabricate command sponsorship, medical clearance, passport issuance, or travel acceptance.
