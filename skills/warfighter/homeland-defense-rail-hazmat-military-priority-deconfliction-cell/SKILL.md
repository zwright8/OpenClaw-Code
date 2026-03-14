---
name: homeland-defense-rail-hazmat-military-priority-deconfliction-cell
description: Deconflict military rail movement with hazardous-material restrictions and civil emergency demand. Use when homeland defense force flow depends on safe dispatch decisions across shared rail networks.
---

# Homeland Defense Rail Hazmat Military Priority Deconfliction Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm rail corridors, hazmat classes, military movement priorities, civil restrictions, and decision timelines before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the contested rail picture with military demand, hazmat movements, dispatch limits, and civil emergency constraints.
2. Build prioritize, hold, reroute, stage, and split-load branches with explicit safety and readiness tradeoffs.
3. Bind each recommendation to concrete rail-dispatch, hazmat-compliance, and emergency-management tools plus packetized outputs.
4. Publish degraded-mode branches when dispatch authority, hazmat compliance, or rail-status confidence falls below threshold.

## Required Output Format

1. Situation snapshot.
2. Recommended rail branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Rail-deconfliction packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: rail deconfliction matrix, hazmat hold ledger, and military-priority dispatch board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-rail-hazmat-military-priority-deconfliction-v1` with `protocol_stack_id=ps-homeland-rail-hazmat-military-priority-deconfliction-stack-v1`.
- Alternate: manual dispatch board plus hazmat hold-point worksheet.
- Degraded: military-essential moves only with hazmat hold points and manual dispatch approval.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-RAIL-HAZMAT-MILPRIORITY-DECONFLICTION-001` for critical recommendations.
- Prioritize these protocol families for this domain: `NIMS/ICS`, `EDI X12`, `API/JSON`, and `USMTF`.
- Include source system, refresh UTC, confidence, hazmat constraints, and unresolved dispatch conflicts in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run safety, compliance, and mission-assurance checks from `../_shared/references/mission-assurance-checklist.md`.
- If hazmat compliance, dispatch authority, or rail-status evidence is uncertain, downgrade to advisory-only and assign remediation owners.

## Guardrails

- Do not fabricate hazmat compliance, rail clearance, or dispatch authority.
- Separate observed rail bottlenecks from inferred hostile cause.
- Surface life-safety, environmental, and civilian-impact constraints early.
