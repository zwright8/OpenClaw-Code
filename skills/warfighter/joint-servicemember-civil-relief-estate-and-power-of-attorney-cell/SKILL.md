---
name: joint-servicemember-civil-relief-estate-and-power-of-attorney-cell
description: Protect servicemember civil-relief eligibility, estate readiness, and power-of-attorney continuity during deployment, mobilization, casualty risk, or prolonged disruption. Use when commanders or staff need auditable legal-support options that preserve readiness and family stability.
---

# Joint Servicemember Civil Relief Estate And Power Of Attorney Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter civil-relief, estate, and emergency legal-readiness decisions.
- Confirm deployment or mobilization status, time-sensitive legal actions, family or creditor pressure, document validity windows, and legal-assistance availability before recommending action.
- Keep outputs unclassified by default and minimize personally identifiable information unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using duty status, legal deadlines, family vulnerabilities, creditor or court actions, and command decision timelines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in readiness protection, legal sufficiency, privacy exposure, and staff burden.
3. Identify branch triggers for SCRA invocation, estate-document refresh, emergency POA issuance, guardianship escalation, and casualty-contingency activation.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and legal-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: civil-relief shield matrix, estate or POA status board, and urgent legal-action tracker.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-servicemember-civil-relief-estate-poa-v1` with `protocol_stack_id=ps-joint-servicemember-civil-relief-estate-poa-stack-v1`.
- Alternate: select a mission-adjacent reserve-readiness, casualty-assistance, or family-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual legal triage roster with no document execution recommendation beyond confirmed human legal review.

## Domain Packet Defaults

- Default packet ID: `DPL-SCRA-ESTATE-POA-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: legal-assistance case board, SCRA deadline monitor, estate-document tracker, and family-contact escalation ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed legal notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If attorney authority, state-law applicability, or document authenticity is uncertain, downgrade to advisory-only and request human legal review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and document-approval integrity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag expiring POAs, missing wills, creditor or landlord action, guardianship gaps, and unsupported legal assumptions before recommending action.
- Do not fabricate attorney advice, court relief, estate documents, or notarization.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXVI Addendum)

- Add `toolchain_id=TC-SCRA-302`, `tool_suite_id=ts-joint-servicemembers-civil-relief-act-foreclosure-lease-eviction-rate-cap-enforcement-v1`, and `protocol_stack_id=ps-joint-servicemembers-civil-relief-act-foreclosure-lease-eviction-rate-cap-enforcement-stack-v1` when legal-readiness posture depends on SCRA foreclosure relief, lease termination, eviction protection, or interest-rate enforcement.
- Add `toolchain_id=TC-NATURAL-303`, `tool_suite_id=ts-joint-naturalization-citizenship-immigration-benefits-continuity-v1`, and `protocol_stack_id=ps-joint-naturalization-citizenship-immigration-benefits-continuity-stack-v1` when legal-support recommendations depend on naturalization filings, immigration-document validity, or family-status continuity tied to deployment evidence.
- Add `toolchain_id=TC-CREDIT-306`, `tool_suite_id=ts-joint-credit-identity-theft-financial-readiness-recovery-v1`, and `protocol_stack_id=ps-joint-credit-identity-theft-financial-readiness-recovery-stack-v1` when estate or POA readiness depends on fraud containment, creditor identity disputes, or restored financial identity confidence.
- Add `packet_id=DPL-SCRA-HOUSING-CREDIT-001`, `packet_id=DPL-NATURALIZATION-IMMIGRATION-001`, and `packet_id=DPL-CREDIT-IDENTITY-RECOVERY-001` for branches that materially alter legal readiness, family stability, or command confidence in household continuity.
