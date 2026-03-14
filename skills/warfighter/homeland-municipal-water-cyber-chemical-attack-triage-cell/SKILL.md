---
name: homeland-municipal-water-cyber-chemical-attack-triage-cell
description: Coordinate military support triage for municipal water cyber, chemical, and sabotage attacks affecting homeland defense operations. Use when drinking-water systems face OT compromise, contamination, or cascading public-safety impacts that could require defense support.
---

# Homeland Municipal Water Cyber Chemical Attack Triage Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm DSCA authorities, civil lead agency roles, affected installations, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with contamination signals, OT compromise indicators, service-area impacts, and military mission dependencies.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in life safety, water continuity, and force readiness.
3. Identify branch/sequel triggers, isolation thresholds, and command approval gates.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff task tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: contamination triage map, water-system isolation ladder, and military-support prioritization brief.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-municipal-water-cyber-chemical-triage-v1` with `protocol_stack_id=ps-homeland-municipal-water-cyber-chemical-triage-stack-v1`.
- Alternate: select a mission-adjacent civil-support or water-contamination suite/stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: ICS paper battle book with manual sample-chain ledger and hourly command confirmations.

## Domain Packet Defaults

- Default packet ID: `DPL-MUNICIPAL-WATER-CYBER-CHEM-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: water SCADA safety boards, sampling-chain ledgers, and emergency-operations coordination platforms.
- Preferred protocol profiles for coordination and machine exchange: `NIMS/ICS`, `EDXL-DE/CAP`, `OPC UA`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query/action template, expected output schema, protocol/transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, contamination evidence, or OT provenance is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag civil lead-agency authorities, public-health, and environmental constraints before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
