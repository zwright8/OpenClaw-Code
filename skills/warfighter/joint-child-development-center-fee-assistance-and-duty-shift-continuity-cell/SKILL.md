---
name: joint-child-development-center-fee-assistance-and-duty-shift-continuity-cell
description: Preserve child-development-center placement, fee assistance, shift-work coverage, and caregiver handoff continuity when duty schedules, mobilization, or installation disruption threatens the availability of American warfighters.
---

# Joint Child Development Center Fee Assistance And Duty Shift Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter childcare-access and duty-shift continuity decisions.
- Confirm affected households, CDC or fee-assistance posture, duty-schedule stress, guardian or backup-care availability, and decision authority before recommending action.
- Keep outputs unclassified by default and minimize PII or child-specific detail unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using childcare capacity, fee-assistance status, shift coverage strain, caregiver reliability, and readiness impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in childcare legitimacy, work attendance, caregiver burden, and cost exposure.
3. Identify branch triggers for waitlist growth, fee-assistance lapse, overnight or weekend shift mismatch, guardian failure, and installation closure.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and childcare-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: CDC access board, fee-assistance ladder, and duty-shift childcare continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-CDCFEE-325`, `tool_suite_id=ts-joint-child-development-center-fee-assistance-duty-shift-continuity-v1`, and `protocol_stack_id=ps-joint-child-development-center-fee-assistance-duty-shift-continuity-stack-v1`.
- Alternate: select a mission-adjacent family-readiness, mobilization, or base-childcare suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual childcare-priority roster with advisory-only sequencing until placement status, fee eligibility, and guardian coverage are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-CDC-FEE-SHIFT-CONTINUITY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: CDC waitlist board, fee-assistance queue, duty-shift coverage roster, and guardian-verification ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed childcare notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If childcare placement, fee eligibility, or guardian authority is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and caregiver-coverage clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported childcare promises, fee-assistance assumptions, shift-coverage shortcuts, and guardian-verification gaps before recommending action.
- Do not fabricate placement availability, subsidy approval, caregiver commitment, or command waiver.
