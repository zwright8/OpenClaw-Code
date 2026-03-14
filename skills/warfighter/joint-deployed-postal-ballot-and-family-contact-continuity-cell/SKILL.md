---
name: joint-deployed-postal-ballot-and-family-contact-continuity-cell
description: Coordinate deployed postal flow, absentee ballot custody, and trusted family-contact continuity for U.S. warfighters in contested or disconnected theaters. Use when morale, legal voting access, or message authenticity are at risk.
---

# Joint Deployed Postal Ballot And Family Contact Continuity Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm echelon, mail throughput status, ballot deadlines, network or courier constraints, casualty-notification posture, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with postal backlogs, ballot custody state, family-contact pathways, deception indicators, and movement constraints.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in morale, legal access, OPSEC, authenticity, and transport burden.
3. Identify branch or sequel triggers, custody-failure thresholds, and authority or release gates.
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

Primary products: mail-flow priority board, ballot custody ledger, and family-contact continuity plan.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-deployed-postal-ballot-family-contact-continuity-v1` with `protocol_stack_id=ps-joint-deployed-postal-ballot-family-contact-continuity-stack-v1`.
- Alternate: `tool_suite_id=ts-physical-message-assurance-v1` with a mission-adjacent stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Degraded: courier-only custody ledger with dual-control ballot witness checks and authenticated family-contact release board.

## Domain Packet Defaults

- Default packet ID: `DPL-POSTAL-BALLOT-FAMILY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: postal flow board, ballot status tracker, secure family-contact relay ledger, and deception-risk notification monitor.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed custody manifests, `S/MIME`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, identity evidence, or custody provenance is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Protect PII, ballot secrecy, casualty-notification integrity, and OPSEC before recommending action.
- Do not fabricate authorities, approvals, or source evidence.
