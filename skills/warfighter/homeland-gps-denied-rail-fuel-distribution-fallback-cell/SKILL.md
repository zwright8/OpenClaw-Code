---
name: homeland-gps-denied-rail-fuel-distribution-fallback-cell
description: Keep military fuel moving across rail and transfer nodes when GPS, timing, and digital dispatch are degraded. Use when homeland defense or mobilization depends on PNT-denied bulk-fuel continuity.
---

# Homeland GPS Denied Rail Fuel Distribution Fallback Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm fuel priorities, rail dispatch authority, timing-confidence loss, transfer-node status, and civil-military coordination requirements.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the fuel-distribution shortfall, denied-PNT condition, and transfer-node dependencies.
2. Separate confirmed train location evidence, dispatch ambiguity, contamination risk, and demand assumptions.
3. Build continue, re-time, stage, convoy-transfer, and manual-block branches with explicit tradeoffs in tempo, safety, and accountability.
4. Bind each branch to rail dispatch, bulk-fuel telemetry, timing fallback, and route-risk tools.
5. Publish decision points, manual-control triggers, and audit requirements for every branch.

## Required Output Format

1. Situation snapshot.
2. Recommended fallback branch and rationale.
3. Alternative branches with triggers.
4. Decision points now, next, and pre-delegated.
5. Staff task tracker with owners and suspense.
6. Rail-fuel fallback packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: denied-PNT rail dispatch ladder, fuel-transfer accountability matrix, continuity throughput estimate.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-gps-denied-rail-fuel-fallback-v1` with `protocol_stack_id=ps-homeland-gps-denied-rail-fuel-fallback-stack-v1`.
- Alternate: `tool_suite_id=ts-logistics-distribution-v1` with `protocol_stack_id=ps-rail-continuity-command-stack-v1`.
- Packet default: `packet_id=DPL-RAIL-FUEL-FALLBACK-001`.
- Degraded: manual rail block sheets and signed fuel-transfer manifests with human acknowledgment.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md`, `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, and `../_shared/references/domain-tool-packet-library.md`.
- Prioritize `EDI X12`, `NIEM`, signed fuel manifests, `API/JSON`, and `USMTF`.
- Include train-location confidence, timing-holdover assumptions, dispatch freshness, and contamination-watch status in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run `../_shared/references/mission-assurance-checklist.md` before release.
- If location confidence, fuel-accountability evidence, or dispatch authority is incomplete, downgrade to advisory-only.

## Guardrails

- Do not fabricate train position, custody-chain integrity, or fuel quality.
- Distinguish PNT loss from cyber-dispatch corruption and from physical rail disruption.
- Surface spill, derailment, and civilian-network safety risks before recommending manual fallback branches.
