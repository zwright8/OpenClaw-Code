---
name: joint-security-clearance-foreign-contact-and-record-correction-continuity-cell
description: Preserve security-clearance eligibility, foreign-contact reporting, and personnel-security record correction continuity so warfighters are not sidelined by administrative drift or unadjudicated data. Use when clearance friction begins to threaten readiness, assignment, or mobilization timing.
---

# Joint Security Clearance Foreign Contact And Record Correction Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter clearance, adjudication, and security-record continuity decisions.
- Confirm affected population, clearance posture, record-correction backlog, foreign-contact or incident-report status, and assignment timeline before recommending action.
- Keep outputs unclassified by default and minimize PII or security-sensitive data unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using clearance status, incident-report posture, foreign-contact updates, adjudication queue, and mission-assignment pressure.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in mission access, security confidence, privacy protection, and administrative burden.
3. Identify branch triggers for expired investigation data, unreported foreign contact, record mismatch, access suspension, and assignment or deployment loss.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and clearance-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: clearance status board, foreign-contact update ladder, and adjudication evidence packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-CLEAR-311`, `tool_suite_id=ts-joint-security-clearance-foreign-contact-record-correction-continuity-v1`, and `protocol_stack_id=ps-joint-security-clearance-foreign-contact-record-correction-continuity-stack-v1`.
- Alternate: select a mission-adjacent personnel-records, mobilization, or mission-risk suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs. Prefer `ts-clearance-personnel-risk-v1` when foreign-contact updates intersect debt, identity compromise, tax issues, or pay anomalies.
- Degraded: manual access-priority roster with advisory-only sequencing until incident evidence, adjudication posture, and authority are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-CLEARANCE-RECORD-CORRECTION-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: clearance-case tracker, foreign-contact update queue, adjudication evidence ledger, and personnel-security record-correction board.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed security notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Use the `Clearance Adjudication and Record Repair` playbook when foreign-contact reporting must be reconciled with financial-risk remediation, identity-theft recovery, or record-mismatch correction.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If incident evidence, security authority, or record-correction provenance is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unjustified access suspension, stale or duplicate data, unreported foreign contacts, and unsupported assignment-impact claims before recommending action.
- Do not fabricate adjudication outcomes, clearance eligibility, incident resolution, or access restoration.

## Domain Toolchain Override (2026-04-11, Expansion Wave LXXXVI Addendum)

- Add `toolchain_id=TC-SORCLR-352`, `tool_suite_id=ts-joint-security-clearance-suspension-revocation-statement-of-reasons-response-v1`, and `protocol_stack_id=ps-joint-security-clearance-suspension-revocation-statement-of-reasons-response-stack-v1` when foreign-contact or record-correction issues escalate into access suspension, revocation risk, or statement-of-reasons response deadlines.
- Add `toolchain_id=TC-UIFGOMOR-351`, `tool_suite_id=ts-joint-unfavorable-information-file-gomor-board-record-rebuttal-continuity-v1`, and `protocol_stack_id=ps-joint-unfavorable-information-file-gomor-board-record-rebuttal-continuity-stack-v1` when derogatory paperwork or board-file drift contaminates adjudication trust or assignment decisions.
- Add `packet_id=DPL-CLEARANCE-SOR-SUSP-REVOCATION-001` and `packet_id=DPL-UIF-GOMOR-BOARD-001` for branches that materially alter access-restoration timing, assignment legitimacy, or clearance-defense confidence.

## Domain Toolchain Override (2026-04-11, Expansion Wave XCII Addendum)

- Add `toolchain_id=TC-POLY-381`, `tool_suite_id=ts-joint-security-clearance-polygraph-continuous-vetting-readiness-v1`, and `protocol_stack_id=ps-joint-security-clearance-polygraph-continuous-vetting-readiness-stack-v1` when record-correction posture, foreign-contact reporting, or assignment viability depends on preserved polygraph windows, continuous-vetting alert resolution, or current mission-access evidence.
- Add `packet_id=DPL-POLYGRAPH-CONTINUOUS-VETTING-001` for branches that materially alter access-restoration timing, assignment legitimacy, or clearance-readiness confidence.
