---
name: strategic-quantum-network-key-custody-and-compromise-response-cell
description: Support strategic quantum-network key custody, compromise detection, and rollback-safe continuity decisions. Use when strategic cryptographic trust or command-network integrity is under threat.
---

# Strategic Quantum Network Key Custody And Compromise Response Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm authority, classification, rollback boundaries, and commander decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with key-custody logs, anomaly indicators, trust-chain status, and command authorities.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in trust recovery, continuity, escalation risk, and rollback burden.
3. Identify branch/sequel triggers, degraded-communications thresholds, and command approval gates.
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

Primary products: key-custody matrix, compromise ladder, and cryptographic continuity brief.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-quantum-network-key-custody-and-compromise-response-cell-v1` with `protocol_stack_id=ps-strategic-quantum-network-key-custody-and-compromise-response-cell-stack-v1`.
- Alternate: `tool_suite_id=ts-cyber-defense-v1` with `protocol_stack_id=ps-cop-event-sharing-stack-v1`.
- Degraded: mission-essential channels only with dual-release authority, manual challenge-response, and UTC acknowledgment tracking.

## Domain Packet Defaults

- Default packet ID: `DPL-QUANTUM-NETWORK-KEY-CUSTODY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: quantum key-custody ledgers, compromise detectors, and cryptographic rollback planners.
- Preferred protocol profiles for coordination and machine exchange: `USMTF`, `STIX/TAXII`, `NIEM`, and `API/JSON`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query/action template, expected output schema, protocol/transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, compromise evidence, or provenance is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag strategic-communications, legal, and rollback-safety constraints before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
