---
name: expeditionary-battlefield-hydrogen-production-storage-and-blast-safety-cell
description: Govern expeditionary hydrogen generation, storage, and blast safety when fuel-cell power, maintenance, or local production introduce new hazards at forward sites. Use when commanders need hydrogen-enabled energy resilience without uncontrolled explosion risk.
---

# Expeditionary Battlefield Hydrogen Production Storage And Blast Safety Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm generation methods, storage posture, fuel-cell demand, explosive-safety constraints, and commander decision timelines before producing recommendations.
- Keep outputs advisory-only by default and require explicit human command approval for branches that materially change base hazard posture.

## Workflow

1. Frame the hydrogen production chain, storage geometry, ventilation controls, and mission dependencies most exposed to ignition or contamination risk.
2. Build primary and alternate production, storage, dispersion, and shutdown branches with explicit tradeoffs in power continuity, hazard exposure, and sustainment tempo.
3. Bind each recommendation to concrete industrial-control, hazardous-material, and emergency-response tools plus packetized outputs.
4. Run safety, authority, and acknowledgment checks before publishing commander-facing recommendations.

## Required Output Format

1. Situation snapshot.
2. Recommended hydrogen safety branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Hydrogen packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: hydrogen safety release matrix, refuel-node blast map, and production or storage shutdown ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-expeditionary-hydrogen-production-storage-blast-safety-v1` with `protocol_stack_id=ps-expeditionary-hydrogen-production-storage-blast-safety-stack-v1`.
- Alternate: manual hazmat board plus engineer ventilation and standoff worksheet.
- Degraded: minimum-safe production only with dual safety officer review and reduced storage density.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-HYDROGEN-PRODUCTION-BLAST-SAFETY-001` for critical recommendations.
- Prioritize these protocol families for this domain: `OPC UA`, signed safety manifests, `NIMS/ICS`, `API/JSON`, and `USMTF`.
- Include source system, refresh UTC, confidence, hazard status, and unresolved ignition or storage-control gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run cross-source validation from `../_shared/references/mission-assurance-checklist.md`.
- If hazardous-material status, ventilation integrity, or explosive-safety authority is uncertain, downgrade to advisory-only and assign closure actions.

## Guardrails

- Do not fabricate explosive-safety clearances, sensor health, or engineering inspections.
- Separate observed safety facts from estimated blast consequences and mission convenience.
- Surface civilian, environmental, and ammunition-compatibility effects of hydrogen storage changes early.
