---
name: joint-parental-leave-pregnancy-postpartum-profile-and-duty-modification-continuity-cell
description: Preserve parental leave, pregnancy or postpartum profiles, and duty-modification legitimacy when deployment tempo, PCS, or administrative drift threatens safe availability and household stability for U.S. warfighters.
---

# Joint Parental Leave Pregnancy Postpartum Profile And Duty Modification Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter parental-leave, pregnancy or postpartum-profile, and duty-modification continuity decisions.
- Confirm affected servicemembers, pregnancy or postpartum stage, leave windows, duty restrictions, assignment or deployment timeline, and command authority before recommending action.
- Keep outputs unclassified by default and minimize PHI or PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using leave posture, profile restrictions, appointment or recovery timelines, unit mission demand, and household-support pressure.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in maternal recovery, mission coverage, legal compliance, and family stability.
3. Identify branch triggers for leave denial, stale or conflicting profile dates, childcare gaps, PCS or deployment overlap, and unsafe duty expectations.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and parental-readiness risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: parental-leave continuity board, pregnancy or postpartum profile ladder, and duty-modification support packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-PARENTAL-343`, `tool_suite_id=ts-joint-parental-leave-pregnancy-postpartum-profile-duty-modification-continuity-v1`, and `protocol_stack_id=ps-joint-parental-leave-pregnancy-postpartum-profile-duty-modification-continuity-stack-v1`.
- Alternate: select a mission-adjacent family-readiness, medical-hold, or DEERS suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual parental-readiness roster with advisory-only sequencing until leave authority, medical restrictions, and family-support posture are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-PARENTAL-LEAVE-PREG-POSTPARTUM-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: parental-leave case board, maternity or postpartum care tracker, profile and duty-restriction ledger, and assignment-impact queue.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NIEM`, signed medical or personnel notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If leave authority, medical restriction evidence, or duty-modification legitimacy is uncertain, downgrade to advisory-only and request human medical or personnel review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsafe duty expectations, unsupported leave promises, childcare collapse, and privacy leakage before recommending action.
- Do not fabricate medical clearances, parental-leave approvals, profile dates, or deployment waivers.
