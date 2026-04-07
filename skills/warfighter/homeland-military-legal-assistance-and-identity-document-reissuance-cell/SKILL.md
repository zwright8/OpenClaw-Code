---
name: homeland-military-legal-assistance-and-identity-document-reissuance-cell
description: Restore legal-assistance access and identity-document continuity for service members, families, and dependents during domestic disruption. Use when military communities need auditable options for lost IDs, powers of attorney, claims packets, and entitlement proof.
---

# Homeland Military Legal Assistance And Identity Document Reissuance Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter legal-assistance, identity-document recovery, and entitlement-continuity decisions during domestic emergencies.
- Confirm affected population, document-loss severity, legal deadlines, administrative authority, privacy constraints, and decision timeline before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using impacted installations, document-loss categories, legal-service availability, emergency notary or witness capacity, and entitlement or travel deadlines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in legal sufficiency, privacy risk, response speed, and readiness impact.
3. Identify branch triggers for emergency ID reissuance, power-of-attorney surge, records reconstruction, and benefit or travel-document escalation.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: legal-aid triage matrix, ID reissue ladder, and claims-document recovery packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-LEGALAID-282`, `tool_suite_id=ts-homeland-military-legal-assistance-identity-document-reissuance-v1`, and `protocol_stack_id=ps-homeland-military-legal-assistance-identity-document-reissuance-stack-v1`.
- Alternate: select a mission-adjacent family-readiness, courthouse, or DSCA fiscal-legitimacy suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual intake ledger with advisory-only document recovery options until identity, legal authority, and records provenance are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-LEGAL-AID-ID-REISSUE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: legal-assistance case tracker, identity-document reissuance ledger, records-reconstruction queue, and DEERS or personnel-status validation board.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed legal notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If identity, benefit entitlement, or legal authority is uncertain, downgrade to advisory-only and request command or legal review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag privacy exposure, unsupported legal promises, unverifiable identity claims, and records-provenance gaps before recommending action.
- Do not fabricate identity records, court orders, powers of attorney, entitlements, or approvals.
