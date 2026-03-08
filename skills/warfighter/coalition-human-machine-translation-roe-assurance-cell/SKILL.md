---
name: coalition-human-machine-translation-roe-assurance-cell
description: Assure ROE-accurate human-machine translation for coalition mission execution. Use when multilingual coordination risk could alter legal compliance or fires outcomes.
---

# Coalition Human Machine Translation ROE Assurance Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Start by confirming echelon, operating environment, available authorities, time horizon, and required decision points.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem with domain indicators, commander priorities, and branch triggers.
2. Identify assumptions, decision thresholds, and invalidation signals.
3. Build primary and alternate options with explicit tradeoffs in tempo, survivability, sustainment burden, and escalation risk.
4. Integrate dependencies across C2, intelligence, fires/effects, sustainment, protection, legal constraints, and coalition interoperability.
5. Produce commander-facing outputs and a staff-action plan with owners, suspense dates, and triggers.

## Required Output Format

1. Situation snapshot.
2. Recommended option.
3. Alternative options.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.

## Domain Products

Primary products for this skill: ROE translation validation packet, coalition phrase authority matrix, ambiguity risk decision board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-c2-fusion-v1` with `protocol_stack_id=ps-nato-coalition-stack-v1`.
- Alternate: `tool_suite_id=ts-disinformation-counter-v1` with `protocol_stack_id=ps-osint-info-ops-stack-v1`.
- Degraded: use authenticated voice/readback + UTC acknowledgment ledger + manual fallback board.

## External Tools and Protocol Integration

- Use baseline guidance in `../_shared/references/external-tools-protocols.md`.
- Use protocol packets in `../_shared/references/tool-protocol-playbooks.md` and `../_shared/references/domain-tool-packet-library.md`.
- Bind recommendations to concrete suite/stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Include provenance fields: source system, refresh UTC, confidence, and key gaps.

## Domain Packet Defaults

- Default packet IDs: `DPL-COAL-FIRES-001`, `DPL-HUM-COR-001`.
- If a packet does not capture translation ambiguity risk, define a provisional packet and assign coalition validation ownership.

## Tool Invocation Contract

- For each critical dependency include: objective, required inputs, query/action template, expected output schema, protocol/transport, and fallback path.
- Require both machine-translated and human-validated ROE phrase checks before release.
- If translation confidence is below mission threshold, downgrade to advisory-only and route for human command review.

## Authority and Assurance Gates

- Apply approval and escalation requirements from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run protocol conformance checks from `../_shared/references/us-joint-protocol-assurance-drill.md` before high-impact recommendations.
- If authority, legal basis, or acknowledgment integrity is uncertain, downgrade to advisory-only with explicit commander prompts.
