---
name: joint-overseas-spouse-work-authorization-host-nation-banking-and-driver-license-continuity-cell
description: Preserve overseas spouse work authorization, host-nation banking access, and driver-license continuity when lawful family movement succeeds on paper but still fails in practice for U.S. warfighter households.
---

# Joint Overseas Spouse Work Authorization Host Nation Banking And Driver License Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter overseas household-legitimacy and spouse-employment continuity decisions.
- Confirm sponsor orders, command-sponsorship posture, host-nation requirements, spouse identity or status evidence, and decision authority before recommending action.
- Keep outputs unclassified by default and minimize personally identifiable information unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using movement timeline, work-authorization posture, banking-access friction, driver-license requirements, and household income risk.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in legal sufficiency, household stability, mobility, and administrative burden.
3. Identify branch triggers for denied work authorization, failed bank onboarding, nonrecognition of driving credentials, and SOFA or residency mismatch.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and overseas-household risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: overseas spouse employment board, banking or driver-license ladder, and household-legitimacy continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-SOFA-391`, `tool_suite_id=ts-joint-overseas-spouse-work-authorization-host-nation-banking-driver-license-continuity-v1`, and `protocol_stack_id=ps-joint-overseas-spouse-work-authorization-host-nation-banking-driver-license-continuity-stack-v1`.
- Alternate: select a mission-adjacent command-sponsorship, spouse-employment, or immigration-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual overseas-household roster with advisory-only sequencing until identity, sponsorship, and host-nation rules are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-SPOUSE-WORKAUTH-BANK-DRIVER-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: overseas spouse work-authorization queue, host-nation banking onboarding board, driver-license reciprocity tracker, and SOFA or residency ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `ICAO Doc 9303`, `AAMVA DL/ID`, `ISO 20022`, signed consular notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If immigration status, host-nation acceptance, or identity evidence is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and household-legitimacy clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported work-authorization promises, bank-access assumptions, driver-license reciprocity gaps, and privacy leakage before recommending action.
- Do not fabricate visas, banking approvals, or host-nation driving authority.
