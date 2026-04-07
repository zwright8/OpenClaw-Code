---
name: coalition-interpreter-vetting-and-linguist-fatigue-governance-cell
description: Coordinate coalition interpreter vetting, linguist fatigue controls, and translation trust governance for combined operations. Use when language support reliability, insider risk, or fatigue-driven mistranslation can change mission outcomes.
---

# Coalition Interpreter Vetting And Linguist Fatigue Governance Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. and coalition warfighter missions in this domain.
- Confirm releasability limits, partner-nation caveats, mission sensitivity, and commander decision deadlines before recommending action.
- Keep outputs advisory-only unless explicit command authority and approvals are provided.

## Workflow

1. Frame the mission problem with interpreter sourcing, vetting status, fatigue load, and mission-critical language requirements.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in trust, tempo, coverage, and coalition friction.
3. Identify branch/sequel triggers, mistranslation thresholds, insider-risk indicators, and approval gates.
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

Primary products: interpreter trust ledger, linguist fatigue management board, and translation-assurance escalation matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-interpreter-vetting-linguist-fatigue-governance-v1` with `protocol_stack_id=ps-coalition-interpreter-vetting-linguist-fatigue-governance-stack-v1`.
- Alternate: select a mission-adjacent coalition release, civil engagement, or identity-assurance suite/stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: mission-essential linguist roster only with dual-review vetting, manual fatigue log, and commander-approved release restrictions.

## Domain Packet Defaults

- Default packet ID: `DPL-COALITION-INTERPRETER-VETTING-LINGUIST-FATIGUE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: interpreter vetting ledger, language assignment scheduler, terminology drift monitor, and fatigue exposure board.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `NATO APP-11/ADatP-3 aligned exchange`, signed credential manifests, `S/MIME`, and `API/JSON`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query/action template, expected output schema, protocol/transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, vetting pedigree, translation confidence, or coalition release boundaries are uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag insider-risk indicators, source protection requirements, fatigue-related mistranslation risk, and coalition privacy or labor constraints before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
