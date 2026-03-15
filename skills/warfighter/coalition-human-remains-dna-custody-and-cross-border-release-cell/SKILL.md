---
name: coalition-human-remains-dna-custody-and-cross-border-release-cell
description: Coordinate coalition human-remains DNA custody, mortuary chain-of-custody, and cross-border release decisions. Use when partners must preserve identity confidence, legal sufficiency, and dignified transfer timelines under combat or disaster conditions.
---

# Coalition Human Remains DNA Custody and Cross Border Release Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm recovery status, DNA or odontological evidence availability, coalition caveats, border-release authorities, and family-notification constraints before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with remains recovery status, identification confidence, evidence custody, release authority, and commander priorities.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in dignity, legal sufficiency, cross-border speed, and identification confidence.
3. Identify branch triggers for identity mismatch, custody break, diplomatic delay, or refrigeration failure.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and coalition decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: remains custody ledger, DNA confidence ladder, and cross-border release matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-human-remains-dna-custody-cross-border-release-v1` with `protocol_stack_id=ps-coalition-human-remains-dna-custody-cross-border-release-stack-v1`.
- Alternate: select a mission-adjacent mortuary-affairs, repatriation, or legal-custody suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: hold remains under protected custody with manual manifest reconciliation, coalition liaison review, and restricted release authority.

## Domain Packet Defaults

- Default packet ID: `DPL-HUMAN-REMAINS-DNA-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: mortuary custody ledger, DNA sample chain tracker, identification confidence board, and border-release coordination desk.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed custody manifests, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If identity confidence, custody integrity, or cross-border release authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag custody breaks, identification ambiguity, sovereignty conflicts, and family-notification risk before recommending action.
- Do not fabricate DNA confidence, custody continuity, or release approval.
