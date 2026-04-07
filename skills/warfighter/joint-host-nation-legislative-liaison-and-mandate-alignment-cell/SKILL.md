---
name: joint-host-nation-legislative-liaison-and-mandate-alignment-cell
description: Align host-nation mandates, caveats, and emergency legal changes with military operations that depend on political approval and lawful access.
---

# Joint Host Nation Legislative Liaison And Mandate Alignment Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter host-nation mandate, legislative, and caveat-alignment decisions.
- Confirm current authority basis, host-nation legal changes, coalition caveats, waiver status, and commander decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using mandate constraints, pending waivers, coalition caveats, political timelines, and mission dependencies.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in legality, speed, alliance trust, and mission continuity.
3. Identify branch triggers for waiver approval, mandate denial, legislative delay, caveat tightening, and fallback authorities.
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

Primary products: mandate-alignment matrix, waiver-routing ladder, coalition caveat decision log, and authority translation brief.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-HNMANDATE-245`, `tool_suite_id=ts-joint-host-nation-legislative-liaison-and-mandate-alignment-v1`, and `protocol_stack_id=ps-joint-host-nation-legislative-liaison-and-mandate-alignment-stack-v1`.
- Alternate: select a mission-adjacent legal, diplomatic-clearance, or coalition-governance suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: advisory-only recommendations with no mandate-dependent action until legal review confirms authority.

## Domain Packet Defaults

- Default packet IDs: `DPL-HOST-NATION-MANDATE-001` and `DPL-HOST-NATION-WAIVER-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: authority-translation board, waiver-routing ledger, host-nation legal tracker, and coalition caveat matrix.
- Preferred protocol profiles for coordination and machine exchange: signed legal notices, `NIEM`, `API/JSON`, `S/MIME`, `STIX/TAXII`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If legal authority, host-nation interpretation, or coalition caveat status is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported legal assumptions, alliance-legitimacy risk, mandate drift, and waiver dependency before recommending action.
- Do not fabricate host-nation approvals, legal interpretations, or political commitments.
