---
name: joint-undersea-cable-sabotage-forensics-and-restoration-cell
description: Coordinate undersea cable sabotage forensics, custody integrity, and restoration sequencing for U.S. warfighter mission continuity. Use when anomalous cable events require both legally defensible attribution and prioritized repair decisions.
---

# Joint Undersea Cable Sabotage Forensics And Restoration Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm maritime authorities, evidence-handling rules, coalition caveats, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with cable telemetry anomalies, suspected sabotage indicators, repair capacity, and mission-network dependencies.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in attribution confidence, restoration tempo, exposure risk, and escalation signaling.
3. Identify branch/sequel triggers, evidence-preservation thresholds, and command approval gates.
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

Primary products: sabotage attribution ladder, restoration sequence plan, and narrative-risk brief.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-undersea-cable-sabotage-forensics-restoration-v1` with `protocol_stack_id=ps-joint-undersea-cable-sabotage-forensics-restoration-stack-v1`.
- Alternate: select a mission-adjacent undersea, maritime, or network-continuity suite/stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual incident board with delayed forensic review lane, fixed restoration priorities, and UTC acknowledgment logging.

## Domain Packet Defaults

- Default packet ID: `DPL-UNDERSEA-CABLE-SABOTAGE-FORENSICS-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: undersea telemetry fusion board, maritime anomaly forensics engine, and restoration sequence planner.
- Preferred protocol profiles for coordination and machine exchange: `AIS/NMEA`, `USMTF`, `STIX/TAXII`, `NIEM`, and `API/JSON`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query/action template, expected output schema, protocol/transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, telemetry provenance, or evidence custody is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag attribution uncertainty, maritime safety, repair-rights issues, and coalition disclosure constraints before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
