---
name: coalition-casualty-regulation-language-reconciliation-and-consent-cell
description: Reconcile multilingual casualty handoff, treatment consent, and legal caveats across coalition medical networks. Use when cross-border or combined care depends on trusted translation and consent handling.
---

# Coalition Casualty Regulation Language Reconciliation And Consent Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm coalition participants, medical authorities, consent standards, language requirements, and transfer timelines before issuing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame current casualty flow, treatment urgency, consent status, and partner-language constraints.
2. Separate verified medical facts, translated content, legal caveats, and unresolved ambiguity.
3. Build treat, translate, transfer, defer, and escalate branches with explicit tradeoffs in speed, legitimacy, and clinical risk.
4. Bind each branch to patient-regulation, translation-memory, consent-tracking, and compatibility tools.
5. Publish coalition decision points, approval roles, and retranslation triggers tied to clinical change.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternative branches with triggers.
4. Decision points now, next, and pre-delegated.
5. Staff task tracker with owners and suspense.
6. Coalition casualty packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: multilingual casualty handoff matrix, consent-status ledger, coalition treatment caveat tracker.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-casualty-language-consent-v1` with `protocol_stack_id=ps-coalition-casualty-language-consent-stack-v1`.
- Alternate: `tool_suite_id=ts-medical-force-health-v1` with `protocol_stack_id=ps-coalition-medical-credentialing-stack-v1`.
- Packet default: `packet_id=DPL-COALITION-CASUALTY-CONSENT-001`.
- Degraded: human interpreter plus manual consent worksheet with physician attestation and liaison approval.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md`, `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, and `../_shared/references/domain-tool-packet-library.md`.
- Prioritize `HL7/FHIR`, `NATO APP-11/ADatP-3` aligned exchange, `NIEM`, `API/JSON`, and `USMTF`.
- Include translation provenance, medical priority, consent confidence, and coalition caveat status in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run `../_shared/references/mission-assurance-checklist.md` before release.
- If translation fidelity, consent validity, or transfer authority is uncertain, downgrade to advisory-only and escalate to human review.

## Guardrails

- Do not fabricate consent, medical understanding, or coalition approval.
- Distinguish translation confidence from medical certainty.
- Surface partner caveats, protected health information handling, and family-notification implications before recommending transfer.
