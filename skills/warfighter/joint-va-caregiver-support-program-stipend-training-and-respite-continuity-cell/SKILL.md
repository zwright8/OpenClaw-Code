---
name: joint-va-caregiver-support-program-stipend-training-and-respite-continuity-cell
description: Preserve VA caregiver-program eligibility, stipend, training, and respite continuity for seriously injured U.S. warfighters when recovery depends on stable caregiver support and sustainable household care capacity.
---

# Joint VA Caregiver Support Program Stipend Training And Respite Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter caregiver-support and recovery-sustainment decisions.
- Confirm affected warfighters or families, caregiver roster, stipend posture, training completion, respite availability, and decision deadlines before recommending action.
- Keep outputs unclassified by default and minimize PHI or PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using caregiving demand, stipend continuity, training status, respite availability, and household fatigue indicators.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in caregiver sustainability, patient safety, privacy, and recovery continuity.
3. Identify branch triggers for stipend interruption, caregiver attrition, respite denial, training lapse, and backup-coverage failure.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and caregiver-support risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: caregiver-support board, stipend and training ladder, and respite continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-VACARE-333`, `tool_suite_id=ts-joint-va-caregiver-support-program-stipend-training-respite-continuity-v1`, and `protocol_stack_id=ps-joint-va-caregiver-support-program-stipend-training-respite-continuity-stack-v1`.
- Alternate: select a mission-adjacent wounded-warrior, EFMP, or family-readiness suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual caregiver-priority roster with advisory-only sequencing until stipend posture, training status, and respite viability are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-VA-CAREGIVER-STIPEND-RESPITE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: caregiver application tracker, stipend status ledger, training-completion queue, and respite or backup-coverage board.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NIEM`, signed caregiver determinations, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If caregiver eligibility, stipend evidence, or respite legitimacy is uncertain, downgrade to advisory-only and request human clinical or benefits review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag caregiver burnout, unsupported stipend promises, training gaps, and unsafe backup-coverage assumptions before recommending action.
- Do not fabricate eligibility, stipend status, respite approval, or caregiver-training completion.
