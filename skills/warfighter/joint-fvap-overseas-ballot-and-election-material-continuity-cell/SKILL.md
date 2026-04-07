---
name: joint-fvap-overseas-ballot-and-election-material-continuity-cell
description: Preserve absentee-ballot, election-material, and voting-assistance continuity for U.S. warfighters and eligible dependents during deployment, mobilization, PCS, casualty recovery, or disrupted mail operations. Use when ballot friction is beginning to create legal, trust, or civic-readiness risk.
---

# Joint FVAP Overseas Ballot And Election Material Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter absentee-voting and election-material continuity decisions.
- Confirm affected voting populations, ballot-request posture, mail or pouch status, state deadlines, and legal constraints before recommending action.
- Keep outputs unclassified by default and minimize voter-sensitive data unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using request deadlines, ballot delivery status, location or mail constraints, and mission timelines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in ballot access, legal sufficiency, privacy, and operational burden.
3. Identify branch triggers for ballot nonreceipt, APO or FPO disruption, embassy or pouch delay, state-law deadline friction, and casualty-linked voter assistance.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and ballot-continuity risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: ballot continuity board, election-material recovery ladder, and voting-assistance packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-FVAP-305`, `tool_suite_id=ts-joint-fvap-overseas-ballot-election-material-continuity-v1`, and `protocol_stack_id=ps-joint-fvap-overseas-ballot-election-material-continuity-stack-v1`.
- Alternate: select a mission-adjacent family-readiness, passport-safehaven, or strategic-mobility suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual voter-priority roster with advisory-only sequencing until ballot status, deadlines, and lawful submission options are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-FVAP-BALLOT-CONTINUITY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: ballot-request tracker, election-mail routing board, voting-assistance queue, and deadline or state-contact ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed election notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If deadline evidence, lawful submission path, or voter identity is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and notice-authenticity integrity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported ballot-access promises, deadline misses, chain-of-custody ambiguity, and privacy exposure before recommending action.
- Do not fabricate election authority, ballot issuance, or submission acceptance.
