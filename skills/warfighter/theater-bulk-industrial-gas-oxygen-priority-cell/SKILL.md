---
name: theater-bulk-industrial-gas-oxygen-priority-cell
description: Prioritize bulk oxygen, nitrogen, argon, and specialty-gas distribution across medical, aviation, fabrication, and maintenance demand in theater. Use when plant outages or contested logistics threaten life support and sustainment.
---

# Theater Bulk Industrial Gas Oxygen Priority Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm supported facilities, gas purity requirements, refill capacity, transport constraints, and commander decision timelines before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame gas production, storage, refill, transport, and demand across medical, aviation, engineering, and industrial users.
2. Detect plant outages, cylinder losses, cryogenic transport gaps, or purity risks that could fracture care or maintenance throughput.
3. Build allocate, reroute, refill, substitute, and conservation branches with explicit life-safety and readiness tradeoffs.
4. Bind each recommendation to concrete tank telemetry, refill scheduling, and packetized priority outputs.

## Required Output Format

1. Situation snapshot.
2. Recommended priority branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Industrial-gas and oxygen packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: gas priority allocation board, refill and transport ladder, and cross-demand conflict matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-bulk-industrial-gas-oxygen-priority-v1` with `protocol_stack_id=ps-theater-bulk-industrial-gas-oxygen-priority-stack-v1`.
- Alternate: manual refill board plus cylinder-distribution worksheet.
- Degraded: medical and mission-essential gas distribution only with command-approved rationing.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-INDUSTRIAL-GAS-OXYGEN-PRIORITY-001` for critical recommendations.
- Prioritize these protocol families for this domain: `HL7/FHIR`, signed logistics manifests, `API/JSON`, and `USMTF`.
- Include source system, refresh UTC, confidence, purity constraints, and unresolved transport gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run purity and demand-priority checks from `../_shared/references/mission-assurance-checklist.md`.
- If purity evidence, refill status, or distribution authority is uncertain, downgrade to advisory-only and assign remediation owners.

## Guardrails

- Do not fabricate gas purity, cylinder counts, refill status, or medical demand.
- Separate observed outages from inferred sabotage or operator error.
- Surface life-safety, hazardous-material, and transport compatibility constraints early.
