---
name: homeland-911-cell-broadcast-authentication-and-mass-notification-continuity-cell
description: Coordinate trusted 911 continuity, cell-broadcast authentication, and mass-notification resilience for U.S. homeland defense support. Use when spoofing, telecom outages, or cyber attacks threaten emergency alert legitimacy and life-safety response.
---

# Homeland 911 Cell Broadcast Authentication And Mass Notification Continuity Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm DSCA authorities, state and local alerting authorities, telecom lead roles, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with PSAP status, alert-channel trust, spoof indicators, and public warning coverage gaps.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in life safety, public trust, restoration tempo, and false-alert risk.
3. Identify branch/sequel triggers, warning hold thresholds, and command approval gates.
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

Primary products: alert authenticity board, PSAP continuity ladder, and warning rollback or reissue matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-911-cell-broadcast-auth-mass-notification-continuity-v1` with `protocol_stack_id=ps-homeland-911-cell-broadcast-auth-mass-notification-continuity-stack-v1`.
- Alternate: select a mission-adjacent DSCA, telecom-restoration, or information-integrity suite/stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: authenticated voice relay, manual PSAP call-tree board, and UTC warning-release readback logging.

## Domain Packet Defaults

- Default packet ID: `DPL-HOMELAND-911-CELL-BROADCAST-AUTHENTICATION-MASS-NOTIFICATION-CONTINUITY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: emergency alert authenticity analyzer, PSAP continuity dashboard, and public warning release workflow.
- Preferred protocol profiles for coordination and machine exchange: `EDXL-DE/CAP`, `NIMS/ICS`, `NIEM`, `USMTF`, and `API/JSON`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query/action template, expected output schema, protocol/transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, warning-source provenance, or public-safety confidence is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag civil authority boundaries, public-alert law, accessibility requirements, and false-alarm consequences before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
