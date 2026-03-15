---
name: joint-offline-key-material-courier-and-compromise-cell
description: Coordinate offline cryptographic key custody, courier routing, compromise isolation, and emergency reissue when disconnected U.S. warfighter operations cannot rely on automated key distribution.
---

# Joint Offline Key Material Courier And Compromise Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm COMSEC authority, custody holders, courier constraints, and compromise indicators before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with affected key material, encrypted mission paths, custody chain status, and commander priorities.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in continuity, exposure risk, courier burden, and rekey speed.
3. Identify branch triggers for isolate, zeroize, courier, reissue, or hold decisions.
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

Primary products: key custody matrix, courier routing ladder, and compromise containment plan.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-offline-key-material-courier-compromise-v1` with `protocol_stack_id=ps-joint-offline-key-material-courier-compromise-stack-v1`.
- Alternate: select a mission-adjacent zero-trust, mission-network, or COMSEC suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: essential circuits only with dual-control courier custody and commander-approved manual rekey timing.

## Domain Packet Defaults

- Default packet ID: `DPL-OFFLINE-KEY-MATERIAL-COURIER-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: key-material custody ledger, courier route tracker, and compromise incident board.
- Preferred protocol profiles for coordination and machine exchange: signed custody manifests, `X.509`, `API/JSON`, `S/MIME`, `USMTF`, and `STIX/TAXII`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If custody integrity, compromise evidence, or COMSEC authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag cryptographic exposure, courier interception risk, zeroize timing, and mission-continuity impact before recommending action.
- Do not fabricate custody chains, compromise evidence, or release approvals.
