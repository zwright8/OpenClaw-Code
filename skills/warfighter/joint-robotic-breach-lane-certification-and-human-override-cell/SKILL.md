---
name: joint-robotic-breach-lane-certification-and-human-override-cell
description: Coordinate robotic breach-lane certification, autonomy confidence, and human-override governance for U.S. warfighter maneuver. Use when robotic breaching, route clearance, or obstacle reduction must be certified before committing forces under fire.
---

# Joint Robotic Breach Lane Certification And Human Override Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm maneuver authority, fires integration rules, engineer safety standards, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with obstacle picture, robotic system health, blue-force exposure, and breach timing.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in breach speed, force protection, and autonomy trust.
3. Identify branch/sequel triggers, certification thresholds, and command approval gates.
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

Primary products: breach-lane certification board, autonomy-confidence ledger, and human-override branch package.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-robotic-breach-lane-certification-human-override-v1` with `protocol_stack_id=ps-joint-robotic-breach-lane-certification-human-override-stack-v1`.
- Alternate: select a mission-adjacent engineer autonomy or route-breach suite/stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: commander-approved manual lane-certification board with human override drills and UTC acknowledgment logging.

## Domain Packet Defaults

- Default packet ID: `DPL-ROBOTIC-BREACH-LANE-CERT-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: engineer route-recon systems, robotic telemetry validators, and breach-lane control boards.
- Preferred protocol profiles for coordination and machine exchange: `CoT`, `VMF`, signed autonomy attestations, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query/action template, expected output schema, protocol/transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, autonomy provenance, or lane-certification evidence is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag legal, ROE, safety, and civilian-harm constraints before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
