---
name: homeland-dsca-reimbursement-and-funding-authority-cell
description: Align domestic support actions with the right reimbursement path, cost-capture evidence, and funding authority. Use when commanders need DSCA options that stay operationally useful without creating fiscal-law surprises or unrecoverable costs.
---

# Homeland DSCA Reimbursement And Funding Authority Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter DSCA reimbursement, fiscal authority, and cost-capture decisions.
- Confirm mission assignment status, requesting authority, affected funding lines, cost-accounting systems, and reimbursement deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using requested support, current authorities, projected costs, accounting gaps, and reimbursement timelines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in responsiveness, fiscal risk, auditability, and mission continuity.
3. Identify branch triggers for Stafford or non-Stafford funding shifts, unsupported costs, emergency obligation limits, and cost-capture failure.
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

Primary products: funding-authority matrix, reimbursement timeline, and cost-capture evidence ledger.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-dsca-reimbursement-funding-authority-v1` with `protocol_stack_id=ps-homeland-dsca-reimbursement-funding-authority-stack-v1`.
- Alternate: select a mission-adjacent DSCA, finance, or mission-assignment suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual cost ledger with advisory-only funding assessment until fiscal review confirms authority.

## Domain Packet Defaults

- Default packet ID: `DPL-DSCA-FUNDING-AUTHORITY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: mission-assignment dashboard, cost-capture ledger, reimbursement status tracker, and fiscal-authority decision matrix.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed fiscal notices, `API/JSON`, `S/MIME`, `USMTF`, and `NIMS/ICS`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If funding authority, reimbursement eligibility, or audit trail sufficiency is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported obligations, broken cost-capture chains, reimbursement lag risk, and fiscal-law ambiguity before recommending action.
- Do not fabricate funding authority, reimbursement approval, or audit sufficiency.
