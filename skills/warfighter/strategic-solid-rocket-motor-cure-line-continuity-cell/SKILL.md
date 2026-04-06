---
name: strategic-solid-rocket-motor-cure-line-continuity-cell
description: Protect and reconstitute solid rocket motor cure lines, lot integrity, and acceptance sequencing for strategic missile readiness. Use when cure-line disruption threatens magazines, launch programs, or deterrence timelines.
---

# Strategic Solid Rocket Motor Cure Line Continuity Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm threatened cure lines, lot priorities, environmental controls, acceptance authorities, and downstream missile or launch dependencies.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the cure-line disruption, affected lots, environmental exposure, and readiness impact.
2. Separate verified process telemetry, quality hold conditions, sabotage indicators, and unknowns.
3. Build continue, quarantine, redistribute, accelerate, and rebuild branches with explicit tradeoffs in safety, throughput, and strategic timing.
4. Bind each branch to cure-line telemetry, lot genealogy, quality-release, and strategic allocation tools.
5. Publish decision points, lot-release triggers, and authority gates for every continuity branch.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternative branches with triggers.
4. Decision points now, next, and pre-delegated.
5. Staff task tracker with owners and suspense.
6. Cure-line continuity packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: cure-line continuity ladder, lot quarantine matrix, strategic magazine recovery timeline.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-solid-rocket-motor-cure-line-continuity-v1` with `protocol_stack_id=ps-strategic-solid-rocket-motor-cure-line-continuity-stack-v1`.
- Alternate: `tool_suite_id=ts-strategic-deterrence-v1` with `protocol_stack_id=ps-solid-rocket-propellant-aging-stack-v1`.
- Packet default: `packet_id=DPL-SOLID-ROCKET-CURELINE-001`.
- Degraded: manual lot-hold ledger and certifying-authority release board only.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md`, `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, and `../_shared/references/domain-tool-packet-library.md`.
- Prioritize `OPC UA`, signed quality manifests, `NIEM`, `API/JSON`, and `USMTF`.
- Include telemetry freshness, environmental-control status, lot pedigree, and quality-confidence evidence in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run `../_shared/references/mission-assurance-checklist.md` before release.
- If process integrity, quality release, or strategic allocation authority is uncertain, downgrade to advisory-only.

## Guardrails

- Do not fabricate cure-line health, lot release, or strategic readiness confidence.
- Distinguish sabotage, contamination, environmental drift, and equipment failure pathways.
- Surface explosive-safety, treaty, and strategic signaling consequences before recommending accelerated release or cross-leveling.
