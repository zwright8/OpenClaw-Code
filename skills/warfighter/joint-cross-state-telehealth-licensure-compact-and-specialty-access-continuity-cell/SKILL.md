---
name: joint-cross-state-telehealth-licensure-compact-and-specialty-access-continuity-cell
description: Preserve cross-state telehealth, licensure-compact, and specialty-care continuity when relocation, rural access, or disrupted networks begin to block care for U.S. warfighters or their families.
---

# Joint Cross State Telehealth Licensure Compact And Specialty Access Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter telehealth-access and specialty-care continuity decisions.
- Confirm patient population, care urgency, state locations, referral posture, licensure-compact requirements, and approval authority before recommending action.
- Keep outputs unclassified by default and minimize protected health information unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using care urgency, state or territory boundaries, licensure posture, telehealth capability, and specialty-network friction.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in clinical continuity, legal sufficiency, travel burden, and privacy.
3. Identify branch triggers for compact inapplicability, expired referrals, remote-diagnostic limits, and pharmacy or imaging handoff failures.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and telehealth-access risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: telehealth access board, licensure-compact decision ladder, and specialty-access continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-TELEHEALTH-392`, `tool_suite_id=ts-joint-cross-state-telehealth-licensure-compact-specialty-access-continuity-v1`, and `protocol_stack_id=ps-joint-cross-state-telehealth-licensure-compact-specialty-access-continuity-stack-v1`.
- Alternate: select a mission-adjacent TRICARE, EFMP, or transitional-healthcare suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual clinical-priority roster with advisory-only remote-care sequencing until referral status, licensure posture, and patient identity are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-TELEHEALTH-LICENSURE-SPECIALTY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: telehealth eligibility board, licensure-compact map, specialty-care referral queue, and remote-care escalation ledger.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NIEM`, signed referral notices, `API/JSON`, `S/MIME`, `OIDC/SAML`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If patient identity, licensure validity, or clinical authority is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and referral-legitimacy integrity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Protect medical privacy, licensure boundaries, referral legitimacy, and equitable access before recommending action.
- Do not fabricate telehealth eligibility, licensure-compact coverage, appointment availability, or clinical approval.
