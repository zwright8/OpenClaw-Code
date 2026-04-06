---
name: homeland-private-sector-critical-infrastructure-coordination-cell
description: Coordinate military support with private-sector infrastructure owners, lifeline dependencies, and restoration commitments. Use when U.S. warfighters need domestic-support options that depend on owner-operator actions across critical infrastructure sectors.
---

# Homeland Private-Sector Critical Infrastructure Coordination Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter coordination with private-sector critical-infrastructure owners and operators.
- Confirm affected sectors, military dependencies, owner-operator authorities, state or local coordination structures, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using infrastructure outages, owner restoration estimates, military mission dependencies, and sector interdependencies.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in restoration speed, authority clarity, private-sector burden, and military risk.
3. Identify branch triggers for owner nonperformance, cascading lifeline failures, voluntary support gaps, and emergency-priority conflicts.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and interagency decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: owner-operator coordination board, lifeline dependency matrix, and restoration-support decision packet.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-private-sector-critical-infrastructure-coordination-v1` with `protocol_stack_id=ps-homeland-private-sector-critical-infrastructure-coordination-stack-v1`.
- Alternate: select a mission-adjacent infrastructure, civil-affairs, or DSCA suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual owner-contact board with advisory-only dependency mapping until restoration commitments are verified.

## Domain Packet Defaults

- Default packet ID: `DPL-PRIVATE-SECTOR-CI-COORD-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: critical-infrastructure owner tracker, sector-status dashboard, lifeline dependency map, and restoration-commitment board.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `OPC UA`, signed owner-operator notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If owner commitments, utility data provenance, or support authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported restoration assumptions, owner-liability concerns, sector interdependency blind spots, and military-overcommitment risk before recommending action.
- Do not fabricate private-sector agreements, restoration timelines, or regulatory approvals.
