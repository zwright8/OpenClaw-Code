---
name: joint-tricare-dental-fedvip-vision-and-orthodontic-benefit-bridge-cell
description: Preserve dental, vision, and orthodontic benefit continuity for warfighters and dependents during PCS, mobilization, demobilization, or recovery handoffs. Use when benefit breaks start creating clinical risk, pain, or household instability.
---

# Joint Tricare Dental FEDVIP Vision And Orthodontic Benefit Bridge Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter dental-vision benefit continuity decisions where coverage changes, prior authorizations, or network shifts affect treatment access.
- Confirm affected beneficiaries, current coverage posture, treatment urgency, network constraints, and decision deadlines before recommending action.
- Keep outputs unclassified by default and minimize PHI or PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using dental or vision care demand, FEDVIP or TRICARE status, orthodontic authorization posture, network access constraints, and household movement timeline.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in clinical continuity, travel burden, privacy, and administrative effort.
3. Identify branch triggers for lapsed enrollment, OCONUS network loss, denied or expired authorizations, and urgent pain or function degradation.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and dental-vision benefit risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: dental-vision benefit board, coverage-bridge ladder, and specialty-benefit continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-FEDVIP-340`, `tool_suite_id=ts-joint-tricare-dental-fedvip-vision-orthodontic-benefit-bridge-v1`, and `protocol_stack_id=ps-joint-tricare-dental-fedvip-vision-orthodontic-benefit-bridge-stack-v1`.
- Alternate: select a mission-adjacent TRICARE referral, DEERS, or family-readiness suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual benefit-priority roster with advisory-only sequencing until eligibility, network posture, and authorization evidence are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-DENTAL-VISION-FEDVIP-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: dental-benefit case board, vision or FEDVIP enrollment queue, orthodontic authorization tracker, and network-access or claims ledger.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NIEM`, signed benefit notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If eligibility, authorization status, or beneficiary identity is uncertain, downgrade to advisory-only and request human benefits review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported benefit promises, uninsured treatment assumptions, network-access gaps, and privacy misuse before recommending action.
- Do not fabricate coverage, appointments, claims outcomes, or authorizations.
