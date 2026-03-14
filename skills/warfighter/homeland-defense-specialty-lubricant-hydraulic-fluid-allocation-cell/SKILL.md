---
name: homeland-defense-specialty-lubricant-hydraulic-fluid-allocation-cell
description: Govern specialty lubricant and hydraulic-fluid allocation for homeland defense bases, depots, and industrial nodes when shortages threaten aircraft, vehicles, shipyards, and critical support equipment.
---

# Homeland Defense Specialty Lubricant Hydraulic Fluid Allocation Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm supported systems, compatibility rules, contamination risk, storage posture, and commander decision timelines before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame fluid inventories, contamination controls, refill pipelines, and defense-priority demand across bases, depots, and industrial support nodes.
2. Detect shortage, contamination, storage loss, or delivery delays that can degrade mission-capable rates or repair throughput.
3. Build allocate, quarantine, test, redistribute, and substitute branches with explicit safety and readiness tradeoffs.
4. Bind each recommendation to concrete pedigree, contamination-testing, and packetized priority outputs.

## Required Output Format

1. Situation snapshot.
2. Recommended allocation branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Lubricant and hydraulic-fluid packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: fluid allocation board, contamination and compatibility risk ledger, and mission-capable restoration ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-defense-specialty-lubricant-hydraulic-fluid-allocation-v1` with `protocol_stack_id=ps-homeland-defense-specialty-lubricant-hydraulic-fluid-allocation-stack-v1`.
- Alternate: manual fluid-compatibility board plus contamination-review worksheet.
- Degraded: mission-essential systems only with conservative substitution and refill approval.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-LUBRICANT-HYDRAULIC-ALLOCATION-001` for critical recommendations.
- Prioritize these protocol families for this domain: signed material-cert manifests, `API/JSON`, `USMTF`, and `NIEM`.
- Include source system, refresh UTC, confidence, compatibility limits, and unresolved contamination gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run compatibility and contamination checks from `../_shared/references/mission-assurance-checklist.md`.
- If pedigree, contamination evidence, or substitution authority is uncertain, downgrade to advisory-only and assign remediation owners.

## Guardrails

- Do not fabricate fluid compatibility, contamination test results, refill status, or mission-capable gains.
- Separate observed contamination or shortage from inferred hostile cause.
- Surface safety, environmental, and equipment-damage consequences early.
