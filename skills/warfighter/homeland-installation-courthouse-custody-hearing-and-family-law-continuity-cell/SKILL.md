---
name: homeland-installation-courthouse-custody-hearing-and-family-law-continuity-cell
description: Preserve custody-hearing, family-law, and courthouse continuity when domestic disruption destabilizes military communities. Use when commanders need auditable options around court access, protective filings, and household legal status that affect readiness and safety.
---

# Homeland Installation Courthouse Custody Hearing And Family Law Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter courthouse-access, custody-hearing, and family-law continuity decisions during domestic emergencies.
- Confirm affected jurisdictions, court status, filing deadlines, custody or protective-order risk, and legal-support availability before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using court closures, custody-hearing backlog, filing pathways, family-law risk indicators, and command or family-readiness impacts.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in legal sufficiency, safety, privacy, and readiness impact.
3. Identify branch triggers for emergency filing diversion, custody-hearing delay, courthouse relocation, and unresolved family-law escalation.
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

Primary products: court-continuity board, custody-hearing ladder, and family-law risk packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-COURT-289`, `tool_suite_id=ts-homeland-installation-courthouse-custody-hearing-family-law-continuity-v1`, and `protocol_stack_id=ps-homeland-installation-courthouse-custody-hearing-family-law-continuity-stack-v1`.
- Alternate: select a mission-adjacent legal-assistance, protective-order, or public-communications suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual docket and filing tracker with advisory-only status updates until court authority and alternate filing pathways are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-COURTHOUSE-CUSTODY-FAMILY-LAW-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: courthouse status board, custody-hearing docket tracker, protective-order filing queue, and legal-aid liaison matrix.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed court notices, `API/JSON`, `S/MIME`, `NIMS/ICS`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If court status, filing authority, or household legal risk is uncertain, downgrade to advisory-only and request legal review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag privacy exposure, unsupported legal deadlines, child-safety risk, and unverifiable filing paths before recommending action.
- Do not fabricate court access, filing acceptance, custody rulings, or legal approvals.
