---
name: coalition-cross-border-casualty-identity-and-family-notification-cell
description: Support coalition casualty identity confidence and cross-border family notification synchronization with legal and privacy guardrails in contested operations.
---

# Coalition Cross Border Casualty Identity And Family Notification Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. and coalition warfighter teams in this domain.
- Confirm echelon, mission phase, authorities, classification handling, and commander decision timeline.
- Keep outputs advisory-only unless explicit command authority and approvals are provided.

## Workflow

1. Frame the mission problem with operational context, threat model, and critical dependencies.
2. Identify assumptions, invalidation triggers, legal-policy constraints, and coalition releasability limits.
3. Build one recommended option and at least two alternatives with risk/tempo/sustainment tradeoffs.
4. Bind each option to external tool/protocol execution packets with degraded-mode fallbacks.
5. Publish commander and staff views with decisions-now/later, branch triggers, and owner/suspense tracking.

## Required Output Format

1. Situation snapshot and what changed.
2. Recommended option and rationale.
3. Alternative options with trigger conditions.
4. Decision points and authority gates.
5. Staff tasking matrix with owners and suspense.

## Domain Products

Primary products: identity confidence ledger, notification synchronization matrix, legal/privacy exception tracker.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and execute the Core Integration Protocol sequence.
- Use `../_shared/references/tool-protocol-playbooks.md` and `../_shared/references/external-tool-endpoints-and-adapters.md` for machine-ingestible invocation packets.
- Include provenance fields: source system, refresh time (UTC), assumptions, confidence, and known gaps.
- Prioritize these tool families for this domain: casualty identity reconciliation, coalition legal routing, family assistance coordination, protected data exchange.

## Assurance and Authority Requirements

- Validate outputs with `../_shared/references/mission-assurance-checklist.md`, `../_shared/references/tool-health-and-trust-monitoring.md`, and `../_shared/references/us-joint-protocol-assurance-drill.md`.
- Apply approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- If authority, provenance, tool trust, or interoperability is uncertain, downgrade to advisory-only and require command review.

## Tool/Protocol Binding

- Bind recommendations to `tool_suite_id=ts-coalition-cross-border-casualty-identity-and-family-notification-cell-v1` and `protocol_stack_id=ps-coalition-cross-border-casualty-identity-and-family-notification-cell-stack-v1` from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Bind machine-ingestible execution packets to `packet_id=DPL-COALITION-CASUALTY-IDENTITY-NOTIFICATION-001` from `../_shared/references/domain-tool-packet-library.md`.
- Include `validation_owner`, `revalidation_utc`, and degraded-mode fallback for every critical dependency.
