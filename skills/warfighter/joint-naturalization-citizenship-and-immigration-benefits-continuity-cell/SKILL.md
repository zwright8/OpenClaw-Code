---
name: joint-naturalization-citizenship-and-immigration-benefits-continuity-cell
description: Preserve naturalization, citizenship, immigration-document, and family-status continuity for U.S. servicemembers and military households during deployment, mobilization, PCS, casualty recovery, or disaster disruption. Use when immigration-process failure is starting to affect readiness, legal security, or family stability.
---

# Joint Naturalization Citizenship And Immigration Benefits Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter immigration and citizenship continuity decisions.
- Confirm affected individuals, immigration posture, filing deadlines, service-certification requirements, and privacy constraints before recommending action.
- Keep outputs unclassified by default and minimize sensitive immigration data unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using status category, pending petitions or naturalization steps, deployment evidence, and family or travel dependencies.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in legal continuity, travel freedom, family stability, and staff burden.
3. Identify branch triggers for N-426 certification delay, green-card or passport expiration, parole or visa lapse, and casualty-linked family status escalation.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and immigration-continuity risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: immigration continuity board, citizenship-filing ladder, and family-status protection packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-NATURAL-303`, `tool_suite_id=ts-joint-naturalization-citizenship-immigration-benefits-continuity-v1`, and `protocol_stack_id=ps-joint-naturalization-citizenship-immigration-benefits-continuity-stack-v1`.
- Alternate: select a mission-adjacent personnel-records, legal-assistance, or passport-safehaven suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual case-priority roster with advisory-only sequencing until identity, service evidence, and filing posture are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-NATURALIZATION-IMMIGRATION-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: immigration case tracker, citizenship-certification queue, document-expiration board, and legal-assistance liaison ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed immigration notices, `API/JSON`, `S/MIME`, `ICAO Doc 9303`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If identity evidence, filing authority, or immigration status is uncertain, downgrade to advisory-only and request human legal review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and document-validity integrity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag expired documents, unsupported immigration promises, family-separation risk, and privacy leakage before recommending action.
- Do not fabricate legal status, filing approvals, or consular outcomes.
