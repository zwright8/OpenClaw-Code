---
name: joint-personal-effects-custody-and-mortuary-return-integrity-cell
description: Coordinate dignified custody, documentation, and return of personal effects linked to casualties or missing personnel. Use when chain-of-custody integrity, fraud prevention, or family return decisions need trusted accountability.
---

# Joint Personal Effects Custody And Mortuary Return Integrity Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm mortuary authority, family-notification boundaries, custody documentation standards, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with case status, recovered effects, unresolved ownership questions, and family handoff constraints.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in dignity, accountability, family trust, and administrative burden.
3. Identify branch or sequel triggers, release hold points, and approval gates.
4. Bind each critical recommendation to concrete external tools, protocols, and staff handoffs.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: personal-effects custody board, return authorization packet, and unresolved-effects exception tracker.

## External Tool Stack and Protocols

- Primary toolsets: personal-effects ledger, mortuary case tracker, and family handoff workflow.
- Alternate toolsets: manual effects inventory card, sealed-transfer worksheet, and casualty-assistance review board.
- Degraded mode: sealed dual-witness custody only with commander-approved release exceptions and hourly ledger reconciliation.
- Preferred protocol profiles: `NIEM`, `USMTF`, `S/MIME`, `API/JSON`, and signed custody manifests.
- Use `../_shared/references/external-tools-protocols.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md` as the baseline for building a provisional packet for this domain.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, custody documentation, or family-release confidence is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag dignity, fraud, privacy, and misattribution risks before recommending action.
- Do not fabricate classified sources, authorities, or approvals.

## Domain Toolchain Override (2026-03-15, Expansion Wave LVII Addendum)

- Add `tool_suite_id=ts-joint-dignified-transfer-escort-family-liaison-v1` + `protocol_stack_id=ps-joint-dignified-transfer-escort-family-liaison-stack-v1` when personal-effects release timing must stay synchronized with dignified transfer movement, escort handoffs, or family-liaison sequencing.
- Add `packet_id=DPL-DIGNIFIED-TRANSFER-ESCORT-FAMILY-LIAISON-001` for branches that materially alter custody release timing, family handoff preparation, or ceremonial coordination.
