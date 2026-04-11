---
name: joint-privately-owned-vehicle-shipment-driver-license-and-registration-continuity-cell
description: Preserve privately owned vehicle shipment, driver-license validity, vehicle registration, and insurance continuity when PCS, mobilization, or overseas assignment disruption threatens household transport and American warfighter readiness.
---

# Joint Privately Owned Vehicle Shipment Driver License And Registration Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter household-transport continuity decisions.
- Confirm assignment or mobilization posture, POV shipment status, driver-license jurisdiction, registration or title deadlines, and decision authority before recommending action.
- Keep outputs unclassified by default and minimize PII, title data, or insurance detail unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using shipment posture, transportation gap severity, license or registration deadlines, insurance status, and reporting timeline.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in lawful driving access, household mobility, mission attendance, and administrative burden.
3. Identify branch triggers for POV shipment delay, vehicle damage or hold, expired license, registration noncompliance, and overseas-vehicle eligibility friction.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and transport-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: POV continuity board, license or registration risk ladder, and household transport restoration packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-POV-324`, `tool_suite_id=ts-joint-pov-shipment-driver-license-registration-continuity-v1`, and `protocol_stack_id=ps-joint-pov-shipment-driver-license-registration-continuity-stack-v1`.
- Alternate: select a mission-adjacent PCS, family-readiness, or legal-assistance suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual transport-priority roster with advisory-only sequencing until shipment status, driving legality, and registration evidence are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-POV-SHIPMENT-LICENSE-REG-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: POV shipment tracker, driver-license reciprocity board, registration or title ledger, and insurance-compliance queue.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `AAMVA DL/ID`, signed shipment notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If shipment evidence, license validity, or registration authority is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and transport-eligibility clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported shipment ETA, expired-license assumptions, registration shortcuts, and insurance-coverage gaps before recommending action.
- Do not fabricate shipment release, license validity, registration acceptance, or driving authorization.

## Domain Toolchain Override (2026-04-11, Expansion Wave LXXXIX Addendum)

- Add `toolchain_id=TC-AUTOFIN-365`, `tool_suite_id=ts-joint-consumer-auto-loan-repossession-insurance-gap-transportation-continuity-v1`, and `protocol_stack_id=ps-joint-consumer-auto-loan-repossession-insurance-gap-transportation-continuity-stack-v1` when lawful household movement also depends on stabilizing repossession exposure, auto-loan delinquency, or insurance gaps that could nullify otherwise valid POV routing.
- Add `packet_id=DPL-AUTO-REPO-TRANSPORT-001` for branches that materially alter POV movement confidence, transport legitimacy, or household mobility resilience.
