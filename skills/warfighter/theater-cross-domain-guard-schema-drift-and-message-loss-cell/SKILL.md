---
name: theater-cross-domain-guard-schema-drift-and-message-loss-cell
description: Coordinate recovery from schema drift, dropped messages, and replay gaps across cross-domain guards. Use when mission data exchange becomes untrustworthy because guards silently reshape, delay, or discard critical traffic.
---

# Theater Cross Domain Guard Schema Drift And Message Loss Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm cyber authority, cross-domain governance boundaries, mission-partner dependencies, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with schema versions, guard health, source and destination paths, and backlog state.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in message integrity, mission latency, partner trust, and containment speed.
3. Identify branch or sequel triggers, replay hold points, and release-approval gates.
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

Primary products: schema drift exception packet, message-loss recovery board, and trust-restoration timeline.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-cross-domain-guard-schema-drift-message-loss-v1` with `protocol_stack_id=ps-theater-cross-domain-guard-schema-drift-message-loss-stack-v1`.
- Alternate: select a mission-adjacent cyber-defense, mission-data, or interoperability suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: critical-message manual relay only with UTC checksum logging.

## Domain Packet Defaults

- Default packet ID: `DPL-CROSS-DOMAIN-SCHEMA-DRIFT-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: cross-domain guard telemetry board, schema diff validator, and message replay ledger.
- Preferred protocol profiles for coordination and machine exchange: signed schema manifests, `XML/JSON`, `STIX/TAXII`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, schema parity, replay confirmation, or cross-domain approval is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag schema translation, silent-drop, coalition release, and contaminated-replay risks before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
