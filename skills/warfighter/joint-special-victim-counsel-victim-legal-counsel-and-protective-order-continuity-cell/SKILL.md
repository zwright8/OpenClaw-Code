---
name: joint-special-victim-counsel-victim-legal-counsel-and-protective-order-continuity-cell
description: Preserve special-victim-counsel or victim-legal-counsel access, protective-order coordination, and survivor legal-document continuity when retaliation risk, jurisdiction friction, or command churn threaten U.S. warfighter safety and trust.
---

# Joint Special Victim Counsel Victim Legal Counsel And Protective Order Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter survivor-protection, legal-support, and protective-order continuity decisions.
- Confirm reporting posture, survivor consent boundaries, jurisdiction, existing or pending protective-order status, counsel availability, and immediate safety threats before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the case using survivor support needs, counsel-access posture, protective-order timeline, retaliation exposure, and command-decision deadlines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in survivor safety, legal protection, confidentiality, and readiness impact.
3. Identify branch triggers for delayed counsel assignment, order expiration, jurisdiction mismatch, relocation need, and evidentiary-document continuity risk.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and survivor legal-protection risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: survivor legal-protection board, counsel-routing ladder, and protective-order continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-SVCVLC-375`, `tool_suite_id=ts-joint-special-victim-counsel-victim-legal-counsel-protective-order-continuity-v1`, and `protocol_stack_id=ps-joint-special-victim-counsel-victim-legal-counsel-protective-order-continuity-stack-v1`.
- Alternate: select a mission-adjacent SAPR, family-advocacy, or IG or EO suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: survivor-safety-first manual routing only with advisory-only sequencing until consent posture, counsel availability, and human legal review are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-SVC-VLC-PROTECTIVE-ORDER-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: SVC or VLC assignment tracker, protective-order evidence ledger, retaliation-risk escalation queue, and court or command-coordination board.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed legal notices, `HL7/FHIR`, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If survivor consent, protective-order status, jurisdiction, or counsel authority is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and survivor-protection clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Use trauma-informed language and protect survivor autonomy, safety, and confidentiality.
- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag retaliation risk, order-expiration gaps, counsel delays, and privacy breaches before recommending action.
- Do not fabricate counsel advice, court findings, protective orders, or survivor statements.
