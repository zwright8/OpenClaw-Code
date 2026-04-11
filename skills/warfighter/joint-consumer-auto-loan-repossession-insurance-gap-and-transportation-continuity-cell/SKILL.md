---
name: joint-consumer-auto-loan-repossession-insurance-gap-and-transportation-continuity-cell
description: Preserve household transportation continuity when auto-loan delinquency, repossession risk, insurance gaps, or title friction threaten lawful reporting, medical travel, or family stability for U.S. warfighters.
---

# Joint Consumer Auto Loan Repossession Insurance Gap And Transportation Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter household-transport and consumer-auto-finance continuity decisions.
- Confirm vehicle status, delinquency or repossession timeline, insurance posture, reporting or medical-travel requirements, and household transport alternatives before recommending action.
- Keep outputs unclassified by default and minimize financial and personally identifiable information unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using loan or lease posture, vehicle dependency, insurance status, title or registration friction, and readiness or household impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in transport continuity, fiscal legitimacy, privacy, and speed.
3. Identify branch triggers for repossession notice, insurance lapse, title hold, emergency travel need, and loss of backup transportation.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and transportation-finance risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: transportation continuity board, repossession-risk ladder, and auto-finance stabilization packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-AUTOFIN-365`, `tool_suite_id=ts-joint-consumer-auto-loan-repossession-insurance-gap-transportation-continuity-v1`, and `protocol_stack_id=ps-joint-consumer-auto-loan-repossession-insurance-gap-transportation-continuity-stack-v1`.
- Alternate: select a mission-adjacent POV, credit-recovery, or family-readiness suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual transport-risk roster with advisory-only sequencing until lender posture, insurance evidence, and backup-movement options are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-AUTO-REPO-TRANSPORT-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: auto-loan case board, repossession or delinquency tracker, insurance-compliance queue, and emergency-transport ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `AAMVA DL/ID`, signed lender notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If lender posture, insurance validity, or transport authority is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and mobility-eligibility clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported lender outcomes, unsafe uninsured movement, title-or-registration shortcuts, and unrealistic transport assumptions before recommending action.
- Do not fabricate repossession status, insurance coverage, lender promises, or driving authorization.
