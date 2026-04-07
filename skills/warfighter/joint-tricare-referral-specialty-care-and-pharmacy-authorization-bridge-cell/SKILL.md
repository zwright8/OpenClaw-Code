---
name: joint-tricare-referral-specialty-care-and-pharmacy-authorization-bridge-cell
description: Preserve access to specialty care, referral authorizations, and pharmacy exceptions for warfighters and dependents during outages, PCS, or evacuation. Use when administrative breaks are beginning to create clinical risk or household instability.
---

# Joint Tricare Referral Specialty Care And Pharmacy Authorization Bridge Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter healthcare-access decisions where referrals, specialty appointments, pharmacy prior authorizations, or network transitions affect clinical continuity.
- Confirm affected patients, care urgency, referral or authorization status, network constraints, and command or clinical decision deadlines before recommending action.
- Keep outputs unclassified by default and minimize protected health information unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using referral backlog, specialty-care demand, pharmacy authorization posture, travel or PCS constraints, and patient-risk indicators.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in clinical continuity, travel burden, privacy, and administrative risk.
3. Identify branch triggers for expired referrals, specialty-network loss, cold-chain medication disruption, and urgent-care or emergency override conditions.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and healthcare-access risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: referral-authorization board, specialty-care bridge ladder, and pharmacy exception packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-TRICARE-299`, `tool_suite_id=ts-joint-tricare-referral-specialty-care-pharmacy-authorization-bridge-v1`, and `protocol_stack_id=ps-joint-tricare-referral-specialty-care-pharmacy-authorization-bridge-stack-v1`.
- Alternate: select a mission-adjacent medical-regulation, base-pharmacy, or family-readiness suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual clinical-priority roster with advisory-only referral and pharmacy sequencing until authorization status and patient urgency are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-TRICARE-REFERRAL-SPECIALTY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: referral-authorization queue, specialty-care network tracker, pharmacy prior-authorization board, and patient travel coordination ledger.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NIEM`, signed referral notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If clinical urgency, authorization status, or beneficiary identity is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Protect medical privacy, equitable access, referral legitimacy, and pharmacy safety before recommending action.
- Do not fabricate authorizations, appointment availability, medication coverage, or clinical approval.
