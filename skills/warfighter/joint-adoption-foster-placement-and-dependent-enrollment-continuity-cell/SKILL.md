---
name: joint-adoption-foster-placement-and-dependent-enrollment-continuity-cell
description: Synchronize adoption, foster placement, dependent enrollment, school or medical onboarding, and sponsor leave or travel so American warfighters are not forced to choose between legal family obligations and mission readiness. Use when placement or enrollment friction is creating mission-impacting instability.
---

# Joint Adoption Foster Placement And Dependent Enrollment Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter adoption, foster placement, and dependent-transition continuity decisions.
- Confirm placement status, jurisdiction, sponsor duty timeline, dependent identity-document posture, school or medical urgency, and travel or leave constraints before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using placement timeline, document sufficiency, dependent enrollment posture, school or medical onboarding risk, and sponsor availability.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in child safety, legal sufficiency, privacy, and sponsor mission impact.
3. Identify branch triggers for missing placement orders, interstate compact delay, DEERS lag, school or pediatric care gap, and sponsor leave or travel denial.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and placement-continuity risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: dependent-transition checklist, placement milestone board, and school-medical enrollment bridge packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-DEPENDENT-322`, `tool_suite_id=ts-dependent-care-transition-v1`, and `protocol_stack_id=ps-adoption-foster-dependent-enrollment-stack-v1`.
- Alternate: select a mission-adjacent benefits, family-readiness, or legal-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual dependent-transition ledger with advisory-only guidance until placement authority, dependent identity, and sponsor approvals are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-ADOPTION-FOSTER-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: dependent-status tracker, court or placement deadline board, DEERS enrollment queue, school and pediatric onboarding checklist, and sponsor leave or travel approval ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed custody or placement notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Use the `Personnel and Family Readiness Casework` and `Benefits and Eligibility Bridge` playbooks when enrollment, care, and sponsor approvals must move in sync.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If placement authority, dependent identity, or sponsor approval is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Protect child safety, legal integrity, privacy, and stable schooling or medical handoff before recommending action.
- Do not fabricate placement authority, DEERS enrollment, school acceptance, or sponsor travel approval.

## Domain Toolchain Override (2026-04-11, Expansion Wave XCIII Addendum)

- Add `toolchain_id=TC-SURRO-385`, `tool_suite_id=ts-joint-surrogacy-parentage-newborn-documentation-dependent-enrollment-continuity-v1`, and `protocol_stack_id=ps-joint-surrogacy-parentage-newborn-documentation-dependent-enrollment-continuity-stack-v1` when parentage-order continuity, newborn-document legitimacy, or DEERS enrollment delay creates a family-formation problem that does not fit traditional adoption or foster-placement routing.
- Add `packet_id=DPL-SURROGACY-PARENTAGE-001` for branches that materially alter dependent-enrollment timing, sponsor travel, or household legal certainty.
