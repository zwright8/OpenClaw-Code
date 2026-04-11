---
name: joint-security-clearance-suspension-revocation-and-statement-of-reasons-response-cell
description: Preserve clearance-defense timing, statement-of-reasons response quality, and access-restoration continuity when suspension or revocation actions threaten U.S. warfighter readiness, assignment, or mission access.
---

# Joint Security Clearance Suspension Revocation And Statement Of Reasons Response Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter clearance-suspension, revocation, and adjudication-response continuity decisions.
- Confirm current access status, allegation category, response deadlines, affected population, evidence posture, and decision authority before recommending action.
- Keep outputs unclassified by default and minimize PII or sensitive security detail unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using access loss, statement-of-reasons posture, incident history, evidence gaps, and mission or family impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in access restoration, security confidence, privacy protection, and assignment continuity.
3. Identify branch triggers for missed deadlines, stale incident records, contradictory source data, unreported issues, and cascading mission-access loss.
4. Bind each critical recommendation to concrete external tools, protocol stacks, packet templates, and authority gates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and clearance-defense risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: clearance response board, adjudication deadline ladder, and access-restoration support packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-SORCLR-352`, `tool_suite_id=ts-joint-security-clearance-suspension-revocation-statement-of-reasons-response-v1`, and `protocol_stack_id=ps-joint-security-clearance-suspension-revocation-statement-of-reasons-response-stack-v1`.
- Alternate: select a mission-adjacent clearance-records, financial-distress, or legal-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual clearance-response roster with advisory-only sequencing until notice posture, response deadlines, and evidence sources are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-CLEARANCE-SOR-SUSP-REVOCATION-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: security suspension tracker, statement-of-reasons response queue, incident crosswalk ledger, and adjudication timeline board.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed security notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Use the `Administrative Justice and Redress` playbook when response deadlines, evidence reconciliation, or adjudication routing determine mission-access risk.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If notice validity, legal authority, or source evidence is uncertain, downgrade to advisory-only and request human security or legal review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and adjudication-timeline clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported reinstatement claims, stale incident data, privacy leakage, and unverified adjudication assumptions before recommending action.
- Do not fabricate clearance outcomes, access restoration, legal advice, or adjudication results.
