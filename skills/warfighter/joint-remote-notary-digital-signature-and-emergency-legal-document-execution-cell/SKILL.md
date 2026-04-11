---
name: joint-remote-notary-digital-signature-and-emergency-legal-document-execution-cell
description: Preserve remote notarization, trusted digital-signature, and emergency legal-document execution continuity when deployment, casualty risk, or infrastructure disruption prevents U.S. warfighters from completing time-sensitive paperwork in person.
---

# Joint Remote Notary Digital Signature And Emergency Legal Document Execution Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter remote-notary and emergency legal-document continuity decisions.
- Confirm document type, jurisdiction, identity-proofing posture, witness or notary availability, and decision authority before recommending action.
- Keep outputs unclassified by default and minimize personally identifiable information unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using legal deadline, signer identity posture, jurisdiction rules, remote-access constraints, and readiness impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in legal sufficiency, timing, privacy exposure, and administrative burden.
3. Identify branch triggers for failed identity proofing, unavailable witness or notary coverage, unsupported digital-signature standard, and expired legal deadline.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and legal-execution risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: remote-notary execution board, signature-trust ladder, and emergency-document continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-ENOTARY-394`, `tool_suite_id=ts-joint-remote-notary-digital-signature-emergency-legal-document-execution-v1`, and `protocol_stack_id=ps-joint-remote-notary-digital-signature-emergency-legal-document-execution-stack-v1`.
- Alternate: select a mission-adjacent civil-relief, legal-assistance, or ballot-continuity suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual document-execution roster with advisory-only sequencing until identity proofing, jurisdiction rules, and legal review are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-REMOTE-NOTARY-DOCEXEC-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: legal-document execution board, remote identity-proofing queue, notary or witness availability ledger, and digital-signature validation tracker.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `PKCS#7/CMS`, signed legal notices, `API/JSON`, `S/MIME`, `OIDC/SAML`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If identity proofing, jurisdiction applicability, or document authority is uncertain, downgrade to advisory-only and request human legal review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and signature-trust integrity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported notarization claims, identity-proofing weaknesses, witness gaps, and expired deadlines before recommending action.
- Do not fabricate notarization, legal sufficiency, or document acceptance.
