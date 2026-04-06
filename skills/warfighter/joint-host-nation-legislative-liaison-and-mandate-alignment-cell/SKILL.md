---
name: joint-host-nation-legislative-liaison-and-mandate-alignment-cell
description: Align joint operations with host-nation statutes, emergency mandates, and legislative constraints without losing mission tempo. Use when commanders need legally durable options with explicit tool and protocol bindings.
---

# Joint Host Nation Legislative Liaison And Mandate Alignment Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter host-nation legal-alignment and mandate-synchronization decisions.
- Confirm host-nation emergency powers, access agreements, operational authorities, coalition caveats, and legal-review timelines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using mission requirements, host-nation mandates, pending restrictions, cross-border authorities, and decision deadlines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in legality, speed, legitimacy, and partner confidence.
3. Identify branch triggers for mandate conflict, waiver request, parliamentary or ministerial approval, and temporary authority expiration.
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

Primary products: mandate-alignment matrix, legal-friction branch card, and waiver or exception tracker.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-host-nation-legislative-liaison-mandate-alignment-v1` with `protocol_stack_id=ps-joint-host-nation-legislative-liaison-mandate-alignment-stack-v1`.
- Alternate: select a mission-adjacent coalition, legal, or access-agreement suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual mandate ledger with advisory-only recommendations until host-nation authority and waiver posture are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-HOSTNATION-MANDATE-ALIGNMENT-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: authority-translation board, waiver-routing ledger, host-nation legal tracker, and coalition caveat matrix.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed legal notices, `API/JSON`, `S/MIME`, `STIX/TAXII`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If treaty basis, host-nation mandate fidelity, or waiver authority is uncertain, downgrade to advisory-only and request legal review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag ministerial ambiguity, coalition caveat mismatch, emergency-law expiration, and legitimacy costs before recommending action.
- Do not fabricate statutes, host-nation approvals, or waiver outcomes.
